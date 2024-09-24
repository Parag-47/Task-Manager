# Task Manager API

### Project Overview

The Task Manager API is designed to handle user authentication and task management functionalities. Users can register, log in, and manage their tasks by creating, updating, deleting, and viewing them. The API supports JWT-based authentication for secure access.

### Installation Instructions

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

### Environment Variables

Ensure you have the environment variables set up for the project like:

```bash
DB_Name=task-manager
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret_key

Refer To The Provided .env.sample File
```

## Endpoints Documentation

### **User Endpoints**

##### **POST /user/register**
- **Description**: Register a new user in the system.
- **Request Body**:
  ```json
  {
    "userName": "johndoe",
    "email": "john@example.com",
    "password": "Password@123"
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 201,
    "success": true,
    "message": "User Registered Successfully!",
    "data": {
      "_id": "66f048903f7234f52866624e",
      "userName": "johndoe",
      "email": "john@example.com",
      "createdAt": "RFC 3339 Date-Time Format",
      "updatedAt": "RFC 3339 Date-Time Format"
    }
  }
  ```

##### **POST /user/login**
- **Description**: Log in a user and return a JWT token.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password@123"
  }
    or
  {
    "userName": "johndoe",
    "password": "Password@123"
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "User Logged In Successfully!",
    "data": {
      "accessToken": "accessToken",
      "refreshToken": "refreshToken",
      "loggedInUser": {
        "_id": "66f048903f7234d51765524e",
        "userName": "johndoe",
        "email": "john@example.com",
        "createdAt": "RFC 3339 Date-Time Format",
        "updatedAt": "RFC 3339 Date-Time Format"
      }
    }
  }
  ```

##### **GET /user/logout**
- **Description**: Log out a user by invalidating their session.

### **Task Endpoints**

##### **POST /task/createTask**
- **Description**: Create a new task for the authenticated user.
- **Request Body**:
  ```json
  {
    "title": "My Task",
    "description": "This is a task description",
    "dueDate": "2024-09-23T00:00:00Z"
  }
  ```
- **Response**:
  ```json
  {
    "status": true,
    "message": "Task Created Successfully!",
    "data": {
      "_id": "task-id",
      "title": "My Task",
      "description": "This is a task description",
      "dueDate": "2024-09-23T00:00:00Z",
      "status": "pending"
    }
  }
  ```

##### **GET /task/getTaskById/:id**
- **Description**: Retrieve a specific task by its ID.
- **Response**:
  ```json
  {
    "status": true,
    "data": {
      "_id": "task-id",
      "title": "My Task",
      "description": "This is a task description",
      "dueDate": "2024-09-23T00:00:00Z",
      "status": "pending"
    }
  }
  ```

##### **PUT /task/updateTask/:id**
- **Description**: Update the details of an existing task by its ID.
- **Request Body**:
  ```json
  {
    "title": "Updated Task",
    "description": "Updated description",
    "status": "completed"
  }
  ```
- **Response**:
  ```json
  {
    "status": true,
    "message": "Task Updated Successfully!",
    "data": {
      "_id": "task-id",
      "title": "Updated Task",
      "description": "Updated description",
      "status": "completed"
    }
  }
  ```

##### **DELETE /task/deleteTask/:id**
- **Description**: Delete a specific task by its ID.
- **Response**:
  ```json
  {
    "status": true,
    "message": "Task Deleted Successfully!"
  }
  ```

### Data Validation with AJV

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

### EDR Diagram
Check out the Entity-Relationship Diagram (ERD) for the Task Manager API [here](https://app.eraser.io/workspace/LkEp2wbNih6azcR73Ms3?origin=share&elements=Gj9AGlSlYBvAOFvQxkizag).

### Testing Instructions

You can test the API endpoints using Postman by importing the collection found in the `Task Manager.postman_collection.json` file.

- **Base URL**: `http://localhost:3000/api/v1`