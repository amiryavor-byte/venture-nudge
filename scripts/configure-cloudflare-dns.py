#!/usr/bin/env python3
"""
Cloudflare DNS automation script for Vercel deployment
Adds A records for venturenudge.com and www.venturenudge.com
"""

import os
import json
import urllib.request
import urllib.error
import sys

# Cloudflare API configuration
CF_API_TOKEN = os.getenv('CLOUDFLARE_API_TOKEN')
CF_ZONE_ID = os.getenv('CLOUDFLARE_ZONE_ID')

if not CF_API_TOKEN:
    print("ERROR: CLOUDFLARE_API_TOKEN not set. Please provide your Cloudflare API token.")
    sys.exit(1)

if not CF_ZONE_ID:
    print("INFO: CLOUDFLARE_ZONE_ID not set. Fetching zone ID for venturenudge.com...")
    
    # Fetch zone ID
    req = urllib.request.Request(
        'https://api.cloudflare.com/client/v4/zones?name=venturenudge.com',
        headers={'Authorization': f'Bearer {CF_API_TOKEN}'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data['success'] and len(data['result']) > 0:
                CF_ZONE_ID = data['result'][0]['id']
                print(f"Found zone ID: {CF_ZONE_ID}")
            else:
                print("ERROR: Could not find zone for venturenudge.com")
                sys.exit(1)
    except urllib.error.HTTPError as e:
        print(f"ERROR: Failed to fetch zone: {e.code} - {e.read().decode()}")
        sys.exit(1)

def create_dns_record(name, target_ip='76.76.21.21'):
    """Create an A record in Cloudflare"""
    
    # Check if record exists first
    req = urllib.request.Request(
        f'https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/dns_records?name={name}',
        headers={'Authorization': f'Bearer {CF_API_TOKEN}'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data['success'] and len(data['result']) > 0:
                # Record exists, update it
                record_id = data['result'][0]['id']
                update_data = json.dumps({
                    'type': 'A',
                    'name': name,
                    'content': target_ip,
                    'ttl': 1,  # Auto
                    'proxied': False  # MUST be False for Vercel
                }).encode('utf-8')
                
                req = urllib.request.Request(
                    f'https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/dns_records/{record_id}',
                    data=update_data,
                    headers={
                        'Authorization': f'Bearer {CF_API_TOKEN}',
                        'Content-Type': 'application/json'
                    },
                    method='PUT'
                )
                
                with urllib.request.urlopen(req) as response:
                    result = json.loads(response.read().decode())
                    if result['success']:
                        print(f"✓ Updated A record: {name} → {target_ip}")
                        return True
                    else:
                        print(f"✗ Failed to update {name}: {result.get('errors')}")
                        return False
    except urllib.error.HTTPError:
        pass  # Record doesn't exist, create it
    
    # Create new record
    create_data = json.dumps({
        'type': 'A',
        'name': name,
        'content': target_ip,
        'ttl': 1,
        'proxied': False
    }).encode('utf-8')
    
    req = urllib.request.Request(
        f'https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/dns_records',
        data=create_data,
        headers={
            'Authorization': f'Bearer {CF_API_TOKEN}',
            'Content-Type': 'application/json'
        }
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            if result['success']:
                print(f"✓ Created A record: {name} → {target_ip}")
                return True
            else:
                print(f"✗ Failed to create {name}: {result.get('errors')}")
                return False
    except urllib.error.HTTPError as e:
        print(f"✗ HTTP Error creating {name}: {e.code} - {e.read().decode()}")
        return False

# Create DNS records
print("Configuring DNS for Vercel deployment...")
print("=" * 50)

success = True
success &= create_dns_record('venturenudge.com')
success &= create_dns_record('www.venturenudge.com')

print("=" * 50)
if success:
    print("✓ DNS configuration complete!")
    print("\nNext steps:")
    print("1. Wait 1-2 minutes for DNS propagation")
    print("2. Vercel will auto-verify and issue SSL certificates")
    print("3. Your site will be live at https://venturenudge.com")
else:
    print("✗ Some DNS records failed to configure")
    print("Please check the errors above and configure manually in Cloudflare dashboard")
    sys.exit(1)
