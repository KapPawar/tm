"use client";
import { useUserContext } from "@/context/userContext";
import React from "react";

interface MainContentLayoutProps {
  children: React.ReactNode;
}

function MainContentLayout({ children }: MainContentLayoutProps) {
  const { user } = useUserContext(); // Destructure user from context
  const userId = user ? user._id : null; // Check if user exists before accessing _id

  return (
    <main className={`${userId ? "pr-[10rem]" : ""} pb-[1.5rem] flex h-full`}>
      {children}
    </main>
  );
}

export default MainContentLayout;
