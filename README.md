# Reminders and Task Management App

## Overview

This application is a Reminders and Task Management system built with Next.js, MongoDB, and Vercel. It allows users to create tasks with sub-tasks, set reminders, and receive notifications. Users can also upload files related to tasks, with storage managed through Vercel Blob Storage.

## Features

- **Task Management:** Create tasks with optional sub-tasks.
- **Reminder Notifications:** Set reminders and receive browser notifications.
- **File Storage:** Upload and store files related to tasks using Vercel Blob Storage.
- **Role-Based Access Control (RBAC):** Differentiate between admin and regular users, with different permissions.
- **Authentication:** Secure user login and session management using AuthJS.

## Setup Guide

Follow these steps to get the application running locally on your machine:

### Prerequisites

- **Node.js** installed on your machine.
- A **MongoDB** instance (you can use MongoDB Atlas, a cloud-based service).
- A **Vercel** account to use Vercel Blob Storage.

### 1. Clone the Repository

```
git clone https://github.com/LoV432/next-todo.git
cd next-todo
```

### 2. Install Dependencies

Install the required npm packages:

```
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory of your project:

```
touch .env.local
```

Add the following environment variables to the `.env.local` file:

```
# MongoDB URI (Replace with your actual MongoDB connection string)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your-database?retryWrites=true&w=majority

# Authentication secret (Run the command in the next step to generate this)
AUTH_SECRET=

# Vercel Blob Storage Token (You will generate this in step 5)
BLOB_READ_WRITE_TOKEN=
```

### 4. Generate Authentication Secret

You need to generate a secret key for authentication:

```
npx auth secret
```

This will add the `AUTH_SECRET` environment variable to your `.env.local` file.

### 5. Set Up MongoDB

If you don’t have a MongoDB instance, you can create one using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas):

1. Sign up for a MongoDB Atlas account.
2. Create a new cluster.
3. In the cluster, create a new database and a new user.
4. Get the connection string, replace `<username>`, `<password>`, and `your-database` with your actual username, password, and database name.

Paste the MongoDB connection string into the `MONGODB_URI` field in your `.env.local` file.

### 6. Set Up Vercel Blob Storage

To store files in the cloud, you need to create a Blob Storage in Vercel:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Create a new Blob Storage.
3. Copy the `BLOB_READ_WRITE_TOKEN` provided by Vercel.
4. Paste this token into the `BLOB_READ_WRITE_TOKEN` field in your `.env.local` file.

### 7. Run the Application

After setting up the environment variables and installing the dependencies, you can run the application:

```
npm run dev
```

This will start the development server at `http://localhost:3000`.

### 8. Accessing the Application

Open your web browser and navigate to `http://localhost:3000` to start using the Reminders and Task Management App.

### 9. Additional Notes

- Ensure that your MongoDB instance is running and accessible.
- Ensure that you have whitelisted the IP address of your machine in your MongoDB instance.
- If you encounter any issues, check that your environment variables are correctly set up and that the MongoDB URI and Blob Storage token are valid.
