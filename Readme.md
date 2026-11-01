# YouTube Backend - Video Sharing Platform API

A scalable and production-grade backend inspired by modern video-sharing platforms, built using Node.js, Express.js, MongoDB, and Cloudinary.

## 🚀 Overview
This repository contains the backend service for a full-featured video streaming and sharing platform. It is designed following modern software engineering principles including clean modular architecture, custom error handling, aggregation pipelines, and secure JWT authentication.

## 🛠 Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & bcrypt
- **File Storage**: Multer & Cloudinary

## 🧩 Core Architecture & Utilities

### 1. `asyncHandler` Wrapper
Standard higher-order function to encapsulate asynchronous controller logic, removing repetitive `try-catch` boilerplate across route handlers.

### 2. `ApiError` Class
Custom operational error class extending native JavaScript `Error` with HTTP status codes, structured error payloads, error stacks, and standard formatting.

### 3. `ApiResponse` Class
Standardized API response wrapper ensuring consistent JSON contract across all client responses:
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success",
  "success": true
}
```

## 🗄 Database & Server Configuration

- **Database Connection (`src/db/index.js`)**: Connects to MongoDB Atlas using Mongoose with connection pooling and error-handling event listeners.
- **Express Bootstrap (`src/app.js`)**:
  - `cors`: Configured with credentials and origin whitelisting.
  - `express.json` & `express.urlencoded`: Strict payload limits (`16kb`) for body parser security.
  - `cookieParser`: Cookie parsing for reading and setting secure HTTP-only refresh tokens.
  - `express.static`: Configured public assets directory for static files.

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/anik-aryan/Youtube-backend.git
cd Youtube-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file from `.env.sample`:
```bash
cp .env.sample .env
```
Fill in your database connection string, JWT secrets, and Cloudinary API credentials.

### 4. Run development server
```bash
npm run dev
```

---
*Note: This project is under active development.*
