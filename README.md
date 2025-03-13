# Invite Code System API

The Invite Code System API is used for the backend management of invite codes that offer the following functions:
- Code generation based on a user (referrer)
- Code-use settings (single use or multiple uses)
- Usage monitoring by identifying stated users of the code
- Admin interface for monitoring referral information
- Avoidance of race conditions and very high concurrency

## Features

### Invite Codes
- Hard to guess but easy to input (alphanumeric with no confusing characters)
- Generated from email address and salt, using HMAC-SHA256
- Configurable maximum uses per code
- Time limited with expiration date
- Tracks use (who, when, IP address)

### Security
- Rate limiting to deter brute force attacks
- Transactional operation to preserve integrity of the data
- Protected endpoints using JWT authentication

### Admin Features
- View all invite codes with usage statistics
- Monitor referral relationships
- Search and filtering capabilities

## System Architecture

The system comprises:
- Node.js + Express + TypeScript
- PostgreSQL database + TypeORM
- RESTful API
- With Docker for containerization and easy deployability

## API Endpoints


### Public Endpoints
- `GET /api/invites/validate` - Validate an invite code
- `POST /api/invites/use` - Use an invite code

### Authenticated Endpoints
- `POST /api/invites/generate` - Generate new invite code

### Admin Endpoints
- `GET /api/admin/codes` - Get all invite codes with usage statistics
- `GET /api/admin/codes/:codeId/usage` - Get detailed usage statistics for a specific code

## Local Development Setup

### Pre-requisites
- Node.js v14 and higher
- PostgreSQL identified or Docker

### Installation Steps

1. Create a local copy of the repo
```bash
git clone https://github.com/yourusername/invite-code.git
cd invite-code
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env to suit your configuration
```

4. Start the development server
```bash
# With local PostgreSQL
npm run dev

# With Docker
docker-compose up
```

### Testing
```bash
npm test
```

## Design Decisions

### Code Generation
HMAC-SHA256 makes sense for code generation because:
- It's cryptographically secure
- It uses a secret key that is only known to the server, which prevents any possibility for reverse-engineering
- The format it takes is easy to type and easy to share (alphanumeric without confusing characters like 0 or 1)

### Database Schema
The schema uses three main entities:
- Users: Maintenance of user information and referral relationships
- InviteCodes: Maintenance of actual codes and configurations
- Usages: Tracks all usages of a code together with fine-grained details

### Concurrency Management
To accommodate throughput and concurrent attempts:
- Transactions wrap all database accesses pertaining to code usage
- Atomicity of updates acts as a guard against race conditions

### Security Implications
- Rate limiting constrains abuse
- Authentication secures important endpoints

## Testing Strategy
System has been tested with:
- Unit tests for core business logic
- API integration tests
- Load tests to verify the high traffic and concurrency capability

## Future improvements
If I had more time, that is what I would add:
- Cache:  Redis for data that is accessed frequently
- Analytics Dashboard: Significant more metrics and visualization
- Bulk operations: Support for batch code generation
- Advanced Filtering: More comprehensive search and filter criteria
- API Documentation: Swagger/OpenAPI documents


