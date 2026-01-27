# juanRuizA3Simulator

Flight Simulator API with Server-Sent Events (SSE)

## Prerequisites

- Docker Desktop installed and running

## Quick Start with Docker

1. Clone this repository

```bash
git clone <repository-url>
cd juanRuizA3Simulator
```

2. Build and run with Docker Compose

```bash
docker-compose up --build
```

3. Access the application
   - API endpoint: http://localhost:13000/flights
   - API documentation: http://localhost:13000/api-docs
   - Test page: Open `client/GETflights.html` in your browser

4. Stop the application

```bash
docker-compose down
```

## What's Running

- **App**: Node.js/Express server with SSE endpoint (port 13000)
- **Database**: PostgreSQL database (automatically initialized)

## Development (without Docker)

If you want to run locally without Docker:

1. Install dependencies

```bash
npm install
```

2. Ensure PostgreSQL is running locally (port 5432)

3. Start the server

```bash
node server.js
```

4. Access at http://localhost:3000/flights

## API Documentation

The API uses Swagger/OpenAPI for interactive documentation. Access it at:
- Docker: http://localhost:13000/api-docs
- Local: http://localhost:3000/api-docs
