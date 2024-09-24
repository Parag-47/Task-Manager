import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getAllTasks = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10, status, sortBy = 'createdAt', sortType = 'desc' } = req.query;

  const options = {
    page: page,
    limit: limit,
    sort: { [sortBy]: sortType === 'asc' ? 1 : -1 },
  };

  const matchConditions = {
    owner: req.user?._id,
  };
  
  // Add the text search if a search query is provided
  if (search) {
    matchConditions.$text = { $search: search };
  }

  // Add the status filter if a status query is provided
  if (status) {
    matchConditions.status = status;
  }
  const pipeline = [
    { $match: matchConditions },
    { $project: { owner: 0, __v: 0 } }
  ];

  // If search is provided, add text score projection and sorting
  if (search) {
    pipeline[1].$project.score = { $meta: "textScore" }; // Include score
    pipeline.push({
      $sort: {
        score: { $meta: "textScore" }, // Sort by text score
        [sortBy]: sortType === 'asc' ? 1 : -1,
      }
    });
  } else {
    pipeline.push({
      $sort: {
        [sortBy]: sortType === 'asc' ? 1 : -1
      }
    });
  }

  const data = await Task.aggregatePaginate(Task.aggregate(pipeline), options);

  if (!data) throw new ApiError(500, "Failed To Fetch Tasks!");

  res.status(200).json(new ApiResponse(200, true, "OK", data));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  // No Longer Needed Since It's Getting Handled By AJV.
  // if (!taskId) throw new ApiError(200, "Couldn't Find Video ID!");
  // if (!isValidObjectId(taskId)) throw new ApiError(400, "Invalid Video Id!");

  const task = await Task.findById(taskId).select("-owner -__v");

  if (!task) throw new ApiError(500, "Failed To Fetch The Task!");

  res
    .status(200)
    .json(
      new ApiResponse(200, true, "Task Fetched Successfully!", task)
    );
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(400, "User Not Found!");

  const task = await Task.create({
    owner: user._id,
    title,
    description,
    status,
    dueDate
  });

  if (!task) throw new ApiError(500, "Couldn't Create A New Task!");

  /* No Need Of Maintain An Tasks Array In User Collection Since Tracking, 
  Updating And Deleting Can Easily Be Done By Querying The Owner Property */

    // user.tasks.push(task._id);
    // const savedUser = await user.save();
    // if (!savedUser || !savedUser.tasks.includes(task._id)) {
    //   const deletedTask = await Task.findByIdAndDelete(task._id);
    //   if (!deletedTask) {
    //     throw new ApiError(500, "Task created successfully but failed to add the task to the user's task list!");
    //   }
    //   throw new ApiError(500, "Failed To Create new task!");
    // }
  
  //

  res.status(201).json(new ApiResponse(201, true, "Task Created Successfully!", task));
});

const updateTask = asyncHandler(async (req,res)=>{
  const { taskId } = req.params;

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(400, "User Not Found!");

  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(400, "Invalid Task Id!");

  if (JSON.stringify(user._id) !== JSON.stringify(task.owner))
    throw new ApiError(401, "Not Authorized!");

  const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
  if (!updatedTask) throw new ApiError(500, "Failed To Update Task!");

  res.status(200).json(new ApiResponse(200, true, "Task Updated Successfully!", updatedTask));
});

const deleteTask = asyncHandler(async (req,res)=>{
  const { taskId } = req.params;

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(400, "User Not Found!");

  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(400, "Invalid Task Id!");

  if (JSON.stringify(user._id) !== JSON.stringify(task.owner))
    throw new ApiError(401, "Not Authorized!");

  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deletedTask) throw new ApiError(400, "Failed To Delete Task!");

  res
    .status(200)
    .json(new ApiResponse(200, true, "Task Deleted Successfully!", deletedTask));
});

export { getAllTasks, getTaskById, createTask, updateTask, deleteTask };