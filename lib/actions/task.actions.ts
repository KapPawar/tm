// task.actions.ts
"use server";

import mongoose from "mongoose";
import { connectToDatabase } from "../mongodb/database";
import Task from "../mongodb/database/models/task.model"; // Ensure you have a Task model
import { handleError } from "../utils";

// Get all tasks
export async function getAllTasks(userId: string) {
  try {
    await connectToDatabase();
    const objectId = new mongoose.Types.ObjectId(userId);
    const tasks = await Task.find({ user: objectId });
    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    handleError(error);
  }
}

// Get a single task
export async function getTaskById(taskId: string) {
  try {
    await connectToDatabase();
    const task = await Task.findById(taskId);
    return JSON.parse(JSON.stringify(task));
  } catch (error) {
    handleError(error);
  }
}

// Create a new task
export async function createNewTask(taskData: any) {
  try {
    await connectToDatabase();
    const newTask = await Task.create(taskData);
    return JSON.parse(JSON.stringify(newTask));
  } catch (error) {
    handleError(error);
  }
}

// Update a task
export async function updateTaskById(taskId: string, updates: any) {
  try {
    await connectToDatabase();
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
      runValidators: true,
    });
    return JSON.parse(JSON.stringify(updatedTask));
  } catch (error) {
    handleError(error);
  }
}

// Delete a task
export async function deleteTaskById(taskId: string) {
  try {
    await connectToDatabase();
    await Task.findByIdAndDelete(taskId);
  } catch (error) {
    handleError(error);
  }
}
