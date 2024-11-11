"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { loginUser } from "@/lib/actions/user.actions";
import { useUserContext } from "@/context/userContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Initialize useRouter
  const { setUser } = useUserContext(); // Get setUser from UserContext

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      if (user) {
        setUser(user); // Store user in context
        console.log(user);
        router.push("/");
      } else {
        alert("Invalid credentials");
      } // router.push("/dashboard"); // Redirect to dashboard upon successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]"
    >
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Login to Your Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Login Now. Don't have an account?{" "}
          <a
            href="/register"
            className="font-bold text-[#0064b1] hover:text-[#7263F3] transition-all duration-300"
          >
            Register here
          </a>
        </p>

        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            className="px-4 py-3 border-[2px] rounded-md outline-[#0064b1] text-gray-800"
            placeholder="johndoe@gmail.com"
          />
        </div>

        <div className="relative mt-[1rem] flex flex-col">
          <label htmlFor="password" className="mb-1 text-[#999]">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            className="px-4 py-3 border-[2px] rounded-md outline-[#0064b1] text-gray-800"
            placeholder="***************"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
          >
            {showPassword ? (
              <i className="fas fa-eye-slash"></i>
            ) : (
              <i className="fas fa-eye"></i>
            )}
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <a
            href="/forgot-password"
            className="font-bold text-[#0064b1] text-[14px] hover:text-[#7263F3] transition-all duration-300"
          >
            Forgot password?
          </a>
        </div>

        <div className="flex">
          <button
            type="submit"
            disabled={!email || !password}
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#0064b1] hover:bg-[#7263F3] text-white rounded-md cursor-pointer transition-colors"
          >
            Login Now
          </button>
        </div>
      </div>
      <img src="/flurry.png" alt="" />
    </form>
  );
}

export default LoginForm;
