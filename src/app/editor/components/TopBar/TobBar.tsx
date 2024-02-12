"use client";
import React from "react";
import { LiaPenNibSolid } from "react-icons/lia";
import { useEditorStore } from "../../../../../lib/zustand/stores/editorStore";

const TopBar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const handlePenToolClick = () => {
    setActiveTool(activeTool === "pen" ? "" : "pen");
  };

  return (
    <div className="bg-gray-200 shadow-md flex items-center justify-between p-4">
      <div className="flex gap-4">
        <button
          onClick={handlePenToolClick}
          className={`p-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
            activeTool === "pen" ? "bg-blue-500 text-white" : ""
          }`}
        >
          <LiaPenNibSolid className="text-xl" />
        </button>
      </div>
    </div>
  );
};
export default TopBar;
