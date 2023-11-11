# Project Title

A brief description of what this project does and who it's for.

## Overview

This project is split into two main components:

1. **Frontend**: 2 frontend server for Ordering and Admin. Managed and hosted using AWS Amplify.
2. **Backend**: Hosted on an AWS EC2 instance.


## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have an AWS account and are able to access AWS Amplify and EC2 services.
- You have installed the necessary CLI tools for AWS services.
- You have installed `scp` for file transfer.
- You have the private key (`elmeryeo.pem`) for the EC2 instance. (create your own .pem in EC2)
- You have created `.env` files for both the frontend and backend with the necessary environment variables.
- **Storage**: Hosted on an AWS S3 Bucket. (refer to AWS configuration documentation)
- **Database**: Hosted on an AWS RDS. (refer to AWS configuration documentation)

### Environment Variables

For the application to function correctly, you must set up environment variables for both the frontend and backend.

#### Frontend

Create a `.env` file in the root of the frontend project with the following structure:

```plaintext
REACT_APP_API_URL=<backend-api-url>
SOCKET_URL=<socket-server-url>
```

#### Backend

Create a `.env` file in the root of the Backend project with the following structure:

```plaintext
DATABASE_URI=<your-database-uri>
AWS_ACCESS_KEY=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
AWS_BUCKET_NAME=<your-aws-bucket-name>
WDS_SOCKET_PORT=<your-wds-socket-port>
```


## Setting Up the Development Environment

## Ordering Frontend Set up
1. cd OrderingFrontend
2. npm i
3. npm start

## Admin Frontend Set up
1. cd AdminFrontend
2. npm i
3. npm start

## Backend Set up
1. cd backend/parent
2. py -3 -m venv .venv (set up python virtual environment)
3. .venv\Scripts\activate (to run virtual environment)
4. pip freeze > requirements.txt
5. python app.py (to run backend server)


## AWS to PostgreSQL database set up (free tier 12months only) - might need to migrate to other production templates which need money
1. PostgreSQL 14.7-R
2. DB instance identifier: AccessTech
3. Master username: root / Master password: accesstech


## Deploying to AWS Amplify (Frontend)
Refer to AWS configuration documentation. It is being push via github

## Deploying to AWS EC2 (Backend)
Refer to AWS configuration documentation. After configuration:
1. to push, scp -i elmeryeo.pem -r ./backend/* ec2-user@<your-ec2-instance-ip>:/home/ec2-user

