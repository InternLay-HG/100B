
# Unified Student Collaboration and Anonymous Confession Platform

This platform streamlines academic resource sharing, real-time communication, and anonymous messaging within a college network, providing both students and educators with collaborative and confidential features.

---

## Live link - https://100b-lilac.vercel.app

## Table of Contents

- [Registration](#registration)
- [Login](#login)
- [Notes](#notes)
- [Chat](#chat)
- [Anonymous Messages](#anonymous-messages)
- [Announcements](#announcements)
- [Polls and Surveys](#polls-and-surveys)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [DevOps](#devops)
- [Team Members](#team-members)

---

### Registration

- **Authentication**:
  - **Email Signup**: Uses JWT for authentication; tokens are stored in HTTP-only cookies (access and refresh tokens).
  - **Google Signup**: Uses Firebase for OAuth with Google.
- **Email Verification**:
  - **College Email Requirement**: Users can only sign up using verified college emails (currently IIIT Ranchi).
  - **Two Roles**: Teacher and Student.
- **User Information**:
  - Required fields: email, password, college (IIIT Ranchi), batch, year, branch, and optional profile picture.
  - **OTP Verification**: OTP sent to email; account creation is finalized upon OTP verification.
- **Profile Picture**: Uploaded to Amazon S3.

---

### Login

- **Authentication**: Users can log in using email/password or OAuth.
- **Forgot Password**: Reset via OTP sent to registered email.
- **Database**: Prisma and PostgreSQL with queries managed using Axios.

---

### Notes

- **Storage**: Notes are stored on Amazon S3 (using multer for uploads).
- **Organization**:
  - Files can be uploaded directly or within folders.
  - Folders require subject, year, batch, and branch information.
  - Folders can be updated to add new files or remove existing ones.
- **Filtering**: Notes can be filtered by subject, year, batch, and branch.
- **Moderation**:
  - Upvote/downvote functionality.
  - Can be reported as spam or inappropriate (ML-based moderation).

---

### Chat

- **User Directory**: All registered users from the same college are accessible in the directory.
- **Real-time Chat**: Enabled using Socket.io with Redis for caching and Kafka for notifications.
- **Encryption**: End-to-end encryption for secure communication.

---

### Anonymous Messages

- **Message Features**:
  - Anonymous users within the same college can send and read messages.
  - Emoji reactions supported.
  - Messages can be reported for review (ML-based moderation).
- **Editing and Deletion**: Messages can be edited or deleted within a specified timeframe.
- **Real-time Updates**: Socket.io for real-time messaging and Redis for caching.

---

### Announcements

- **Roles**: Accessible to teachers for batch/year/branch-specific announcements.
- **Scheduling**: Announcements can be scheduled or sent immediately.
- **Real-time Notifications**: Powered by RabbitMQ for queueing and Socket.io for real-time updates.

---

### Polls and Surveys

- **Creation**: Both students and teachers can create surveys/polls.
- **Voting Options**: Voting can be anonymous.
- **Decentralization**: Optional Web3 support for decentralized polls.
- **Time-Limited Access**: Polls and surveys can have specified time frames which can be extended and closed.
- **Historical Records**: View past polls/surveys.

---

## Tech Stack

### Frontend

- **React**
- **Tailwind CSS**
- **Shadcn UI**
- **Typescript**
- **Axios**
- **Figma**

### Backend

- **Node.js**
- **Express**
- **Firebase**
- **PostgreSQL**
- **Prisma**
- **Socket.io**
- **WebRTC**
- **Redis**
- **Kafka**
- **RabbitMQ**
- **AWS S3**

### DevOps (Tentative)

- **AWS EC2**
- **Prometheus** (monitoring)
- **Grafana** (visualization)
- **Aiven.io** (managed PostgreSQL)

---

## Team Members

- **Aditya Singh** - Full Stack
- **Suraj Sharma** - Frontend
- **Nilkamal Priyadarshi** - UI/UX
- **Kumar Abhishek Ranjan** - ML/DL

## Figma - https://www.figma.com/design/H3Gklrrn27SuGiwaFmHKtg/InterlayProject?node-id=1-3&t=4GAvPEbr5AeN3a3s-1