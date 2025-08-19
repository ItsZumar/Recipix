#!/bin/bash

# Recipix Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to show usage
show_usage() {
    echo "Recipix Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  dev          Start development environment (all services)"
    echo "  prod         Start production environment"
    echo "  backend      Start only backend services"
    echo "  frontend     Start only frontend service"
    echo "  stop         Stop all services"
    echo "  restart      Restart all services"
    echo "  logs         Show logs for all services"
    echo "  logs-api     Show logs for API service"
    echo "  logs-frontend Show logs for frontend service"
    echo "  build        Build all services"
    echo "  clean        Remove all containers, images, and volumes"
    echo "  status       Show status of all services"
    echo "  shell-api    Open shell in API container"
    echo "  shell-frontend Open shell in frontend container"
    echo "  db-shell     Open PostgreSQL shell"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev"
    echo "  $0 prod"
    echo "  $0 logs-api"
    echo "  $0 clean"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to start development environment
start_dev() {
    print_header "Starting Development Environment"
    check_docker
    docker-compose up -d
    print_status "Development environment started!"
    print_status "Frontend: http://localhost:19006"
    print_status "Backend API: http://localhost:4001"
    print_status "GraphQL: http://localhost:4001/graphql"
}

# Function to start production environment
start_prod() {
    print_header "Starting Production Environment"
    check_docker
    
    if [ ! -f .env ]; then
        print_warning "No .env file found. Creating from example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Please edit .env file with your production values before continuing."
            exit 1
        else
            print_error "No .env.example file found. Please create a .env file manually."
            exit 1
        fi
    fi
    
    docker-compose -f docker-compose.prod.yml up -d
    print_status "Production environment started!"
    print_status "Application: http://localhost"
}

# Function to start backend only
start_backend() {
    print_header "Starting Backend Services Only"
    check_docker
    docker-compose up postgres redis api -d
    print_status "Backend services started!"
    print_status "API: http://localhost:4001"
    print_status "GraphQL: http://localhost:4001/graphql"
}

# Function to start frontend only
start_frontend() {
    print_header "Starting Frontend Service Only"
    check_docker
    docker-compose up frontend -d
    print_status "Frontend service started!"
    print_status "Frontend: http://localhost:19006"
}

# Function to stop all services
stop_services() {
    print_header "Stopping All Services"
    docker-compose down
    print_status "All services stopped!"
}

# Function to restart all services
restart_services() {
    print_header "Restarting All Services"
    docker-compose restart
    print_status "All services restarted!"
}

# Function to show logs
show_logs() {
    if [ "$1" = "api" ]; then
        print_header "API Service Logs"
        docker-compose logs -f api
    elif [ "$1" = "frontend" ]; then
        print_header "Frontend Service Logs"
        docker-compose logs -f frontend
    else
        print_header "All Services Logs"
        docker-compose logs -f
    fi
}

# Function to build services
build_services() {
    print_header "Building All Services"
    docker-compose build
    print_status "All services built!"
}

# Function to clean everything
clean_all() {
    print_header "Cleaning All Docker Resources"
    print_warning "This will remove all containers, images, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down --rmi all --volumes --remove-orphans
        print_status "All Docker resources cleaned!"
    else
        print_status "Clean operation cancelled."
    fi
}

# Function to show status
show_status() {
    print_header "Service Status"
    docker-compose ps
}

# Function to open shell in container
open_shell() {
    if [ "$1" = "api" ]; then
        print_header "Opening Shell in API Container"
        docker-compose exec api sh
    elif [ "$1" = "frontend" ]; then
        print_header "Opening Shell in Frontend Container"
        docker-compose exec frontend sh
    fi
}

# Function to open database shell
open_db_shell() {
    print_header "Opening PostgreSQL Shell"
    docker-compose exec postgres psql -U recipix_user -d recipix
}

# Main script logic
case "$1" in
    dev)
        start_dev
        ;;
    prod)
        start_prod
        ;;
    backend)
        start_backend
        ;;
    frontend)
        start_frontend
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    logs-api)
        show_logs api
        ;;
    logs-frontend)
        show_logs frontend
        ;;
    build)
        build_services
        ;;
    clean)
        clean_all
        ;;
    status)
        show_status
        ;;
    shell-api)
        open_shell api
        ;;
    shell-frontend)
        open_shell frontend
        ;;
    db-shell)
        open_db_shell
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
