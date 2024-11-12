"use client";
import { useTasks } from "@/context/taskContext";
import useRedirect from "@/hooks/useUserRedirect";
import Filters from "./Components/Filters/Filters";
import TaskItem from "./Components/TaskItem/TaskItem";
import { filteredTasks } from "@/utils/utilities";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/utils/animations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "@/utils/types";

export default function Home() {
  useRedirect("/login");

  const { tasks, openModalForAdd, priority, setPriority } = useTasks();
  const filtered = filteredTasks(tasks, priority);

  // Task arrays with specific types
  const [completed, setCompleted] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  // Populate completed and in-progress lists
  useEffect(() => {
    const newTaskList = filtered.map((task, index) => ({
      ...task,
      id: index + 1,
    }));

    const comp = newTaskList.filter((task) => task.completed === true);
    const inProg = newTaskList.filter((task) => task.completed !== true);

    if (comp.length > 0) {
      setCompleted(comp);
    } else {
      setCompleted([
        {
          _id: "",
          id: inProg.length + 1,
          title: "",
          description: "",
          status: "",
          completed: true,
          dueDate: "",
          priority: "",
          createdAt: "",
          updatedAt: "",
        },
      ]);
    }

    if (inProg.length > 0) {
      setInProgress(inProg);
    } else {
      setInProgress([
        {
          _id: "",
          id: comp.length + 1,
          title: "",
          description: "",
          status: "",
          completed: false,
          dueDate: "",
          priority: "",
          createdAt: "",
          updatedAt: "",
        },
      ]);

      // setCompleted(newTaskList.filter((task) => task.completed === true));
      // setInProgress(inProg);
    }
    // setCompleted(newTaskList.filter((task) => task.completed === true));
    // setInProgress(inProg);
  }, [tasks, priority]);

  // Initial setup for priority
  useEffect(() => {
    setPriority("all");
  }, []);

  // Overdue tasks notification
  useEffect(() => {
    tasks.forEach((task: any) => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!task.completed && dueDate < today) {
        const overdueDays = Math.floor(
          (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        toast(`${task.title} is overdue by ${overdueDays} day(s)`, {
          position: "top-right",
        });
      }
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  // Determine which list an item belongs to
  const findList = (id: number) =>
    inProgress.some((task) => task.id === id) ? "inProgress" : "completed";

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    const activeList = findList(active.id);
    const overList = findList(over.id);

    if (activeList !== overList) {
      const activeTask =
        activeList === "inProgress"
          ? inProgress.find((task) => task.id === active.id)
          : completed.find((task) => task.id === active.id);

      if (activeTask) {
        if (overList === "inProgress") {
          setInProgress((prev) => [...prev, activeTask]);
          setCompleted((prev) => prev.filter((task) => task.id !== active.id));
        } else {
          setCompleted((prev) => [...prev, activeTask]);
          setInProgress((prev) => prev.filter((task) => task.id !== active.id));
        }
      }
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeList = findList(active.id);
    const overList = findList(over.id);

    if (activeList === overList) {
      const activeIndex =
        activeList === "inProgress"
          ? inProgress.findIndex((task) => task.id === active.id)
          : completed.findIndex((task) => task.id === active.id);

      const overIndex =
        activeList === "inProgress"
          ? inProgress.findIndex((task) => task.id === over.id)
          : completed.findIndex((task) => task.id === over.id);

      if (activeIndex !== overIndex) {
        if (activeList === "inProgress") {
          setInProgress((items) => arrayMove(items, activeIndex, overIndex));
        } else {
          setCompleted((items) => arrayMove(items, activeIndex, overIndex));
        }
      }
    } else if (activeList && overList && activeList !== overList) {
      // Move item between lists
      const activeTask =
        activeList === "inProgress"
          ? inProgress.find((task) => task.id === active.id)
          : completed.find((task) => task.id === active.id);

      if (!activeTask) return;

      if (overList === "inProgress") {
        setInProgress((items) => [...items, activeTask]);
        setCompleted((items) =>
          items.filter((item) => item.id !== activeTask.id)
        );
      } else if (overList === "completed") {
        setCompleted((items) => [...items, activeTask]);
        setInProgress((items) =>
          items.filter((item) => item.id !== activeTask.id)
        );
      }
    }

    // Add placeholder task if list is empty
    if (inProgress.length === 0) {
      setInProgress([
        {
          _id: "",
          id: completed.length + 1,
          title: "",
          description: "",
          status: "",
          completed: false,
          dueDate: "",
          priority: "",
          createdAt: "",
          updatedAt: "",
        },
      ]);
    }

    if (completed.length === 0) {
      setCompleted([
        {
          _id: "",
          id: inProgress.length + 1,
          title: "",
          description: "",
          status: "",
          completed: true,
          dueDate: "",
          priority: "",
          createdAt: "",
          updatedAt: "",
        },
      ]);
    }

    setActiveId(null);
  };

  const { setNodeRef: setFirstDroppableRef } = useDroppable({
    id: "in-progress",
  });

  const { setNodeRef: setSecondDroppableRef } = useDroppable({
    id: "completed",
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <main className="m-6 h-full">
        {/* <ToastContainer /> */}
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <Filters />
        </div>

        <motion.div
          className="pb-[2rem] mt-6 flex flex-row gap-5 "
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <div
            className="task-column flex flex-col gap-2 w-[350px]"
            ref={setFirstDroppableRef}
          >
            <h2 className="text-xl font-semibold px-4">In Progress</h2>
            <SortableContext
              id="in-progress"
              items={inProgress}
              strategy={horizontalListSortingStrategy}
            >
              {inProgress.map((task, index) => (
                <TaskItem key={task.id} id={task.id} task={task} />
              ))}
            </SortableContext>
          </div>

          <div
            className="task-column flex flex-col gap-2 w-[350px]"
            ref={setSecondDroppableRef}
          >
            <h2 className="text-xl font-semibold px-4">Completed</h2>
            <SortableContext
              id="completed"
              items={completed}
              strategy={horizontalListSortingStrategy}
            >
              {completed.map((task) => (
                <TaskItem key={task.id} id={task.id} task={task} />
              ))}
            </SortableContext>
          </div>
        </motion.div>
      </main>
    </DndContext>
  );
}
