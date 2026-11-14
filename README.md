# To-Do List Application

A full-stack mobile To-Do List app built for **ITCC 106**.

| Layer | Technology |
|-------|-----------|
| Frontend | React Native (Expo) |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| API testing | Postman |

## Features

- Add a task (title + description)
- View all tasks in a clean list (newest first)
- Mark a task as completed with a checkbox (uncheck to return it to Pending)
- Edit and delete tasks
- Status badge: **Pending** or **Completed**
- Created date and time on every task
- Counters for total, completed and pending tasks
- Filter tabs (All / Pending / Completed) and pull-to-refresh
- Error handling on both the API and the app

## Project structure

```
todo-list-app/
├── backend/
│   ├── config/db.js                  # MongoDB connection
│   ├── controllers/taskController.js # Logic for each endpoint
│   ├── middleware/errorHandler.js    # 404 and error responses
│   ├── models/Task.js                # Mongoose schema (tasks collection)
│   ├── routes/taskRoutes.js          # URL -> controller mapping
│   ├── .env.example                  # Environment variables template
│   ├── package.json
│   └── server.js                     # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── api/taskApi.js            # Calls to the backend
│   │   ├── components/               # TaskCard, StatsBar
│   │   ├── screens/                  # HomeScreen, TaskFormScreen
│   │   ├── config.js                 # API address (edit for real phone)
│   │   └── theme.js                  # Blue and white colors
│   ├── App.js                        # Navigation
│   ├── app.json
│   └── package.json
├── docs/ToDoList.postman_collection.json
└── README.md
```

## Requirements

1. [Node.js](https://nodejs.org) LTS (v18 or newer)
2. [MongoDB Community Server](https://www.mongodb.com/try/download/community) **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
3. [Postman](https://www.postman.com/downloads/)
4. The **Expo Go** app on your phone, or an Android emulator / iOS simulator

## 1. Run the backend

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # or: npm start
```

Packages installed: `express`, `mongoose`, `cors`, `dotenv` (and `nodemon` for development).

You should see:

```
MongoDB connected: 127.0.0.1/todo_list_db
Server running on port 5000
```

### MongoDB connection

**Local MongoDB**

1. Install MongoDB Community Server and make sure the service is running.
2. Keep this line in `backend/.env`:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/todo_list_db
   ```
3. The database `todo_list_db` and the collection `tasks` are created automatically when the first task is saved. You can view the data in **MongoDB Compass** by connecting to `mongodb://127.0.0.1:27017`.

**MongoDB Atlas (cloud)**

1. Create a free cluster, add a database user, and allow your IP address under *Network Access*.
2. Click *Connect → Drivers* and copy the connection string.
3. Put it in `.env`, with `todo_list_db` before the `?`:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/todo_list_db?retryWrites=true&w=majority
   ```

> Never upload your real `.env` to GitHub. It is already listed in `.gitignore`.

## 2. Run the frontend

Open a **second** terminal:

```bash
cd frontend
npm install
npx expo install --fix    # makes sure all package versions match your Expo version
npx expo start
```

Then press `a` (Android emulator), `i` (iOS simulator), or scan the QR code with **Expo Go**.

### Set the API address

Edit `frontend/src/config.js`:

| Where you run the app | API address |
|-----------------------|-------------|
| Android emulator | `http://10.0.2.2:5000` (default) |
| iOS simulator | `http://localhost:5000` (default) |
| Real phone | `http://<your-PC-IP>:5000`, e.g. `http://192.168.1.10:5000` |

For a real phone, set `PHONE_URL` in `config.js`. The phone and PC must be on the same Wi-Fi, and your firewall must allow port 5000. Find your PC's IP with `ipconfig` (Windows) or `ifconfig` / `ip a` (Mac/Linux).

## API endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/complete` | Mark a task as completed |
| DELETE | `/api/tasks/:id` | Delete a task |

### Task document (`todo_list_db.tasks`)

```json
{
  "_id": "665f1c2e9b1e8a0012345678",
  "title": "Finish ITCC 106 project",
  "description": "Build and demo the To-Do List app",
  "status": "Pending",
  "createdAt": "2026-11-14T05:30:00.000Z",
  "updatedAt": "2026-11-14T05:30:00.000Z"
}
```

`status` is either `Pending` or `Completed`. `title` is required (max 100 characters); `description` is optional (max 500).

### Error responses

Errors are returned as JSON with a matching status code:

```json
{ "message": "Task title is required" }
```

| Code | Meaning |
|------|---------|
| 400 | Invalid ID, missing title, invalid status or bad JSON |
| 404 | Task or route not found |
| 500 | Server error |

## 3. Test the API with Postman

**Option A: import the collection**

1. Open Postman → **Import** → choose `docs/ToDoList.postman_collection.json`.
2. Make sure the backend is running.
3. Click the collection → **Run** and run all requests in order. The collection saves the new task's ID automatically and checks each response.

**Option B: test manually**

1. **Create:** `POST http://localhost:5000/api/tasks` → Body → *raw* → *JSON*:
   ```json
   { "title": "Buy groceries", "description": "Milk, eggs, bread" }
   ```
   Expect `201 Created`. Copy the `_id` from the response.
2. **Get all:** `GET http://localhost:5000/api/tasks` → `200 OK`.
3. **Get one:** `GET http://localhost:5000/api/tasks/<id>` → `200 OK`.
4. **Update:** `PUT http://localhost:5000/api/tasks/<id>` with
   ```json
   { "title": "Buy groceries and fruit", "description": "Milk, eggs, bread, apples" }
   ```
5. **Complete:** `PATCH http://localhost:5000/api/tasks/<id>/complete` (no body) → `status` becomes `Completed`.
6. **Delete:** `DELETE http://localhost:5000/api/tasks/<id>` → `200 OK`.
7. **Error checks:** a POST with an empty title returns `400`; a GET on a deleted ID returns `404`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `MongoDB connection failed` | Start the MongoDB service, or check `MONGO_URI` (and Atlas IP allow-list). |
| App says "Cannot reach the server" | Backend not running, or wrong address in `src/config.js`. |
| Works in Postman but not on phone | Use your PC's Wi-Fi IP, same network, allow port 5000 in the firewall. |
| Expo version warnings | Run `npx expo install --fix` inside `frontend`. |
| Port 5000 already in use | Change `PORT` in `.env` and in `src/config.js`. |

## Upload to GitHub

```bash
cd todo-list-app
git init
git add .
git commit -m "Initial commit: To-Do List application"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

The `.gitignore` keeps `node_modules` and `.env` out of the repository.

## Author

Your Name – ITCC 106
