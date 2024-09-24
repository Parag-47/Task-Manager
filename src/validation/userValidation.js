import ajv from "./ajvInstance.js";

const userNameSchema = {
  type: "string",
  minLength: 3,
  maxLength: 50
};

const emailSchema = {
  type: "string",
  format: "email"
};

const passwordSchema = {
  type: "string",
  pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\\$%\\^&\\*])(?=.{8,})"
};

const registerSchema = {
  type: "object",
  properties: {
    userName: userNameSchema,
    email: emailSchema,
    password: passwordSchema,
  },
  required: ["userName", "email", "password"],
  additionalProperties: false,
};

const loginSchema = {
  type: "object",
  properties: {
    userName: userNameSchema,
    email: emailSchema,
    password: passwordSchema
  },
  anyOf: [
    { required: ["userName", "password"] },
    { required: ["email", "password"] }
  ],
  additionalProperties: false,
};

const UpdateAccountInfoSchema = {
  type: "object",
  properties: {
    userName: userNameSchema,
    email: emailSchema,
  },
  anyOf: [
    { required: ["userName"] },
    { required: ["email"] }
  ],
  additionalProperties: false,
};

const updatePasswordSchema = {
  type: "object",
  properties: {
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema
  },
  required: ["oldPassword", "newPassword", "confirmPassword"],
  additionalProperties: false,
};

const validateRegister = ajv.compile(registerSchema);
const validateLogin = ajv.compile(loginSchema);
const validateUpdateAccountInfo = ajv.compile(UpdateAccountInfoSchema);
const validateUpdatePassword = ajv.compile(updatePasswordSchema);

export { validateRegister, validateLogin, validateUpdateAccountInfo, validateUpdatePassword };