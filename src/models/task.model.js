import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const taskSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a text index for both the title and description fields
taskSchema.index({ title: "text", description: "text" });

// Pagination Plugin
taskSchema.plugin(mongooseAggregatePaginate);

export const Task = mongoose.model("Task", taskSchema);