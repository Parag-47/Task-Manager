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
      "_id": "userId",
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
  ```sh
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
        "_id": "userId",
        "userName": "johndoe",
        "email": "john@example.com",
        "createdAt": "RFC 3339 Date-Time Format",
        "updatedAt": "RFC 3339 Date-Time Format"
      }
    }
  }
  ```

##### **POST /user/updateAccountInfo**
- **Description**: Update the user's account information.
- **Request Body**:
  ```json
  {
    "userName": "johndoe",
    "email": "john@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "User Details Updated Successfully!",
    "data": {
      "accessToken": "accessToken",
      "refreshToken": "refreshToken",
      "loggedInUser": {
        "_id": "userId",
        "userName": "johndoe",
        "email": "john@example.com",
        "createdAt": "RFC 3339 Date-Time Format",
        "updatedAt": "RFC 3339 Date-Time Format"
      }
    }
  }
  ```

##### **POST /user/updatePassword**
- **Description**: Update the user's password.
- **Request Body**:
  ```json
  {
    "oldPassword": "oldPassword",
    "newPassword": "newPassword",
    "confirmPassword": "newPassword"
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Password Updated Successfully!"
  }
  ```

##### **GET /user/getCurrentUser**
- **Description**: Fetch the currently logged-in user.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "User Fetched Successfully!",
    "data": {
      "returns": "updated user details"
    }
  }
  ```

##### **GET /user/deleteAccount**
- **Description**: Delete the user's account.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Account Deleted!"
  }
  ```

##### **GET /user/logout**
- **Description**: Log out a user by invalidating their session.

---

### **Task Endpoints**

##### **POST /task/createTask**
- **Description**: Create a new task for the authenticated user.
- **Request Body**:
  ```json
  {
    "title": "My Task",
    "description": "This is a task description",
    "dueDate": "RFC 3339 Date-Time Format",
    "status": "pending"
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 201,
    "success": true,
    "message": "Task Created Successfully!",
    "data": {
      "_id": "taskId",
      "title": "My Task",
      "description": "This is a task description",
      "dueDate": "RFC 3339 Date-Time Format",
      "status": "pending"
    }
  }
  ```

##### **GET /task/getAllTasks**
- **Description**: Retrieve paginated tasks based on the passed filters like: `search, page, limit, status, sortBy, sortType`
- **Response**:
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "OK",
    "data": {
      "docs": [
        {
          "_id": "taskId",
          "title": "go for a walk",
          "description": "trying to stay fit :)",
          "status": "pending",
          "dueDate": "RFC 3339 Date-Time Format",
          "createdAt": "RFC 3339 Date-Time Format",
          "updatedAt": "RFC 3339 Date-Time Format",
          "score": 1.5
        }
      ],
    "totalDocs": 1,
    "limit": 5,
    "page": 1,
    "totalPages": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": false,
    "prevPage": null,
    "nextPage": null
    }
  }
  ```

##### **GET /task/getTaskById/:taskId**
- **Description**: Retrieve a specific task by its Id.
- **Response**:
  ```json
  {
    "status": 200,
    "success": true,
    "data": {
      "_id": "task-id",
      "title": "My Task",
      "description": "This is a task description",
      "dueDate": "RFC 3339 Date-Time Format",
      "status": "pending",
      "createdAt": "RFC 3339 Date-Time Format",
      "updatedAt": "RFC 3339 Date-Time Format",
    }
  }
  ```

##### **PUT /task/updateTask/:id**
- **Description**: Update the details of an existing task by its Id.
- **Request Body**:
  ```json
  {
    "title": "Updated Task",
    "description": "Updated description",
    "dueDate": "RFC 3339 Date-Time Format",
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
      "dueDate": "RFC 3339 Date-Time Format",
      "status": "completed"
      "createdAt": "RFC 3339 Date-Time Format",
      "updatedAt": "RFC 3339 Date-Time Format",
    }
  }
  ```

##### **DELETE /task/deleteTask/:id**
- **Description**: Delete a specific task by its ID.
- **Response**:
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Task Deleted Successfully!"
  }
  ```