# Clouditect -Cloud Cost Analyzer
Link:https://clouditect-frontend-872154910507.us-central1.run.app/
A microservices-based application for comparing and optimizing cloud costs across AWS, Azure, and GCP, Oracle, IBM, Alibaba.

## Project Overview

The clouditect is an interactive tool that helps organizations make data-driven cloud provider decisions. It allows users to define workloads through both simple and detailed interfaces, then compares costs across major cloud providers and offers optimization recommendations.

## Features

- **Dual Interface Mode**: Simple templates for quick estimates or detailed configuration for precise analysis
- **Multi-Cloud Cost Calculation**: Real-time pricing estimates across AWS, Azure, and GCP
- **Visual Cost Comparison**: Interactive charts for comparing costs by service category
- **Cost Optimization Recommendations**: AI-driven recommendations to reduce cloud spending
- **Microservices Architecture**: Fully containerized services with Docker and Docker Compose

## Technical Architecture

- **Frontend**: React.js with Tailwind CSS and Recharts
- **Backend**: Node.js microservices in Docker containers
- **API Gateway**: Central entry point for backend requests
- **Data Storage**: Redis for caching, JSON files for pricing data
- **Container Orchestration**: Docker Compose

## Microservices

1. **API Gateway** (Port 4000): Routes frontend requests to appropriate services
2. **Pricing Service** (Port 4001): Calculates costs across cloud providers
3. **Recommendation Service** (Port 4002): Generates cost optimization recommendations
4. **Provider Service** (Port 4003): Manages cloud provider-specific details
5. **Redis Cache** (Port 6379): Caches pricing data and recommendations

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js and npm (for development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/multi-cloud-cost-analyzer.git
   cd multi-cloud-cost-analyzer
   ```

2. Start the application:
   ```
   docker-compose up
   ```

3. Access the application:
   ```
   http://localhost:3000
   ```

## Development

### Service Structure

Each microservice follows a similar structure:
- `index.js`: Main entry point
- `Dockerfile`: Container configuration
- `package.json`: Dependencies and scripts

### Running Services Individually

To run a service in development mode:

```bash
cd services/[service-name]
npm install
npm run dev
```

## API Documentation

API documentation is available through Swagger UI at:
```
http://localhost:4000/api-docs
```

## Architecture Diagram

```
┌─────────────┐     ┌──────────────┐     ┌───────────────────┐
│   Frontend  │────▶│  API Gateway │────▶│  Pricing Service  │
│  (React.js) │     │   (Node.js)  │     │     (Node.js)     │
└─────────────┘     └──────────────┘     └───────────────────┘
                           │                      │
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐     ┌───────────────┐
                    │ Provider Svc │     │   Redis Cache │
                    │  (Node.js)   │     │     (Redis)   │
                    └──────────────┘     └───────────────┘
                           │                      ▲
                           │                      │
                           ▼                      │
                    ┌──────────────┐              │
                    │ Recommend Svc│──────────────┘
                    │  (Node.js)   │
                    └──────────────┘
```

## Future Enhancements

- Integration with real cloud provider pricing APIs
- User authentication and saved workloads
- More detailed network and specialized service costing
- Infrastructure as Code templates for each provider
- PDF report generation

## License

This project is licensed under the MIT License - see the LICENSE file for details.
