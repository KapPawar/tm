import { Schema, model, models } from "mongoose";

// Define the schema for the Task model
const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    description: {
      type: String,
      default: "No description",
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create the Task model or use the existing model
const TaskModel = models.Task || model("Task", TaskSchema);

export default TaskModel;
