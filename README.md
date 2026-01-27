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

## Testing

This project includes comprehensive unit tests for all metric calculation functions.

### Run All Tests

```bash
npm test
```

This will run all tests and display a coverage report showing:

- Test results for all metric calculations
- Code coverage statistics
- Coverage details for each file

### Run Tests in Watch Mode

For development, you can run tests in watch mode (automatically re-runs tests when files change):

```bash
npm run test:watch
```

### Test Coverage

Tests cover the following metric calculations:

- **Airspeed** - Phase-based speed calculations
- **Altitude** - Interpolation during climb and descent
- **Heading** - Phase-based heading values
- **Position** - Latitude/longitude interpolation during cruise
- **Fuel** - Progressive fuel consumption
- **Temperature** - Temperature changes during flight phases
- **ETA** - Remaining flight time calculations

Coverage reports are generated in the `coverage/` directory after running tests.
