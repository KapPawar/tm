"use client";
import Sidebar from "@/app/Components/Sidebar/Sidebar";
import { useUserContext } from "@/context/userContext";
import React from "react";

function SidebarProvider() {
  const { user } = useUserContext(); // Destructure user from context
  const userId = user ? user._id : null; // Check if user exists before accessing _id

  return <>{userId && <Sidebar />}</>;
}

export default SidebarProvider;
