# 💬 Chatify Backend

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin_FCM-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![100ms](https://img.shields.io/badge/100ms-Live_Video-0052FF?style=for-the-badge&logo=webrtc&logoColor=white)](https://www.100ms.live/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-3.7_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

The server-side engine powering **Chatify** — a modern MERN communication platform supporting real-time messaging, multi-platform push notifications, high-quality audio/video calling, and conversational AI features with text and image generation.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Starting the Server](#starting-the-server)
- [API Reference](#-api-reference)
  - [Authentication (`/api/authen`)](#1-authentication-apiauthen)
  - [Contacts (`/api/contact`)](#2-contacts-apicontact)
  - [Chat & Messaging (`/api/chat`)](#3-chat--messaging-apichat)
  - [Audio / Video Calling (`/api/call`)](#4-audio--video-calling-apicall)
  - [Firebase Cloud Messaging (`/api/fcm`)](#5-firebase-cloud-messaging-apifcm)
  - [AI Assistant & Image Generation (`/api/ai`)](#6-ai-assistant--image-generation-apiai)
- [Deployment](#deployment)
---

## 🚀 Features

- 🔐 **Secure Authentication**:
  - Email and password registration & login with password hashing via `bcryptjs`.
  - Google OAuth integration for one-click authentication.
  - Stateless authentication using JSON Web Tokens (JWT).
- 💬 **Messaging & Conversations**:
  - Real-time message storage with sender/receiver indexing.
  - Soft-delete and permanent delete functionality.
  - Automatic push notification trigger when new messages arrive.
- 📹 **Video & Audio Calling**:
  - Integrated with **100ms.live** SDK for dynamic video room generation.
  - Automatic room creation and room-code management per user.
  - Call logs and push notifications alerting recipients of incoming calls.
- 🔔 **Cross-Platform Push Notifications**:
  - Firebase Cloud Messaging (FCM) integration via `firebase-admin`.
  - Device token registration, topic subscription, and multi-channel push delivery (Web, Android, iOS).
- 🤖 **AI Capabilities**:
  - Conversational AI powered by **Google Generative AI (Gemini 3.7 Flash)** with multi-turn chat history.
  - AI image generation using **Flux**.
  - Persistent AI conversation history per user.
- 👥 **Contact Management**:
  - Add contacts using user tokens / IDs.
  - Search and manage friend/contact lists.

---

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Validation**: `express-validator`
- **External Integrations**:
  - **Firebase Admin SDK**: FCM push notifications
  - **100ms REST API**: Video room creation and token generation
  - **Google Generative AI SDK**: Gemini conversational agent
  - **Flux**: AI image generation
- **Deployment**: Configured for serverless hosting on [Vercel](https://vercel.com/) via `@vercel/node`

---

## 📁 Project Architecture

```plaintext
chatify-backend/
├── middleware/
│   ├── callTokenGenerator.js    # Generates management JWTs for 100ms API
│   └── fetchUser.js             # JWT verification middleware for protected routes
├── models/
│   ├── AiText.js                # Schema for AI chat histories
│   ├── CallLogs.js              # Schema for call records (audio/video)
│   ├── Chat.js                  # Schema for user-to-user chat messages
│   ├── User.js                  # Schema for standard email/password users
│   └── UserGoogle.js            # Schema for Google OAuth authenticated users
├── routes/
│   ├── authen.js                # Registration, login, Google sign-in
│   ├── call.js                  # Call logging and notification triggers
│   ├── chat.js                  # Message fetching, sending, and deletion
│   ├── contact.js               # Contact list management
│   ├── fcm.js                   # Device token registration & FCM topic management
│   └── hercai.js                # Gemini chat and image generation
├── .env.example                 # Example environment variables template
├── db.js                        # MongoDB connection setup
├── index.js                     # Express app entry point & Firebase Admin init
├── package.json                 # Dependencies and scripts
└── vercel.json                  # Vercel serverless deployment config
```

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A running [MongoDB](https://www.mongodb.com/atlas) instance
- A [Firebase Project](https://console.firebase.google.com/) with Firebase Cloud Messaging enabled
- A [100ms.live](https://www.100ms.live/) account
- A [Google AI Studio](https://aistudio.google.com/) Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/chatify-backend.git
   cd chatify-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Copy the sample environment file and populate the required keys:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection URI string |
| `JWT_PASS` | Secret key used for signing & verifying JWT auth tokens |
| `FIREBASE_SERVICE_KEY` | Base64-encoded string of your Firebase service account JSON key |
| `APP_ACCESS_KEY` | 100ms App Access Key |
| `APP_SECRET` | 100ms App Secret |
| `TEMPLATE_ID` | 100ms Room Template ID for audio/video calls |
| `GOOGLE_GEMINI_API` | Google Gemini API Key |

> [!TIP]
> **How to create the `FIREBASE_SERVICE_KEY`:**
> 1. Download your service account JSON file from Firebase Console (`Project Settings > Service accounts > Generate new private key`).
> 2. Convert the entire JSON file into a Base64 string:
>    ```bash
>    # On Linux/macOS
>    base64 -w 0 path/to/serviceAccountKey.json
>
>    # On Windows PowerShell
>    [Convert]::ToBase64String([IO.File]::ReadAllBytes("path\to\serviceAccountKey.json"))
>    ```
> 3. Paste the output string as `FIREBASE_SERVICE_KEY` in your `.env`.

### Starting the Server

- **Development mode (with auto-reload):**
  ```bash
  npm run dev
  ```

- **Production mode:**
  ```bash
  npm start
  ```

Server will run at `http://localhost:5000`.

---

## 📡 API Reference

> [!NOTE]
> All protected routes require the authentication token passed in the **`web-token`** request header:
> ```http
> web-token: <your_jwt_token>
> ```

### 1. Authentication (`/api/authen`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/authen/createuser` | No | Register a new user with `name`, `email`, and `password`. Automatically provisions 100ms room codes. |
| `POST` | `/api/authen/login` | No | Authenticate user using `email` and `password`. Returns JWT token and profile info. |
| `POST` | `/api/authen/google/login` | No | Authenticate using `googleAccessToken`. Provisions account & 100ms room if first-time user. |

### 2. Contacts (`/api/contact`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/contact/getContact` | Yes | Get authenticated user profile details, 100ms roomCode, and contact list. |
| `POST` | `/api/contact/addContact` | Yes | Add a new contact using their user ID (`contactId`). |
| `DELETE` | `/api/contact/deleteContact/:id` | Yes | Remove a contact by ID from user contact list. |

### 3. Chat & Messaging (`/api/chat`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/chat/getMessage` | Yes | Fetch all active messages involving the authenticated user. |
| `POST` | `/api/chat/addMessage` | Yes | Send a new message. Triggers FCM push notification to recipient device. |
| `DELETE` | `/api/chat/deleteMessage` | Yes | Soft-delete or permanently remove messages by providing `{ chats: [message_ids] }`. |

### 4. Audio / Video Calling (`/api/call`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/call/` | Yes | Save call log and dispatch FCM incoming call notification with roomCode to receiver. |
| `GET` | `/api/call/callLogs` | Yes | Get the 10 most recent audio/video call logs. |

### 5. Firebase Cloud Messaging (`/api/fcm`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `PUT` | `/api/fcm/updateToken` | Yes | Save or update client device's FCM registration token. |
| `POST` | `/api/fcm/subscribe` | Yes | Subscribe device token to the user's specific notification topic. |
| `POST` | `/api/fcm/unsubscribe` | Yes | Unsubscribe device token from user topic. |

### 6. AI Assistant & Image Generation (`/api/ai`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/ai/getAiChat` | Yes | Retrieve stored Gemini conversation history. |
| `DELETE` | `/api/ai/deleteAiChat` | Yes | Clear AI chat history. |
| `PUT` | `/api/ai/question` | Yes | Send prompt to Gemini (`gemini-3.7-flash`) with conversation history context. |
| `POST` | `/api/ai/drawImage` | Yes | Generate an image using Flux with a text prompt `{ image: "<prompt>" }`. |

---

## ☁️ Deployment

### Deploying to Vercel

The backend includes a preconfigured [vercel.json](file:///c:/Users/Dhruv/Documents/Coding-and-notes-for-Revision-main/react%20js/chatify/chatify-backend/vercel.json) using `@vercel/node`.

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Deploy directly:
   ```bash
   vercel
   ```
3. Configure all environment variables in the **Vercel Dashboard** under **Project Settings > Environment Variables**.