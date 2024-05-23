import React from "react";

const ChatButtons = ({ title }) => {
  return (
    <button
      type="button"
      className="px-4 w-20  sm:w-32 py-1  text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
    >
      <p>{title}</p>
    </button>
  );
};

export default ChatButtons;
