# TaskFlow Studio — MERN Stack To-Do List Application
**Maincrafts Technology MERN Stack Internship — Task 2**

---

## 1. Project Overview

**TaskFlow Studio** is a full-stack **MERN (MongoDB, Express.js, React, Node.js)** To-Do List application built for **Task 2** of the Maincrafts Technology MERN Stack Internship.

The application allows users to capture new tasks via a responsive React interface, persist them in **MongoDB Atlas** through an **Express.js** REST API (`POST /add`), and retrieve all stored tasks (`GET /tasks`) using **Axios** so that tasks remain permanently stored across browser refreshes. In addition to all core internship requirements, the project features task completion toggling, inline task editing, task deletion, bulk cleanup of completed tasks, category/priority tagging, real-time search filtering, and a live productivity progress dashboard.

---

## 2. Key Features

### Core Internship Requirements
- **Add New Tasks (`POST /add`)**: Clean input field and **Add Task** button in React that sends new tasks via Axios to Express and saves them in MongoDB.
- **Retrieve All Tasks (`GET /tasks`)**: Automatically fetches and renders all saved tasks from MongoDB when the app loads and whenever the browser is refreshed.
- **Immediate UI Updates**: Newly added tasks appear at the top of the task list immediately upon creation without requiring a manual page reload.
- **Mongoose Schema Validation**: Dedicated `Task` model (`backend/models/Task.js`) with a required `text` field of type `String`, input trimming, and length validation.
- **Environment Variable Security**: Database credentials (`MONGO_URI`) and server port (`PORT`) are loaded from `.env` via `dotenv`.

### Additional Enhancements
- **Distinct Editorial Daylight UI**: Warm sandstone and teal-emerald palette with **Plus Jakarta Sans** & **JetBrains Mono** typography—completely distinct from Task 1's dark product catalog theme.
- **Task Completion (`PATCH /tasks/:id/toggle`)**: Mark tasks as completed or active with instant visual strikethrough and progress bar updates.
- **Inline Task Editing (`PUT /tasks/:id`)**: Edit existing task descriptions directly in place.
- **Task Deletion (`DELETE /tasks/:id` & `DELETE /tasks/completed`)**: Delete individual tasks or clear all completed tasks with one click.
- **Category & Priority Organization**: Tag tasks under `Personal`, `Work`, `Study`, or `Urgent` and assign `Low`, `Medium`, or `High` priority.
- **Search & Status Tabs**: Filter tasks by status (`All`, `Active`, `Completed`), category chips, or keyword search.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite) | Component-based UI & state management |
| **HTTP Client** | Axios | Asynchronous REST API communication (`GET /tasks`, `POST /add`, etc.) |
| **Styling** | Custom CSS3 | Responsive split-pane layout, editorial daylight theme, animations |
| **Backend** | Node.js & Express.js | RESTful API server, routing, CORS & JSON middleware |
| **Database** | MongoDB Atlas & Mongoose | Cloud NoSQL persistence & schema modeling (`Task` model) |

---

## 4. Project Structure

```text
task-2/
├── backend/
│   ├── models/
│   │   └── Task.js              # Mongoose Task schema (text: String, completed, priority, category)
│   ├── routes/
│   │   └── taskRoutes.js        # Express routes (POST /add, GET /tasks, PATCH, PUT, DELETE)
│   ├── .env.example             # Sample environment variables template
│   ├── package.json             # Backend dependencies & scripts
│   └── server.js                # Express app setup, CORS/JSON middleware, MongoDB connection
├── frontend/
│   ├── public/
│   │   └── favicon.svg          # App icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx     # Input field, Add Task button, category & priority selectors
│   │   │   ├── TaskItem.jsx     # Individual task card with complete, edit, and delete actions
│   │   │   └── TaskStats.jsx    # Productivity progress bar, metrics, and API status sidebar
│   │   ├── services/
│   │   │   └── taskService.js   # Axios service client for backend API calls
│   │   ├── App.css              # Editorial daylight layout & responsive component styles
│   │   ├── App.jsx              # Main application container & state management
│   │   ├── index.css            # Global design tokens, typography, and resets
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html               # HTML template
│   ├── package.json             # Frontend dependencies (React, Axios, Vite)
│   └── vite.config.js           # Vite dev server & API proxy configuration
├── .env.example                 # Root environment variable reference
├── .gitignore                   # Ignored files (node_modules, .env, dist)
├── package.json                 # Root helper scripts to run backend & frontend
└── README.md                    # Project documentation
```

---

## 5. MongoDB Atlas Configuration Guide

1. **Log in to MongoDB Atlas**: Visit [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. **Create a Cluster**: Create a free **M0 Sandbox** cluster.
3. **Create a Database User**:
   - Navigate to **Database Access** → **Add New Database User**.
   - Choose **Password** authentication and enter a username and password (avoid special characters like `@` or URL-encode them).
   - Grant **Read and write to any database** privileges.
4. **Whitelist Your IP Address**:
   - Navigate to **Network Access** → **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) for development or add your current IP address.
5. **Copy Your Connection String**:
   - Navigate to **Database** → click **Connect** on your cluster → **Drivers** (Node.js).
   - Copy the connection string:
     ```text
     mongodb+srv://<username>:<password>@<cluster-url>/maincrafts_todo?retryWrites=true&w=majority&appName=Cluster0
     ```
6. **Configure `backend/.env`**:
   - Open `task-2/backend/.env` and paste your connection string into `MONGO_URI`:
     ```env
     PORT=5001
     MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/maincrafts_todo?retryWrites=true&w=majority&appName=Cluster0
     ```
   *(Note: If you also have a local MongoDB server running on port `27017`, `mongodb://127.0.0.1:27017/maincrafts_todo` works out of the box for local testing).*

---

## 6. Installation & Running the Application

### Step 1: Navigate to the Task 2 Folder
```bash
cd task-2
```

### Step 2: Install Backend & Frontend Dependencies
```bash
# Install backend dependencies (express, mongoose, cors, dotenv)
cd backend
npm install

# Install frontend dependencies (react, react-dom, axios, vite)
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables
Ensure `task-2/backend/.env` exists (you can copy from `task-2/backend/.env.example`) and has your `MONGO_URI` set:
```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/maincrafts_todo?retryWrites=true&w=majority
```

### Step 4: Start the Backend Server
Open a terminal in `task-2/backend`:
```bash
npm start
# Or for development with auto-restart:
npm run dev
```
The Express server will start at **`http://localhost:5001`**.

### Step 5: Start the React Frontend
Open a second terminal in `task-2/frontend`:
```bash
npm run dev
```
Open **`http://localhost:5174`** in your browser.

---

## 7. API Endpoints Reference

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Retrieve all tasks from MongoDB (sorted newest first) | *None* |
| `POST` | `/add` | Add a new task to MongoDB | `{ "text": "Finish Task 2", "priority": "high", "category": "Work" }` |
| `PATCH` | `/tasks/:id/toggle` | Toggle `completed` status (`true` / `false`) | *None* |
| `PUT` | `/tasks/:id` | Update a task's text, priority, category, or status | `{ "text": "Updated task text" }` |
| `DELETE` | `/tasks/:id` | Delete a single task by its MongoDB `_id` | *None* |
| `DELETE` | `/tasks/completed` | Delete all completed tasks from MongoDB | *None* |
| `GET` | `/health` | Check Express server & MongoDB connection status | *None* |

*(All endpoints are also accessible under `/api`, e.g., `POST /api/add` and `GET /api/tasks`).*

