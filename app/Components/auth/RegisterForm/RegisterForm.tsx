"use client";
import { CreateUserParams, registerUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

// import { registerUser } from "../actions"; // Adjust the path as needed

function RegisterForm() {
  // const router = useRouter()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const togglePassword = () => setShowPassword(!showPassword);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser: CreateUserParams = {
        name,
        email,
        password,
        role: (role || "user") as "user" | "admin" | "creator",
      };
      await registerUser(newUser);
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]"
    >
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Register for an Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Create an account. Already have an account?{" "}
          <a
            href="/login"
            className="font-bold text-[#0064b1] hover:text-[#7263F3] transition-all duration-300"
          >
            Login here
          </a>
        </p>
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-[#999]">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 border-[2px] rounded-md outline-[#0064b1] text-gray-800"
            placeholder="John Doe"
          />
        </div>
        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            className="px-4 py-3 border-[2px] rounded-md outline-[#0064b1] text-gray-800"
            placeholder="***************"
          />
          <button
            type="button"
            className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
            onClick={togglePassword}
          >
            {showPassword ? (
              <i className="fas fa-eye-slash"></i>
            ) : (
              <i className="fas fa-eye"></i>
            )}
          </button>
        </div>
        <div className="relative mt-[1rem] flex flex-col">
          <label htmlFor="role" className="mb-1 text-[#999]">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-3 border-[2px] rounded-md outline-[#0064b1] text-gray-800"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="creator">creator</option>
          </select>
        </div>
        <div className="flex">
          <button
            type="submit"
            disabled={!name || !email || !password}
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#0064b1] text-white rounded-md hover:bg-[#7263F3] transition-colors"
          >
            Register Now
          </button>
        </div>
      </div>
      <img src="/flurry.png" alt="" />
    </form>
  );
}

export default RegisterForm;
