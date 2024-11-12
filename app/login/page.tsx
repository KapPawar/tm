"use client";
import React, { useEffect } from "react";
import LoginForm from "../Components/auth/LoginForm/LoginForm";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

function Page() {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page if user is already logged in
    if (user) {
      router.push("/all-tasks");
    }
  }, [user, router]);

  // Show a loading spinner or placeholder if user data is still being determined
  if (user) {
    return null;
  }

  return (
    <div className="auth-page w-full h-full flex justify-center items-center">
      <LoginForm />
    </div>
  );
}

export default Page;
