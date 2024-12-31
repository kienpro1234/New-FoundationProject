import { createContext, useState } from "react";

export const UserContext = createContext({
  isEditing: false,
  setIsEditing: () => null,
});

export const UserContextProvider = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);
  return <UserContext.Provider value={{ isEditing, setIsEditing }}>{children}</UserContext.Provider>;
};
