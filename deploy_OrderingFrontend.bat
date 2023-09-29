@echo off
echo Starting Script run from cmd...
echo Deploying Frontend...

cd OrderingFrontend
echo Changed directory to OrderingFrontend

REM If you need to set up AWS CLI
echo Running AWS Configure...
aws configure

REM Set the environment variable
echo Setting Environment Variable...
set REACT_APP_API_URL=/api

echo Running npm build...
set CI=false
npm run build

echo Syncing with S3...
aws s3 sync build/ s3://accesstech-ordering-frontend --acl public-read

echo Script Completed
