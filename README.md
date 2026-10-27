# To Do List App

A full-stack to do list app made by **SARVESH CHONDE**.

- **client** – React (Vite) with React Router
- **server** – Node.js (Express) REST API
- **database** – MongoDB (local, `mongodb://localhost:27017`, db `todoDb`)

## Features

- Add tasks with a category, priority and due date
- Filter (All / Pending / Done), search and sort tasks (newest, due date, priority)
- Edit a task's details and notes on its own page
- Dashboard with totals, progress, overdue warning and tasks due today
- Upcoming view grouping pending tasks into Overdue / Today / Upcoming / No due date
- Categories page with per-category progress
- Notes you can add, edit and delete
- Contact form that saves messages to the database, viewable on the Messages page

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (required by Vite)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

## Run

Start the server (runs on http://localhost:5000):

```
cd server
npm install
npm start
```

Use `npm run dev` instead of `npm start` to restart the server automatically when files change.

In a second terminal, start the client (opens on http://localhost:5173):

```
cd client
npm install
npm run dev
```

## Configuration

Everything works with the defaults above. To change them, set these environment variables:

| Variable | Where | Default |
| --- | --- | --- |
| `PORT` | server | `5000` |
| `MONGO_URI` | server | `mongodb://localhost:27017` |
| `VITE_API_URL` | client | `http://localhost:5000` |

For example: `PORT=5050 npm start` and `VITE_API_URL=http://localhost:5050 npm run dev`.

## API

All request and response bodies are JSON. Errors come back as `{ "msg": "..." }` with a `400` (invalid input) or `404` (not found) status.

| Method | Route | Description |
| --- | --- | --- |
| GET | `/getall` | All tasks, newest first |
| GET | `/get/:id` | One task |
| POST | `/create` | Create a task: `title` (required), `priority`, `dueDate`, `category`, `notes` |
| PUT | `/update/:id` | Update any of `title`, `done`, `priority`, `dueDate`, `category`, `notes` |
| DELETE | `/delete/:id` | Delete a task |
| DELETE | `/deleteCompleted` | Delete all completed tasks |
| GET | `/notes` | All notes, newest first |
| POST | `/notes` | Create a note: `title` (required), `text` |
| PUT | `/notes/:id` | Update a note: `title` (required), `text` |
| DELETE | `/notes/:id` | Delete a note |
| GET | `/messages` | All contact messages, newest first |
| POST | `/contact` | Send a message: `name`, `email`, `message` (all required) |
| DELETE | `/messages/:id` | Delete a message |

`priority` is one of `Low`, `Medium`, `High`, and `category` is one of `Personal`, `Work`, `Study`, `Shopping`, `Other`.

## Screenshots

<img width="658" height="406" alt="image" src="https://github.com/user-attachments/assets/60a0cdb3-9396-4806-aafa-fec6e1a0a320" />
<img width="392" height="200" alt="image" src="https://github.com/user-attachments/assets/1e63198e-1109-4d7b-99c9-4c100f7d21bb" />

### Evidence of the running app and development with the stack above

<img width="386" height="666" alt="image" src="https://github.com/user-attachments/assets/b0baec33-5248-4da9-b4c3-1fb6cdf91097" /> <img width="396" height="252" alt="image" src="https://github.com/user-attachments/assets/0b0706a8-daae-457f-ac42-250478f76822" />
<img width="1089" height="686" alt="image" src="https://github.com/user-attachments/assets/830be760-7bcd-46eb-8c8a-d6f72e29f0ee" />
<img width="1076" height="688" alt="image" src="https://github.com/user-attachments/assets/f6b3bc5d-5ccf-44aa-84ad-a0118eb2a9c5" />
<img width="1120" height="710" alt="image" src="https://github.com/user-attachments/assets/115af8ca-fa27-4fb3-b6d2-6e7d2e571453" />
<img width="1075" height="684" alt="image" src="https://github.com/user-attachments/assets/545e1ffa-133b-4248-89df-ac9a0945d262" />
<img width="1080" height="686" alt="image" src="https://github.com/user-attachments/assets/515c2d87-b355-490d-939b-cdaeb6029754" />
<img width="1117" height="696" alt="image" src="https://github.com/user-attachments/assets/91ddd54c-5e7d-4aa7-a0e8-489233334ec2" />
<img width="973" height="674" alt="image" src="https://github.com/user-attachments/assets/f1303bbd-df17-4363-a88c-b6aa86c80f89" />
<img width="1010" height="696" alt="image" src="https://github.com/user-attachments/assets/c027137c-c28b-4e3a-8e1a-1052fa879902" />
