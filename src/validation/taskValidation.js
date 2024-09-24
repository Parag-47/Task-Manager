import ajv from "./ajvInstance.js";

// For Pagination Params Validation
const searchSchema = { type: "string", minLength: 3, maxLength: 50 };
const pageSchema = { type: "integer", minimum: 1, default: 1 };
const limitSchema = { type: "integer", minimum: 1, default: 10 };
const sortBySchema = {
  type: "string",
  enum: ["createdAt", "updatedAt", "status"],
  default: "updatedAt",
};
const sortTypeSchema = {
  type: "string",
  enum: ["asc", "desc"],
  default: "desc",
};

// For Data Validation
const objectIdSchema = { type: "string", pattern: "^[0-9a-fA-F]{24}$" };
const titleSchema = { type: "string", minLength: 1, maxLength: 50 };
const descriptionSchema = { type: "string", maxLength: 1000 };
const statusSchema = {
  type: "string",
  enum: ["pending", "in-progress", "completed"],
};
const dueDateSchema = { type: "string", format: "date-time" };

const getAllTaskSchema = {
  type: "object",
  properties: {
    search: searchSchema,
    page: pageSchema,
    limit: limitSchema,
    status: statusSchema,
    sortBy: sortBySchema,
    sortType: sortTypeSchema,
  },
  additionalProperties: false,
};

const taskIdSchema = {
  type: "object",
  properties: {
    taskId: objectIdSchema,
  },
  required: ["taskId"],
  additionalProperties: false,
};

const createTaskSchema = {
  type: "object",
  properties: {
    title: titleSchema,
    description: descriptionSchema,
    status: statusSchema,
    dueDate: dueDateSchema,
  },
  required: ["title", "dueDate"],
  additionalProperties: false,
};

const updateTaskSchema = {
  type: "object",
  properties: {
    title: titleSchema,
    description: descriptionSchema,
    status: statusSchema,
    dueDate: dueDateSchema,
  },
  anyOf: [
    { required: ["title"] },
    { required: ["description"] },
    { required: ["status"] },
    { required: ["dueDate"] },
  ],
  additionalProperties: false,
};

const validateGetAllTask = ajv.compile(getAllTaskSchema);
const validateGetTaskById = ajv.compile(taskIdSchema);
const validateCreateTask = ajv.compile(createTaskSchema);
const validateUpdateTask = ajv.compile(updateTaskSchema);
const validateDeleteTask = ajv.compile(taskIdSchema);

export {
  validateGetAllTask,
  validateGetTaskById,
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask,
};
