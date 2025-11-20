# SummaryFlow - AI Document Summarization Application

## Overview

SummaryFlow is a modern web application that provides AI-powered document summarization services. Users can upload PDF files, images (PNG/JPG), or paste text directly to receive clear, concise 2-6 sentence summaries generated using artificial intelligence. The application features a clean, premium design with a drag-and-drop interface, real-time processing indicators, and session-based result management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: TailwindCSS with custom design tokens for consistent theming
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

The frontend follows a component-based architecture with clear separation of concerns. Components are organized into UI primitives, feature-specific components, and page-level components. The design system uses CSS custom properties for theming with a calming blue/green color palette.

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **File Processing**: Multer for multipart uploads with memory storage
- **PDF Processing**: pdf-parse library for text extraction
- **OCR Processing**: Tesseract.js for image text recognition
- **Data Storage**: In-memory storage using Map-based implementation (temporary session storage)
- **API Design**: RESTful endpoints with structured error handling

The backend implements a service-oriented architecture with separate modules for file processing, storage, and AI integration. File uploads are limited to 10MB with MIME type validation for security.

### Database Schema
The application defines a PostgreSQL schema using Drizzle ORM with the following structure:
- **summaries table**: Stores summary records with id, type, source_name, original_text, summary, file_size, and created_at
- **Schema validation**: Uses Zod schemas for runtime type checking and API validation
- **Current implementation**: Uses in-memory storage but schema is prepared for PostgreSQL migration

### Authentication and Authorization
Currently implements no authentication system - the application is designed as a public service with session-based result storage that persists only during the browser session.

### Error Handling and Validation
- **Input validation**: Zod schemas for request/response validation
- **File validation**: MIME type checking and size limits
- **Error boundaries**: Comprehensive error handling with user-friendly messages
- **Security measures**: File type restrictions, EXIF data stripping (planned), and input sanitization

## External Dependencies

### Third-Party Services
- **OpenAI API**: Primary AI service for text summarization using GPT-5 model
- **Environment Configuration**: Requires OPENAI_API_KEY for AI functionality

### Database Services
- **Neon Database**: PostgreSQL hosting service via @neondatabase/serverless
- **Drizzle ORM**: Database toolkit with PostgreSQL dialect configuration
- **Migration Strategy**: Drizzle Kit for schema management and migrations

### File Processing Libraries
- **pdf-parse**: PDF text extraction
- **tesseract.js**: OCR processing for images
- **multer**: File upload handling with memory storage

### UI and Development Tools
- **Radix UI**: Comprehensive component library for accessible primitives
- **Lucide React**: Icon library for consistent iconography
- **TailwindCSS**: Utility-first CSS framework
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Type safety and development experience enhancements

### Hosting and Deployment
- **Replit Integration**: Configured for Replit hosting environment with development tooling
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Static Assets**: Optimized build output for production deployment