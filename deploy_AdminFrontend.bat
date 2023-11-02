@echo off
echo Starting Script run from cmd...
echo Deploying Frontend...

cd AdminFrontend
echo Changed directory to AdminFrontend

REM If you need to set up AWS CLI
echo Running AWS Configure...
aws configure

REM Set the environment variable
echo Setting Environment Variable...
set REACT_APP_API_URL=/api
set REACT_APP_SOCKET_URL=/

echo Running npm build...
npm run build

echo Syncing with S3...
aws s3 sync build/ s3://accesstech-admin-frontend --acl public-read

echo Script Completed