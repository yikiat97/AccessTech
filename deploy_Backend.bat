@echo off
echo Deploying Backend...
cd backend



REM Authenticate Docker to the ECR registry
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 802615971270.dkr.ecr.us-east-1.amazonaws.com

echo Building Image
REM Build the Docker image
docker build -t accesstech-backend .

REM Tag the Docker image
docker tag accesstech-backend:latest 802615971270.dkr.ecr.us-east-1.amazonaws.com/accesstech-backend:latest

echo Syncing with ECR...
REM Push the Docker image to ECR
docker push 802615971270.dkr.ecr.us-east-1.amazonaws.com/accesstech-backend:latest

cd aws_deploy
eb deploy