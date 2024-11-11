"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";
import {
  createNewTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from "@/lib/actions/task.actions";
import mongoose from "mongoose"; // Import mongoose for ObjectId

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const { user } = useUserContext();
  const userId = user ? user._id : null;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [priority, setPriority] = useState("all");
  const [activeTask, setActiveTask] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [profileModal, setProfileModal] = useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({});
  };

  const openModalForClone = (task) => {
    setModalMode("add");
    setIsEditing(true);
    setTask(task);
  };

  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask({});
  };

  // Get all tasks
  const getTasks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const tasks = await getAllTasks(userId);
      setTasks(tasks || []);
    } catch (error) {
      console.error("Error getting tasks", error);
    }
    setLoading(false);
  };

  // Get a single task
  const getTask = async (taskId) => {
    setLoading(true);
    try {
      const task = await getTaskById(taskId);
      setTask(task);
    } catch (error) {
      console.error("Error getting task", error);
    }
    setLoading(false);
  };

  const createTask = async (taskData) => {
    if (!userId) {
      console.error("User ID is missing. Cannot create task without user ID.");
      return;
    }

    setLoading(true);
    try {
      const user = new mongoose.Types.ObjectId(String(userId)); // Convert userId to ObjectId
      const newTask = await createNewTask({
        ...taskData,
        user: user,
      });
      setTasks([...tasks, newTask]);
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error creating task", error);
    }
    setLoading(false);
  };

  const updateTask = async (taskData) => {
    setLoading(true);
    try {
      const updatedTask = await updateTaskById(taskData._id, taskData);
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task", error);
    }
    setLoading(false);
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      await deleteTaskById(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task", error);
    }
    setLoading(false);
  };

  const handleInput = (name) => (e) => {
    if (name === "setTask") {
      setTask(e);
    } else {
      setTask({ ...task, [name]: e.target.value });
    }
  };

  // Filter completed and active tasks
  const completedTasks = tasks.filter((task) => task.completed);
  const activeTasks = tasks.filter((task) => !task.completed);

  useEffect(() => {
    if (userId) getTasks();
  }, [userId]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        openModalForClone,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        activeTasks,
        completedTasks,
        profileModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
