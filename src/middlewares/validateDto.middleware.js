import ApiResponse from "../utils/ApiResponse.js";

function validateDto(validate, source) {
  return (req, res, next) => {
    const valid = validate(req[source]);
    if (valid) return next();
    console.error("Invalid Data, Error: ", validate.errors);
    return res.status(400).json(new ApiResponse(400, false, "Invalid Data, Error!", validate.errors));
  };
}

export const validateDto_Body = (validate) => validateDto(validate, 'body');
export const validateDto_Param = (validate) => validateDto(validate, 'params');
export const validateDto_Query = (validate) => validateDto(validate, 'query');