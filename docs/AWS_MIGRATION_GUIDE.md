# AWS Migration Guide for Venture Nudge

> **Status**: This is a forward-looking migration guide. Complete this migration when you reach **50,000+ monthly active users** or when Vercel costs exceed **$400/month**.

## Table of Contents
1. [When to Migrate](#when-to-migrate)
2. [Cost Analysis](#cost-analysis)
3. [Architecture Overview](#architecture-overview)
4. [Migration Checklist](#migration-checklist)
5. [Step-by-Step Migration](#step-by-step-migration)
6. [Rollback Plan](#rollback-plan)
7. [Post-Migration Validation](#post-migration-validation)

---

## When to Migrate

### Migration Triggers (Any One)
- ✅ **50,000+ monthly active users**
- ✅ **Vercel bandwidth costs exceed $400/month**
- ✅ **Need for custom infrastructure** (background jobs, WebSocket servers, ML pipelines)
- ✅ **Enterprise compliance requirements** (HIPAA, SOC2 with dedicated VPC)
- ✅ **Database storage exceeds 100GB** (Vercel Postgres becomes expensive)

### Don't Migrate If:
- ❌ You're under 20K users (Vercel is still cheaper when factoring in DevOps time)
- ❌ You don't have dedicated DevOps expertise
- ❌ Your monthly revenue is under $10K (focus on growth, not infrastructure)

---

## Cost Analysis

### Current Stack (Vercel + Vercel Postgres)
```
Vercel Pro:              $20/month
Vercel Postgres (5GB):   $20/month
Total:                   $40/month (up to ~10K users)
```

### AWS Equivalent (50K+ users)
```
Infrastructure:
- EC2 (t3.large x2, reserved):        $60/month
- RDS Postgres (db.t3.medium):        $50/month
- Application Load Balancer:          $20/month
- CloudFront (CDN):                   $40/month
- S3 (static assets):                 $5/month
- ECR (Docker registry):              $5/month
- CloudWatch (monitoring):            $10/month
- Data transfer:                      $30/month
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:                             $220/month

Labor (0.25 FTE DevOps @ $120K/year): $2,500/month
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Cost of Ownership:              $2,720/month
```

**Breakeven Point**: ~100K users (when Vercel would cost $800+/month and you have revenue for DevOps)

---

## Architecture Overview

### Current (Vercel)
```
┌─────────────────────────────────────────┐
│           Vercel Edge Network           │
│  (Auto-scaling, Global CDN, SSL/TLS)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Next.js App (Serverless)           │
│  • API Routes (auto-scaling)            │
│  • Server Components                    │
│  • Static Generation                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        Vercel Postgres                   │
│  (Managed, auto-scaling)                │
└─────────────────────────────────────────┘
```

### Target (AWS)
```
┌─────────────────────────────────────────┐
│         Route 53 (DNS)                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   CloudFront (CDN) + ACM (SSL/TLS)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Application Load Balancer (ALB)        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   ECS Fargate (Docker Containers)       │
│  • Next.js App (2+ instances)           │
│  • Auto-scaling based on CPU/traffic    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    RDS PostgreSQL (Multi-AZ)            │
│  • Automated backups                    │
│  • Read replicas (if needed)            │
└─────────────────────────────────────────┘
```

---

## Migration Checklist

### Phase 0: Preparation (1 week before)
- [ ] **Audit current database size**: `SELECT pg_database_size('postgres');`
- [ ] **Export environment variables**: `npx vercel env pull .env.production`
- [ ] **Document all integrations**: OpenAI API, Agora, Tavily, etc.
- [ ] **Set up AWS account**: Enable MFA, create IAM users
- [ ] **Install AWS CLI**: `brew install awscli && aws configure`
- [ ] **Create backup domain**: Set up `aws.venturenudge.com` for testing
- [ ] **Notify users**: Schedule maintenance window (Sunday 2-6 AM ET recommended)

### Phase 1: Database Migration
- [ ] **Provision RDS**: Create PostgreSQL instance (db.t3.medium, Multi-AZ)
- [ ] **Configure security groups**: Allow inbound 5432 from app layer only
- [ ] **Export Vercel Postgres**:
  ```bash
  pg_dump $DATABASE_URL > venture_nudge_backup.sql
  ```
- [ ] **Import to RDS**:
  ```bash
  psql -h <rds-endpoint> -U postgres -d venturenudge < venture_nudge_backup.sql
  ```
- [ ] **Verify row counts**: Ensure all tables migrated correctly
- [ ] **Test read/write**: Run seed scripts against RDS

### Phase 2: Application Containerization
- [ ] **Update Dockerfile** (already exists in your repo)
- [ ] **Test Docker build locally**:
  ```bash
  docker build -t venture-nudge .
  docker run -p 3000:3000 venture-nudge
  ```
- [ ] **Create ECR repository**:
  ```bash
  aws ecr create-repository --repository-name venture-nudge
  ```
- [ ] **Push image to ECR**:
  ```bash
  aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>
  docker tag venture-nudge:latest <ecr-url>/venture-nudge:latest
  docker push <ecr-url>/venture-nudge:latest
  ```

### Phase 3: Infrastructure Setup
- [ ] **Create VPC**: Use default or create custom with public/private subnets
- [ ] **Create ALB**: Application Load Balancer with HTTPS listener
- [ ] **Request ACM certificate**: For `venturenudge.com` and `*.venturenudge.com`
- [ ] **Create ECS cluster**: `venture-nudge-production`
- [ ] **Define ECS task**:
  - CPU: 2048 (2 vCPU)
  - Memory: 4096 MB
  - Environment variables from Vercel
- [ ] **Create ECS service**: Auto-scaling (min: 2, max: 10)
- [ ] **Configure ALB target group**: Health check on `/api/health`

### Phase 4: DNS Cutover
- [ ] **Test AWS deployment**: Verify `aws.venturenudge.com` works
- [ ] **Enable CloudFront**: Cache static assets, compress responses
- [ ] **Update DNS (Staged)**:
  1. Lower TTL to 300 seconds (5 min) - **24 hours before cutover**
  2. Create CNAME: `venturenudge.com` → CloudFront distribution
  3. Monitor CloudWatch for errors
- [ ] **Enable read-only mode**: Set banner in Vercel app during cutover
- [ ] **Final database sync**: Export latest changes from Vercel → RDS
- [ ] **Switch traffic**: Update primary DNS to AWS
- [ ] **Monitor**: Watch CloudWatch, ALB metrics, RDS connections

### Phase 5: Post-Migration
- [ ] **Keep Vercel running**: As fallback for 7 days
- [ ] **Set up monitoring**:
  - CloudWatch dashboards
  - RDS performance insights
  - ALB access logs
- [ ] **Configure backups**: RDS automated backups (7-day retention)
- [ ] **Stress test**: Simulate 10K concurrent users
- [ ] **Update documentation**: Record all AWS resource IDs
- [ ] **Decommission Vercel**: After 30 days of stable AWS operation

---

## Step-by-Step Migration

### 1. Create Production-Ready Dockerfile

Your repo already has a Dockerfile. Update it to ensure it's production-optimized:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

**Update `next.config.js`** to enable standalone output:

```javascript
module.exports = {
  output: 'standalone', // Required for Docker deployment
  // ... other config
};
```

### 2. Database Migration Script

Create `scripts/migrate-to-rds.sh`:

```bash
#!/bin/bash
set -e

echo "🔄 Starting database migration to AWS RDS..."

# Export from Vercel Postgres
echo "📤 Exporting from Vercel Postgres..."
pg_dump $VERCEL_DATABASE_URL > /tmp/venture_nudge_export.sql

# Import to RDS
echo "📥 Importing to AWS RDS..."
psql -h $RDS_ENDPOINT -U $RDS_USER -d venturenudge < /tmp/venture_nudge_export.sql

# Verify
echo "✅ Verifying migration..."
VERCEL_COUNT=$(psql $VERCEL_DATABASE_URL -t -c "SELECT COUNT(*) FROM users;")
RDS_COUNT=$(psql -h $RDS_ENDPOINT -U $RDS_USER -d venturenudge -t -c "SELECT COUNT(*) FROM users;")

if [ "$VERCEL_COUNT" -eq "$RDS_COUNT" ]; then
  echo "✅ Migration successful! User count matches: $VERCEL_COUNT"
else
  echo "❌ Migration failed! Count mismatch: Vercel=$VERCEL_COUNT, RDS=$RDS_COUNT"
  exit 1
fi

# Cleanup
rm /tmp/venture_nudge_export.sql
echo "🎉 Database migration complete!"
```

### 3. Infrastructure as Code (Terraform)

Create `terraform/main.tf`:

```hcl
# This is a starter template. Expand as needed.

provider "aws" {
  region = "us-east-1"
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier           = "venture-nudge-db"
  engine              = "postgres"
  engine_version      = "16.1"
  instance_class      = "db.t3.medium"
  allocated_storage   = 100
  storage_encrypted   = true
  multi_az            = true
  
  db_name  = "venturenudge"
  username = var.db_username
  password = var.db_password
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  skip_final_snapshot = false
  final_snapshot_identifier = "venture-nudge-final-snapshot"
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "venture-nudge-production"
}

# ALB
resource "aws_lb" "main" {
  name               = "venture-nudge-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
}

# CloudFront
resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name = aws_lb.main.dns_name
    origin_id   = "ALB"
  }
  
  enabled             = true
  comment             = "Venture Nudge CDN"
  default_root_object = "/"
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ALB"
    
    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    acm_certificate_arn = var.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }
}
```

Apply with:
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 4. CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy-aws.yml`:

```yaml
name: Deploy to AWS ECS

on:
  push:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: venture-nudge
  ECS_SERVICE: venture-nudge-service
  ECS_CLUSTER: venture-nudge-production
  ECS_TASK_DEFINITION: venture-nudge-task

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster $ECS_CLUSTER \
            --service $ECS_SERVICE \
            --force-new-deployment
```

### 5. Environment Variables

Create `scripts/sync-env-to-aws.sh`:

```bash
#!/bin/bash
# Export all Vercel env vars and set them in AWS ECS Task Definition

npx vercel env pull .env.production

# Convert to ECS format
while IFS='=' read -r key value; do
  aws ssm put-parameter \
    --name "/venture-nudge/production/$key" \
    --value "$value" \
    --type "SecureString" \
    --overwrite
done < .env.production

echo "✅ Environment variables synced to AWS SSM Parameter Store"
```

### 6. Health Check Endpoint

Create `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET() {
  try {
    // Check database connection
    await db.execute('SELECT 1');
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

Configure ALB to use this endpoint for health checks.

---

## Rollback Plan

### Immediate Rollback (Within 24 Hours)

If critical issues arise:

1. **Revert DNS**:
   ```bash
   # Point domain back to Vercel
   # Update Cloudflare/Route 53 CNAME to Vercel edge
   ```

2. **Sync Latest Data**:
   ```bash
   # Export from RDS
   pg_dump -h $RDS_ENDPOINT -U postgres venturenudge > /tmp/rollback.sql
   
   # Import to Vercel Postgres
   psql $VERCEL_DATABASE_URL < /tmp/rollback.sql
   ```

3. **Verify Vercel**:
   - Test all critical user flows
   - Check analytics dashboard
   - Confirm OpenAI API calls working

4. **Communicate**:
   - Update status page
   - Email affected users (if any)

### Gradual Rollback (If AWS is Unstable)

Use **weighted DNS routing** to gradually shift traffic:

1. Week 1: 10% AWS, 90% Vercel
2. Week 2: 25% AWS, 75% Vercel
3. Week 3: 50% AWS, 50% Vercel
4. Week 4: 100% AWS (if stable)

---

## Post-Migration Validation

### Critical Tests
- [ ] **User authentication**: Sign up, log in, password reset
- [ ] **Business plan generation**: Create new plan via AI agent
- [ ] **Real-time chat**: Test OpenAI Realtime API integration
- [ ] **Database writes**: Create/update/delete operations
- [ ] **File uploads**: Avatar images, custom themes
- [ ] **Payment processing**: (If implemented) Subscription flow
- [ ] **Admin panel**: User management, affiliate configuration

### Performance Benchmarks
- [ ] **Page load time**: < 2 seconds (vs Vercel baseline)
- [ ] **API response time**: < 500ms (vs Vercel baseline)
- [ ] **Database query time**: < 100ms (vs Vercel Postgres baseline)
- [ ] **Time to First Byte (TTFB)**: < 800ms globally

### Monitoring Setup
- [ ] **CloudWatch Dashboards**: CPU, memory, network, request count
- [ ] **RDS Performance Insights**: Query performance, connection pooling
- [ ] **ALB Metrics**: 5xx errors, target health, latency
- [ ] **Custom Metrics**: Business KPIs (plans created, chat sessions, revenue)

### Cost Validation
- [ ] Compare first-month AWS bill to projected costs
- [ ] Identify unexpected charges (data transfer, NAT gateway)
- [ ] Set up billing alerts at $200, $400, $600 thresholds

---

## Additional Resources

### AWS Documentation
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html)
- [RDS PostgreSQL Performance Tuning](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)
- [CloudFront Cache Optimization](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ConfiguringCaching.html)

### Cost Optimization
- Use **Reserved Instances** for RDS (save 40%)
- Use **Savings Plans** for ECS Fargate (save 50%)
- Enable **S3 Intelligent Tiering** for old static assets
- Use **CloudFront compression** to reduce bandwidth costs

### Security Hardening
- Enable **AWS WAF** to block common attacks ($5/month)
- Use **AWS Secrets Manager** for database credentials ($0.40/secret/month)
- Enable **RDS encryption at rest** (included)
- Set up **VPC Flow Logs** for network monitoring ($0.50/GB)

---

## Decision Log

### Why ECS Fargate (Not EC2 or Lambda)?
- **vs EC2**: No server management, auto-scaling without manual intervention
- **vs Lambda**: Next.js SSR needs persistent containers; Lambda cold starts hurt UX
- **vs EKS**: Fargate is simpler; Kubernetes is overkill for a monolithic Next.js app

### Why RDS (Not Aurora or Self-Hosted)?
- **vs Aurora**: RDS is cheaper for <100GB databases; Aurora shines at 500GB+
- **vs Self-Hosted EC2**: RDS handles backups, patches, Multi-AZ failover automatically

### Why CloudFront (Not Just ALB)?
- **Global Edge**: Vercel's CDN is a key feature; CloudFront replicates this on AWS
- **Cost**: CloudFront is cheaper than ALB data transfer at scale

---

## Contact for Help

When you're ready to migrate, consider:
- **AWS Professional Services**: Get 1:1 migration support
- **DevOps Consultant**: Hire for 1-2 weeks to own the migration
- **AI Agent**: Use this guide with an AI agent to execute the migration semi-autonomously

**Estimated Migration Timeline**: 2-3 weeks with dedicated focus

---

*Last Updated*: February 2026  
*Next Review*: When Venture Nudge reaches 30K users or $300/month Vercel costs
