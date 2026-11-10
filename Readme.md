# YouTube Backend - Video Sharing Platform API

A robust, scalable, and production-grade backend inspired by YouTube, built using **Node.js**, **Express.js**, **MongoDB**, and **Cloudinary**.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 🚀 Features

### 🔐 Authentication & Authorization
* User registration with avatar and cover image uploads
* Secure authentication with JSON Web Tokens (Access Token + Refresh Token flow)
* Secure password hashing with `bcrypt` (10 salt rounds)
* Token refresh mechanism with HTTP-only cookies
* Password reset / change endpoint
* User profile updates (name, email, avatar, cover image)
* Current user session validation

### 📹 Video Management
* Cloudinary integration for video and thumbnail asset storage
* Upload and publish new videos with metadata
* Update video details (title, description, thumbnail)
* Video removal with Cloudinary file deletion
* Toggle video public/private publish status
* Filter, search, and paginate videos using `mongoose-aggregate-paginate-v2`

### 💬 Comments & Engagement
* Add, edit, and delete comments on videos
* Paginated video comments with user detail lookups
* Polymorphic like system: like and unlike videos, comments, and community tweets
* Query liked videos for the authenticated user

### 👥 Subscriptions & Channel System
* Channel subscribe/unsubscribe toggle
* Aggregation pipelines to fetch channel subscriber counts
* Subscribed channels feed per user
* Channel profile details with subscriber counts and subscription status

### 📝 Community Tweets
* Create, edit, and delete community posts/tweets
* Fetch user tweet feed with author info

### 📑 Playlists
* Create custom playlists with title and description
* Add and remove videos from playlists
* Read, update, and delete playlists
* Fetch playlists belonging to a specific user

### 📊 Creator Dashboard & Analytics
* Channel performance metrics (total views, total subscribers, total videos, total likes)
* Detailed video performance analytics

---

## 🛠 Tech Stack

- **Runtime Environment**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Media Storage**: Cloudinary SDK & Multer middleware
- **Authentication**: JWT (`jsonwebtoken`) & `bcrypt`
- **Pagination**: `mongoose-aggregate-paginate-v2`
- **Utilities**: `cookie-parser`, `cors`, `dotenv`

---

## 📁 Project Structure

```bash
src/
├── constants.js               # Application constants (e.g. DB_NAME)
├── app.js                     # Express application configuration & route definitions
├── index.js                   # Application entry point & DB connection bootstrap
├── db/
│   └── index.js               # MongoDB connection logic
├── middlewares/
│   ├── auth.middleware.js     # JWT verification middleware
│   └── multer.middleware.js   # Local disk storage configuration for file uploads
├── models/
│   ├── comment.model.js       # Comment schema with pagination
│   ├── like.model.js          # Polymorphic like schema
│   ├── playlist.model.js      # Playlist schema
│   ├── subscription.model.js  # Channel subscription schema
│   ├── tweet.model.js         # Community tweet post schema
│   ├── user.model.js          # User schema with bcrypt & token generation
│   └── video.model.js         # Video schema with pagination
├── controllers/
│   ├── comment.controller.js
│   ├── dashboard.controller.js
│   ├── healthcheck.controller.js
│   ├── like.controller.js
│   ├── playlist.controller.js
│   ├── subscription.controller.js
│   ├── tweet.controller.js
│   ├── user.controller.js
│   └── video.controller.js
├── routes/
│   ├── comment.routes.js
│   ├── dashboard.routes.js
│   ├── healthcheck.routes.js
│   ├── like.routes.js
│   ├── playlist.routes.js
│   ├── subscription.routes.js
│   ├── tweet.routes.js
│   ├── user.routes.js
│   └── video.routes.js
└── utils/
    ├── ApiError.js            # Custom operational error wrapper
    ├── ApiResponse.js          # Standardized response structure
    ├── asyncHandler.js         # Async error boundary wrapper
    └── cloudinary.js           # Cloudinary file upload & cleanup utility
```

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [MongoDB](https://www.mongodb.com/) (Atlas cluster or local instance)
* [Cloudinary Account](https://cloudinary.com/) (for media storage)

### 2. Clone the Repository
```bash
git clone https://github.com/anik-aryan/Youtube-backend.git
cd Youtube-backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.sample .env
```
Populate the configuration:
```env
PORT=8000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_jwt_access_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 5. Run the Server
* **Development Mode** (with hot reload):
  ```bash
  npm run dev
  ```
* **Production Mode**:
  ```bash
  npm start
  ```

---

## 📡 API Reference

Base URL: `/api/v1`

### 1. Healthcheck
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/healthcheck` | Server uptime, status, and timestamp | No |

### 2. Authentication & User Profile
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/users/register` | Register new account (multipart: avatar, coverImage) | No |
| `POST` | `/users/login` | Login user, set refresh token cookie | No |
| `POST` | `/users/logout` | Logout user and clear tokens | Yes |
| `POST` | `/users/refresh-token` | Regenerate access token | No |
| `POST` | `/users/change-password` | Update account password | Yes |
| `GET` | `/users/current-user` | Get authenticated user info | Yes |
| `PATCH` | `/users/update-account` | Update fullname and email | Yes |
| `PATCH` | `/users/avatar` | Update avatar image (multipart) | Yes |
| `PATCH` | `/users/cover-image` | Update cover image (multipart) | Yes |
| `GET` | `/users/c/:username` | Fetch channel profile with subscriber stats | Yes |
| `GET` | `/users/history` | Get user video watch history | Yes |

### 3. Video Management
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/videos` | Get videos with pagination, search, sort, and userId filter | No |
| `POST` | `/videos` | Upload video and thumbnail files, create video record | Yes |
| `GET` | `/videos/:videoId` | Get video details by ID | Yes |
| `PATCH` | `/videos/:videoId` | Update video title, description, or thumbnail | Yes |
| `DELETE` | `/videos/:videoId` | Delete video and remote media | Yes |
| `PATCH` | `/videos/toggle/publish/:videoId` | Toggle video public status | Yes |

### 4. Community Tweets
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/tweets` | Create new tweet post | Yes |
| `GET` | `/tweets/user/:userId` | Get user tweets feed | Yes |
| `PATCH` | `/tweets/:tweetId` | Edit tweet post | Yes |
| `DELETE` | `/tweets/:tweetId` | Delete tweet post | Yes |

### 5. Channel Subscriptions
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/subscriptions/c/:channelId` | Toggle subscribe / unsubscribe to channel | Yes |
| `GET` | `/subscriptions/c/:channelId` | Get list of subscribers for a channel | Yes |
| `GET` | `/subscriptions/u/:subscriberId` | Get list of channels subscribed by user | Yes |

### 6. Comments
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/comments/:videoId` | Get paginated comments for video | Yes |
| `POST` | `/comments/:videoId` | Add comment to video | Yes |
| `PATCH` | `/comments/c/:commentId` | Update comment content | Yes |
| `DELETE` | `/comments/c/:commentId` | Delete comment | Yes |

### 7. Likes
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/likes/toggle/v/:videoId` | Toggle like status on video | Yes |
| `POST` | `/likes/toggle/c/:commentId` | Toggle like status on comment | Yes |
| `POST` | `/likes/toggle/t/:tweetId` | Toggle like status on tweet | Yes |
| `GET` | `/likes/videos` | Get all videos liked by authenticated user | Yes |

### 8. Playlists
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/playlist` | Create new playlist | Yes |
| `GET` | `/playlist/:playlistId` | Get playlist details and videos | Yes |
| `PATCH` | `/playlist/:playlistId` | Update playlist name and description | Yes |
| `DELETE` | `/playlist/:playlistId` | Delete playlist | Yes |
| `PATCH` | `/playlist/add/:videoId/:playlistId` | Add video to playlist | Yes |
| `PATCH` | `/playlist/remove/:videoId/:playlistId` | Remove video from playlist | Yes |
| `GET` | `/playlist/user/:userId` | Get all playlists by user | Yes |

### 9. Dashboard Analytics
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/stats` | Channel stats (views, subscribers, videos, likes) | Yes |
| `GET` | `/dashboard/videos` | Fetch all channel uploaded videos with metrics | Yes |

---

## 📊 MongoDB Aggregation Pipelines

This project makes extensive use of complex MongoDB aggregation pipelines for high-performance data querying:
- **Channel Profile Aggregation**: Computes real-time subscriber counts, channel subscription counts, and evaluates whether the current user is subscribed in a single lookup pipeline.
- **Watch History Pipeline**: Populates nested video records alongside channel owner information.
- **Dashboard Analytics**: Calculates cumulative view counts, total likes across all videos, and total subscribers using aggregation stages (`$match`, `$lookup`, `$group`, `$project`).

---

## 👨‍💻 Author

**Anik Aryan**
- GitHub: [@anik-aryan](https://github.com/anik-aryan)
- Email: [anikaryan476@gmail.com](mailto:anikaryan476@gmail.com)

---

## 📄 License

This project is licensed under the ISC License.
