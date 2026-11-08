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

## 📁 Media Processing Pipeline

A two-step resilient file upload workflow:
1. **Local Multer Storage (`src/middlewares/multer.middleware.js`)**: Multipart form uploads are temporarily staged to `public/temp` with unique filenames.
2. **Cloudinary Remote Upload (`src/utils/cloudinary.js`)**: Files are uploaded to Cloudinary using their SDK with `resource_type: "auto"` to automatically detect images and video assets.
3. **Local Cleanup**: Synchronous cleanup (`fs.unlinkSync`) deletes temporary files from the server whether the upload succeeds or encounters an error, preventing disk overflow.

## 📡 API Endpoints

### Health Check
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/healthcheck` | Returns server uptime, status, and system timestamp | No |

### Authentication & Users
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/users/register` | Register new user with avatar & cover image | No |
| `POST` | `/api/v1/users/login` | User login (returns access and refresh tokens) | No |
| `POST` | `/api/v1/users/logout` | Logout user and clear refresh token | Yes |
| `POST` | `/api/v1/users/refresh-token` | Regenerate access token using refresh token | No |
| `POST` | `/api/v1/users/change-password` | Update current user password | Yes |
| `GET` | `/api/v1/users/current-user` | Get logged-in user profile details | Yes |
| `PATCH` | `/api/v1/users/update-account` | Update account details (fullname, email) | Yes |
| `PATCH` | `/api/v1/users/avatar` | Update user profile avatar | Yes |
| `PATCH` | `/api/v1/users/cover-image` | Update user channel cover image | Yes |
| `GET` | `/api/v1/users/c/:username` | Fetch channel profile with subscriber count via aggregation | Yes |
| `GET` | `/api/v1/users/history` | Get user video watch history via aggregation pipeline | Yes |

### Video Management
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/videos` | Get all videos with pagination, search query, sorting, and userId filter | No |
| `POST` | `/api/v1/videos` | Upload video file and thumbnail to Cloudinary and publish | Yes |
| `GET` | `/api/v1/videos/:videoId` | Get video details by ID | Yes |
| `PATCH` | `/api/v1/videos/:videoId` | Update video title, description, and thumbnail | Yes |
| `DELETE` | `/api/v1/videos/:videoId` | Delete video and associated media | Yes |
| `PATCH` | `/api/v1/videos/toggle/publish/:videoId` | Toggle video public/private publish status | Yes |

### Community & Tweets
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/tweets` | Create a new community tweet post | Yes |
| `GET` | `/api/v1/tweets/user/:userId` | Get all tweets created by a specific user | Yes |
| `PATCH` | `/api/v1/tweets/:tweetId` | Update an existing tweet post | Yes |
| `DELETE` | `/api/v1/tweets/:tweetId` | Delete a tweet post | Yes |

### Subscriptions System
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/subscriptions/c/:channelId` | Toggle channel subscription (subscribe/unsubscribe) | Yes |
| `GET` | `/api/v1/subscriptions/c/:channelId` | Get list of subscribers for a channel | Yes |
| `GET` | `/api/v1/subscriptions/u/:subscriberId` | Get list of channels a user has subscribed to | Yes |

### Comments
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/comments/:videoId` | Get paginated comments for a video | Yes |
| `POST` | `/api/v1/comments/:videoId` | Add a comment to a video | Yes |
| `PATCH` | `/api/v1/comments/c/:commentId` | Update comment text | Yes |
| `DELETE` | `/api/v1/comments/c/:commentId` | Delete a comment | Yes |

### Likes System
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/likes/toggle/v/:videoId` | Toggle like status on a video | Yes |
| `POST` | `/api/v1/likes/toggle/c/:commentId` | Toggle like status on a comment | Yes |
| `POST` | `/api/v1/likes/toggle/t/:tweetId` | Toggle like status on a tweet | Yes |
| `GET` | `/api/v1/likes/videos` | Fetch all videos liked by authenticated user | Yes |

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
