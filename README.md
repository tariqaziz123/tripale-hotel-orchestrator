# Hotel Offer Orchestrator

A backend service that aggregates hotel offers from multiple suppliers, deduplicates hotels, selects the cheapest offer, and supports Redis-based price filtering.

Built as part of the Tripare.ai Senior Software Engineer - Full Stack assignment.

## Tech Stack

* Node.js
* TypeScript
* Express
* Temporal
* Redis
* Docker & Docker Compose
* PostgreSQL (Temporal persistence)

## Architecture

```text
Client / Postman
       |
       v
Express API
       |
       v
Temporal Client
       |
       v
Hotel Workflow
   /         \
  v           v
Supplier A  Supplier B
   \         /
    \       /
     v     v
  Deduplication
       |
       v
  Cheapest Offer
       |
       +-------------------+
       |                   |
       v                   v
   No filter          Price filter
       |                   |
       v                   v
   API response          Redis
                           |
                           v
                    Filtered response
```

## Features

* Fetch hotel offers from Supplier A and Supplier B.
* Execute supplier calls in parallel using Temporal.
* Deduplicate hotels by hotel name.
* Select the cheapest offer when the same hotel exists in both suppliers.
* Preserve supplier and commission information.
* Support minimum and maximum price filtering.
* Store deduplicated offers in Redis for filtered requests.
* Perform price filtering inside Redis using sorted sets.
* Supplier health check endpoint.
* Error handling and logging.
* Dockerized application with Temporal, Redis, and PostgreSQL.
* Postman collection for API testing.

## Project Structure

```text
src/
├── activities/
│   └── hotelActivities.ts
├── routes/
│   ├── health.ts
│   └── suppliers.ts
├── services/
│   ├── redisService.ts
│   └── temporalClient.ts
├── suppliers/
│   ├── supplierA.ts
│   └── supplierB.ts
├── types/
│   └── hotel.ts
├── workflows/
│   └── hotelWorkflow.ts
├── server.ts
└── worker.ts

postman/
└── Tripare-Hotel-Offer-Orchestrator.postman_collection.json

Dockerfile
docker-compose.yml
package.json
tsconfig.json
README.md
```

## Prerequisites

* Docker
* Docker Compose
* Git

The application dependencies are installed inside the Docker image, so Node.js is not required on the host machine to run the complete Docker setup.

## Running the Application

Clone the repository:

```bash
git clone https://github.com/tariqaziz123/tripale-hotel-orchestrator.git
cd tripale-hotel-orchestrator
```

Start all services:

```bash
docker compose up --build
```

The API will be available at:

```text
http://localhost:3000
```

The services include:

* Express API
* Temporal Worker
* Temporal Server
* Redis
* PostgreSQL

To stop the services:

```bash
docker compose down
```

## API Endpoints

### 1. Hotel Search

```http
GET /api/hotels?city=delhi
```

Example:

```text
http://localhost:3000/api/hotels?city=delhi
```

Example response:

```json
[
  {
    "name": "Holtin",
    "price": 5340,
    "commissionPct": 20,
    "supplier": "Supplier B"
  },
  {
    "name": "Radison",
    "price": 5900,
    "commissionPct": 13,
    "supplier": "Supplier A"
  }
]
```

The workflow combines offers from both suppliers and returns the cheapest offer for each hotel.

### 2. Price Filtering

Minimum and maximum price can be supplied:

```http
GET /api/hotels?city=delhi&minPrice=5000&maxPrice=7000
```

Minimum price only:

```http
GET /api/hotels?city=delhi&minPrice=7000
```

Maximum price only:

```http
GET /api/hotels?city=delhi&maxPrice=6000
```

When a price filter is provided:

1. The Temporal workflow produces the deduplicated hotel list.
2. The result is stored in Redis.
3. Redis filters the offers using a sorted set indexed by price.
4. The filtered offers are returned by the API.

### 3. Supplier A

```http
GET /supplierA/hotels?city=delhi
```

### 4. Supplier B

```http
GET /supplierB/hotels?city=delhi
```

### 5. Health Check

```http
GET /health
```

Example:

```json
{
  "status": "healthy",
  "suppliers": {
    "supplierA": "healthy",
    "supplierB": "healthy"
  }
}
```

The endpoint returns HTTP `503` when one or both suppliers are unhealthy.

## Temporal Workflow

The `hotelWorkflow` performs the orchestration:

```text
Request city
     |
     v
Call Supplier A + Supplier B in parallel
     |
     v
Combine results
     |
     v
Deduplicate by hotel name
     |
     v
Compare prices for overlapping hotels
     |
     v
Return cheapest offers
```

Supplier calls are implemented as Temporal Activities, while the orchestration logic is implemented inside the Temporal Workflow.

## Redis Price Filtering

Redis stores the deduplicated hotel data using:

```text
Hash:
hotels:<city>

Sorted Set:
hotels:<city>:prices
```

The hotel name is used as the sorted-set member and the hotel price is used as the score.

For example:

```text
hotels:delhi:prices

Holtin      5340
Radison     5900
Taj Palace  8500
The Leela   9000
```

This allows Redis to perform price-range queries efficiently using sorted-set score ranges.

## Mock Supplier Data

The application contains two mock suppliers with overlapping hotel names.

For Delhi:

| Hotel      | Supplier A | Supplier B |
| ---------- | ---------: | ---------: |
| Holtin     |     ₹5,500 |     ₹5,340 |
| Radison    |     ₹5,900 |     ₹6,100 |
| Taj Palace |     ₹8,500 |          — |
| The Leela  |          — |     ₹9,000 |

The orchestrator therefore selects:

* Holtin → Supplier B → ₹5,340
* Radison → Supplier A → ₹5,900
* Taj Palace → Supplier A → ₹8,500
* The Leela → Supplier B → ₹9,000

## Testing

A Postman collection is included at:

```text
postman/Tripare-Hotel-Offer-Orchestrator.postman_collection.json
```

The collection covers:

* Health check
* Supplier A
* Supplier B
* Delhi hotel search
* Mumbai hotel search
* City with no results
* Price range filtering
* Minimum price filtering
* Maximum price filtering
* Invalid price range

## Error Handling

The API validates:

* Required `city` parameter
* Numeric `minPrice`
* Numeric `maxPrice`
* Valid minimum/maximum price relationship

Supplier and API errors are logged and returned as appropriate HTTP errors.

## Docker Services

The Docker Compose setup contains:

```text
app
worker
temporal
redis
postgres
```

The application and worker communicate with Temporal using the Docker service name:

```text
temporal:7233
```

Redis is accessed through:

```text
redis:6379
```

## Development

For local TypeScript development:

```bash
npm install
```

Run the API:

```bash
npm run dev
```

Run the Temporal worker separately:

```bash
npm run worker
```

Build the project:

```bash
npm run build
```

## Postman

Import the collection:

```text
postman/Tripare-Hotel-Offer-Orchestrator.postman_collection.json
```

The default base URL is:

```text
http://localhost:3000
```

## Assignment Status

Implemented:

* [x] TypeScript backend
* [x] Express API
* [x] Temporal workflow
* [x] Temporal activities
* [x] Parallel supplier execution
* [x] Hotel deduplication
* [x] Cheapest offer selection
* [x] Redis persistence
* [x] Redis price filtering
* [x] Mock supplier endpoints
* [x] Health check
* [x] Error handling and logging
* [x] Docker Compose setup
* [x] Postman collection
* [x] README documentation
