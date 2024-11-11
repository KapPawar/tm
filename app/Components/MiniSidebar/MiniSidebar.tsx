"use client";
import IconCheck from "@/public/icons/IconCheck";
import IconChart from "@/public/icons/IconChart";
import IconDeleteAll from "@/public/icons/IconDeleteAll";
import IconFileCheck from "@/public/icons/IconFileCheck";
import IconGrid from "@/public/icons/IconGrid";
import IconTaskBoard from "@/public/icons/IconTaskBoard";
import IconStopwatch from "@/public/icons/IconStopwatch";
//import IconTasks from "@/public/icons/IconTasks";
import { link } from "fs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function MiniSidebar() {
  const pathname = usePathname();

  const getStrokeColor = (link: string) => {
    return pathname === link ? "#7263F3" : "#71717a";
  };

  const navItems = [
    {
      icon: <IconGrid strokeColor={getStrokeColor("/all-tasks")} />,
      title: "All Tasks",
      link: "/all-tasks",
    },
    {
      icon: <IconTaskBoard strokeColor={getStrokeColor("/")} />,
      title: "Task Board",
      link: "/",
    },
    {
      icon: <IconFileCheck strokeColor={getStrokeColor("/completed")} />,
      title: "Completed",
      link: "/completed",
    },
    {
      icon: <IconCheck strokeColor={getStrokeColor("/pending")} />,
      title: "Pending",
      link: "/pending",
    },
    {
      icon: <IconStopwatch strokeColor={getStrokeColor("/overdue")} />,
      title: "Overdue",
      link: "/overdue",
    },
    {
      icon: <IconChart strokeColor={getStrokeColor("/activity")} />,
      title: "Analytics",
      link: "/activity",
    },
  ];
  return (
    <div className="basis-[5rem] flex flex-col bg-[#f9f9f9]">
      <div className="flex items-center justify-center h-[5rem]">
        <Image
          src="/logo-transparent-png.png"
          width={60}
          height={60}
          alt="logo"
        />
      </div>

      <div className="mt-8 flex-1 flex flex-col items-center justify-between">
        <ul className="flex flex-col gap-10">
          {navItems.map((item, index) => (
            <li key={index} className="relative group">
              <Link id={index.toString()} href={item.link}>
                {item.icon}
              </Link>

              {/* Hover Tooltip */}
              <span className="u-triangle absolute top-[50%] translate-y-[-50%] left-8 text-xs pointer-events-none text-white bg-[#0064b1] px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.title}
              </span>
            </li>
          ))}
        </ul>

        {/* <div className="mb-[1.5rem]">
          <button className="w-12 h-12 flex justify-center items-center border-2 border-[#EB4E31]  p-2 rounded-full">
            <IconDeleteAll strokeColor="#EB4E31" />
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default MiniSidebar;