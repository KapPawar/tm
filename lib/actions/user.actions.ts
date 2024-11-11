"use server";

import bcrypt from "bcrypt";
import { handleError } from "../utils";
import { connectToDatabase } from "../mongodb/database";
import User from "../mongodb/database/models/user.model";

// Define types for user parameters
export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
  photo?: string;
  bio?: string;
  role?: "user" | "admin" | "creator";
  isVerified?: boolean;
};

export type UpdateUserParams = Partial<CreateUserParams>;

// Register a new user
export async function registerUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    // Check if the email is already in use
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      throw new Error("Email is already in use.");
    }

    // Create the new user
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// Login an existing user
export async function loginUser(email: string, password: string) {
  try {
    await connectToDatabase();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials.");

    // Check if the password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new Error("Invalid credentials.");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// Update user information
export async function updateUser(userId: string, updates: UpdateUserParams) {
  try {
    await connectToDatabase();

    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) throw new Error("User update failed.");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}
