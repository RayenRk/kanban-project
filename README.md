
```markdown
# Kanban Project Web Application

## Overview

Welcome to our Kanban Project Web Application documentation. This application is designed to streamline project management using the Kanban methodology. Users can create projects, define tasks, and manage their workflow efficiently.

## Installation

1. Clone the repository: `git clone https://github.com/RayenRk/kanban-project.git`
2. Install dependencies: `npm install`
3. Set up MongoDB database
4. Run the application: `npm start`

## Usage

To use the application:

- Register and authenticate as a user
- Create projects and tasks
- Assign tasks to team members
- Use the drag-and-drop dashboard to update task status

## Technologies Used

- Angular
- Node.js
- Express.js
- MongoDB

## Folder Structure

```
kanban-project/
│
├── client/                  # Angular Frontend
│   ├── src/                 # Source files
│   └── ...                  
│
├── server/                  # Node.js Backend
│   ├── routes/              # API routes
│   ├── models/              # MongoDB models
│   └── controller/                  
│    
└── ...
```

## API Endpoints

- `/api/auth`: Authentication endpoints
- `/api/projects`: CRUD operations for projects
- `/api/tasks`: CRUD operations for tasks
- `/api/users`: CRUD operations for users

## Database Schema

### Users

```json
{
  "username": "String",
  "password": "String",
  "email": "String",
  "role": "String",
  "isAuthenticated": "Boolean",
  "createdAt": "Date"
}
```

### Projects

```json
{
  "name": "String",
  "description": "String",
  "dateStart": "Date",
  "tasks": ["taskId"]
}
```

### Tasks

```json
{
  "name": "String",
  "description": "String",
  "status": "String",
  "responsible": "String"
}
```





## Credits

- Angular: [link to Angular](https://angular.io/)
- Node.js: [link to Node.js](https://nodejs.org/)
- Express.js: [link to Express.js](https://expressjs.com/)
- MongoDB: [link to MongoDB](https://www.mongodb.com/)
```
