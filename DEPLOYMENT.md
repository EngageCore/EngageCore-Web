# Deployment Guide

This guide explains how to set up automatic deployment from GitHub to EC2 using Docker and GitHub Actions for the EngageCore-Web frontend application.

## Prerequisites

1. **EC2 Instance**: An EC2 instance running Amazon Linux 2 or Ubuntu
2. **Docker**: Docker and Docker Compose installed on the EC2 instance
3. **GitHub Repository**: Your code pushed to GitHub
4. **SSH Key**: The PEM file for accessing your EC2 instance

## Setup Instructions

### 1. Install Docker on EC2 Instance

SSH into your EC2 instance and install Docker:

```bash
# For Amazon Linux 2
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# For Ubuntu
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

**Note**: After adding user to docker group, you may need to log out and log back in.

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add the following secrets:

- **EC2_SSH_KEY**: The contents of your PEM file (the entire file content)
- **EC2_HOST**: Your EC2 instance IP or hostname (e.g., `13.214.183.187`)
- **EC2_USER**: The SSH user (e.g., `ec2-user`)

#### How to get EC2_SSH_KEY:
1. Open your PEM file (e.g., `engage-core.pem`)
2. Copy the entire contents (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)
3. Paste it as the value for `EC2_SSH_KEY` secret

### 3. Configure EC2 Security Group

Ensure your EC2 security group allows:
- **Inbound SSH (port 22)** from your IP or GitHub Actions IPs
- **Inbound HTTP (port 80)** from anywhere or specific IPs
- **Inbound HTTPS (port 443)** if you plan to use SSL/TLS

### 4. Initial Setup on EC2

Run these commands once on your EC2 instance:

```bash
# Create deployment directory
mkdir -p /home/ec2-user/engagecore-web

# Set proper permissions
chmod 755 /home/ec2-user/engagecore-web
```

## How It Works

1. **Trigger**: When you push to `main` or `master` branch, GitHub Actions workflow is triggered
2. **Version Generation**: A unique version is generated from commit SHA and timestamp (e.g., `a1b2c3d-20251201-021500`)
3. **Build**: The workflow builds a Docker image with the Vue.js app (using multi-stage build: Node.js for building, Nginx for serving)
4. **Deploy**: The versioned Docker image is transferred to EC2 and deployed using Docker Compose
5. **Restart**: The old container is stopped and a new one is started with the new version
6. **Version Tracking**: The deployed version is saved for rollback purposes

## Manual Deployment

You can also trigger deployment manually:

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Deploy to EC2" workflow
4. Click "Run workflow"

## Troubleshooting

### Container fails to start
```bash
# SSH into EC2 and check logs
ssh -i "path/to/engage-core.pem" ec2-user@13.214.183.187
cd /home/ec2-user/engagecore-web
docker-compose logs
```

### Check container status
```bash
docker ps -a
docker-compose ps
```

### View container logs
```bash
docker-compose logs -f engagecore-web
```

### Restart container manually
```bash
cd /home/ec2-user/engagecore-web
docker-compose restart
```

### Check Docker service
```bash
sudo systemctl status docker
```

### Permission issues
```bash
# Ensure ec2-user is in docker group
sudo usermod -aG docker ec2-user
# Log out and log back in
```

### Port conflicts
If port 80 is already in use, you can modify `docker-compose.yml` to use a different port:

```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

### Nginx configuration
The nginx configuration is located in `nginx.conf` and handles:
- SPA routing (Vue Router)
- Static asset caching
- Gzip compression
- Security headers
- Health check endpoint

To modify nginx configuration:
1. Edit `nginx.conf` in the repository
2. Rebuild and redeploy

## Versioning and Rollback

The deployment system includes automatic versioning and manual rollback capabilities.

### How Versioning Works

- Each deployment is automatically tagged with a version: `<commit-sha>-<timestamp>`
- Example: `a1b2c3d-20251201-021500`
- All versions are kept on the EC2 instance for rollback purposes
- The `latest` tag always points to the most recent deployment

### Listing Available Versions

SSH into your EC2 instance and run:

```bash
cd /home/ec2-user/engagecore-web
./list-versions.sh
```

This will show:
- Currently deployed version
- All available versions with creation dates and sizes
- Version information files

### Rolling Back to a Previous Version

To rollback to a previous version:

```bash
cd /home/ec2-user/engagecore-web
./rollback.sh <version>
```

Example:
```bash
./rollback.sh a1b2c3d-20251201-021500
```

The rollback script will:
1. Show the current version and target version
2. Ask for confirmation
3. Stop the current container
4. Start the container with the specified version
5. Verify the container is running

### Version Management

- **Automatic versioning**: Every deployment creates a new version tag
- **Version retention**: Last 5 deployment tar files are kept (older ones are cleaned up)
- **Docker images**: All versioned Docker images are kept on the server for rollback
- **Version tracking**: Current version is stored in `.current_version` file

## Files Created

- **Dockerfile**: Multi-stage build (Node.js for building, Nginx for serving)
- **nginx.conf**: Nginx configuration for serving the Vue.js SPA
- **.dockerignore**: Excludes unnecessary files from Docker build
- **docker-compose.yml**: Defines the container configuration
- **deploy.sh**: Script that runs on EC2 to deploy the application
- **rollback.sh**: Script for rolling back to a previous version
- **list-versions.sh**: Script to list all available versions
- **.github/workflows/deploy.yml**: GitHub Actions workflow for CI/CD

## Notes

- The deployment script automatically handles stopping old containers and starting new ones
- The container runs on port 80 by default (can be changed in docker-compose.yml)
- Health checks are configured to ensure the container is running properly
- Versioned images are kept on the server to enable rollback functionality
- The application is served using Nginx, which is optimized for serving static files
- Vue Router is configured to work as a Single Page Application (SPA)

## SSL/TLS Setup (Optional)

To add SSL/TLS support:

1. Install Certbot on EC2:
   ```bash
   sudo yum install certbot -y  # Amazon Linux 2
   # or
   sudo apt-get install certbot -y  # Ubuntu
   ```

2. Use a reverse proxy (like Nginx on the host) or modify the Docker setup to include SSL certificates

3. Update docker-compose.yml to expose port 443 and mount SSL certificates

