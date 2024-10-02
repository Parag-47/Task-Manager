# **Task Manager API**

### **Description**

Task Manager API is a robust backend application for managing tasks, projects, and users. It offers features like user authentication, task creation and user management. The API is designed to be secure, making use of Node.js, Express.js, MongoDB, and other modern backend technologies.

---

### **Features**

- User Authentication (JWT-based)
- Input Validation with AJV
- Security best practices (Helmet, Express Mongo Sanitize, etc.)
- Pagination for tasks.

---

### **Technologies Used**

- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing tasks, and user information
- **JWT**: JSON Web Token for secure authentication
- **AJV**: Schema-based data validation
- **Helmet.js**: Secure HTTP headers for security best practices
- **Bcrypt**: Password hashing for secure storage

---

### **Getting Started**

Follow these instructions to set up the project locally.

#### **Prerequisites**

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/)
- [AJV](https://ajv.js.org/)

#### **Installation Instructions**

Follow the steps below to clone the repository, install dependencies, and run the project locally:

```bash
# Clone the repository
git clone https://github.com/parag-47/Task-Manager.git

# Navigate into the project directory
cd Task-Manager

# Install dependencies
npm install

# Start the server
npm start
```

#### **Environment Variables**

Ensure you have the environment variables set up for the project like:

```bash
DB_Name=task-manager
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_secret_key

Refer To The Provided .env.sample File
```
---

### **API Documentation**
The API provides a set of RESTful endpoints for managing users and tasks, all responses are JSON-encoded.
Read The API Documentation Provided In The Repo `Endpoint Documentation.md`.

#### **User Management**
- POST /user/register – Register a new user
- POST /user/login – Login a user and return JWT
- GET /user/logout – Logout the user and invalidate the session
- POST /user/updateAccountInfo – Update user's account information
- POST /user/updatePassword – Update user's password
- GET /user/getCurrentUser – Get the currently logged-in user
- GET /user/refreshAccessToken – Refresh the user's access token
- DELETE /user/deleteAccount – Delete the user's account

#### **Task Management**
- GET /task/getAllTasks?filters Fetch all tasks (supports filters like text search, pagination, status, sorting)
- GET /task/getTaskById/:id – Get a task by its ID
- POST /task/createTask – Create a new task
- POST /task/updateTask/:id – Update a task by its ID
- GET /task/deleteTask/:id – Delete a task by its ID
---

### **Data Validation with AJV**

AJV is used for validating the input data (e.g., task creation, update requests). For instance, during task creation, the following schema ensures the correct data types and structure:

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "minLength": 1, "maxLength": 50 },
    "description": { "type": "string", "maxLength": 1000 },
    "dueDate": { "type": "string", "format": "date-time" },
    "status": { "type": "string", "enum": ["pending", "in-progress", "completed"] }
  },
  "required": ["title", "dueDate"]
}
```
---

### **EDR Diagram**
Check out the Entity-Relationship Diagram (ERD) for the Task Manager API [here](https://app.eraser.io/workspace/LkEp2wbNih6azcR73Ms3?origin=share&elements=Gj9AGlSlYBvAOFvQxkizag).

![](https://app.eraser.io/workspace/LkEp2wbNih6azcR73Ms3/preview?elements=Gj9AGlSlYBvAOFvQxkizag&type=embed)

---

### **Endpoint Testing Instructions**

You can test the API endpoints using Postman by importing the collection found in the `Task Manager.postman_collection.json` file.

- **Base URL**: `http://localhost:3000/api/v1`