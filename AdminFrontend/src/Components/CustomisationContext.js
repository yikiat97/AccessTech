import React, { createContext, useState, useContext, useEffect } from 'react';

export const CustomisationContext = createContext();

export const CustomisationProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [buttonSize, setButtonSize] = useState(localStorage.getItem('buttonSize') || 'lg');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || '2xl');
  const [fontColor, setFontColor] = useState(localStorage.getItem('fontColor') || '#FFFFFF');
  const [serveButtonColor, setServeButtonColor] = useState(localStorage.getItem('serveButtonColor') || '#6B46C1'); 
  const [cancelButtonColor, setCancelButtonColor] = useState(localStorage.getItem('cancelButtonColor') || '#E53E3E'); 

  


  useEffect(() => {
    localStorage.setItem('buttonSize', buttonSize);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('serveButtonColor', serveButtonColor);
    localStorage.setItem('cancelButtonColor', cancelButtonColor);
    localStorage.setItem('fontColor', fontColor);

  }, [buttonSize, fontSize, serveButtonColor, cancelButtonColor, fontColor, setFontColor]);

  return (
    <CustomisationContext.Provider value={{ isDarkMode, setIsDarkMode, buttonSize, setButtonSize, fontSize, setFontSize, fontColor, setFontColor, serveButtonColor, setServeButtonColor, cancelButtonColor, setCancelButtonColor}}>
      {children}
    </CustomisationContext.Provider>
  );
};

export const useCustomisation = () => {
  return useContext(CustomisationContext);
};