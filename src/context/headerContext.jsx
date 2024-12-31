import { createContext, useState } from "react";

const HeaderContext = createContext({
  isSearching: false,
  isMenuOpen: false,
  setIsSearching: () => {},
  setIsMenuOpen: () => {},
});

export const SearchingContextProvider = ({ children }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <HeaderContext.Provider value={{ isSearching, setIsSearching, isMenuOpen, setIsMenuOpen }}>
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderContext;
