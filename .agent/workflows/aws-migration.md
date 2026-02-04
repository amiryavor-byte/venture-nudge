---
description: Quick reference for when to migrate to AWS
---

# AWS Migration Quick Reference

## TL;DR
**Stay on Vercel until you hit ANY of these triggers:**
- 50,000+ monthly active users
- Vercel costs exceed $400/month
- Database storage exceeds 100GB
- Need custom infrastructure (background jobs, ML pipelines)

**Then read**: [`docs/AWS_MIGRATION_GUIDE.md`](file:///Users/amir/Documents/ai%20workspace/Businessplanner/docs/AWS_MIGRATION_GUIDE.md)

## Pre-Migration Checklist
```bash
# 1. Audit current scale
echo "Database size:" && psql $DATABASE_URL -c "SELECT pg_database_size('postgres');"
echo "Monthly users:" && psql $DATABASE_URL -c "SELECT COUNT(DISTINCT user_id) FROM sessions WHERE created_at > NOW() - INTERVAL '30 days';"

# 2. Export environment variables
npx vercel env pull .env.production

# 3. Verify Dockerfile builds
docker build -t venture-nudge .
docker run -p 3000:3000 venture-nudge

# 4. Install AWS CLI
brew install awscli
aws configure
```

## Migration Day Commands
```bash
# Export database
pg_dump $VERCEL_DATABASE_URL > venture_nudge_backup.sql

# Import to RDS
psql -h $RDS_ENDPOINT -U postgres -d venturenudge < venture_nudge_backup.sql

# Deploy to ECS
aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>
docker build -t <ecr-url>/venture-nudge:latest .
docker push <ecr-url>/venture-nudge:latest
aws ecs update-service --cluster venture-nudge-production --service venture-nudge-service --force-new-deployment

# Update DNS
# (Manual: Update Cloudflare/Route 53 to point to CloudFront)
```

## Rollback Commands
```bash
# Revert DNS to Vercel
# (Manual: Update DNS CNAME back to Vercel)

# Sync latest data back to Vercel
pg_dump -h $RDS_ENDPOINT -U postgres venturenudge > /tmp/rollback.sql
psql $VERCEL_DATABASE_URL < /tmp/rollback.sql
```

## Cost Comparison
| Users | Vercel | AWS |
|-------|--------|-----|
| 10K   | $40/mo | $220/mo + DevOps |
| 50K   | $250/mo | $320/mo + DevOps |
| 100K+ | $800/mo | **$400/mo** + DevOps |

**Breakeven**: ~100K users

## Decision Tree
```
Do you have 50K+ users?
├─ No → Stay on Vercel
└─ Yes → Do you have revenue for DevOps?
    ├─ No → Stay on Vercel
    └─ Yes → Read full migration guide
```
