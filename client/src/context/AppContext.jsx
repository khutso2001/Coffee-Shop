import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [coffees, setCoffees] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  return (
    <AppContext.Provider
      value={{ coffees, setCoffees, ingredients, setIngredients }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => {
  return useContext(AppContext);
};
