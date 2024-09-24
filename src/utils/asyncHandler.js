const asyncHandler = (fun) => async (req, res, next) => {
  try {
    await fun(req, res, next);
  } catch (error) {
    console.error(`Error: `, error);
    res.status(error.statuscode || 500).json({
      status: error.statuscode,
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export default asyncHandler;