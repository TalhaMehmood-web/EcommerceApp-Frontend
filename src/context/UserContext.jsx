import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [selectedChat, setSelectedChat] = useState(null);
  return (
    <UserContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat }}
    >
      {children}
    </UserContext.Provider>
  );
};
