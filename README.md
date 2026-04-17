# Task Manager Microservices 🚀

## Architecture
- Auth Service (JWT + Refresh Tokens)
- Task Service (CRUD + Dashboard)
- API Gateway (Routing)
- Service Registry (Eureka)

## Features
- JWT Authentication
- Role-Based Access (ADMIN / USER)
- Refresh Tokens
- Dashboard APIs
- Validation & Exception Handling

## Tech Stack
- Spring Boot
- Spring Security
- Spring Cloud (Eureka, Gateway)
- H2 Database

## Run Order
1. service-registry
2. auth-service
3. task-service
4. api-gateway
