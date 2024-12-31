import { createContext, useState } from "react";

export const loginContext = createContext({
  isLogin: false,
  setIsLogin: () => {},
});

export const LoginContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <loginContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </loginContext.Provider>
  );
};
