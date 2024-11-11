"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React from "react";

function Header() {
  const { logout, user } = useUserContext(); // Access logout and user from UserContext
  const { openModalForAdd, activeTasks } = useTasks();
  const router = useRouter();

  const userId = user ? user._id : null; // Ensure user is checked before accessing _id
  const userName = user ? user.name : ""; // Check if user exists before accessing name

  return (
    <header className="px-6 my-4 w-full flex items-center justify-between bg-[#f9f9f9]">
      <div>
        <h1 className="text-lg font-medium">
          {userId ? `Welcome, ${userName}!` : "Welcome to Task Manager"}
        </h1>
        <p className="text-sm">
          {userId ? (
            <>
              You have{" "}
              <span className="font-bold text-[#0064b1]">
                {activeTasks.length}
              </span>
              &nbsp;active tasks
            </>
          ) : (
            "Please login or register to view your tasks"
          )}
        </p>
      </div>
      <div className="h-[50px] flex gap-2">
        <button
          id="addtask"
          className="px-8 py-3 bg-[#0064b1] hover:bg-[#7263F3] text-white rounded-[50px]
          hover:text-white transition-all duration-200 ease-in-out"
          onClick={() => {
            if (userId) {
              openModalForAdd();
            } else {
              router.push("/login");
            }
          }}
        >
          {userId ? "Add a new Task" : "Login / Register"}
        </button>

        {userId && (
          <button
            className="px-8 py-3 bg-[#0064b1] hover:bg-[#7263F3] text-white rounded-[50px]
            hover:text-white transition-all duration-200 ease-in-out"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
