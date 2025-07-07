import { createContext, useContext, useState, useEffect } from "react";

const DateFormatContext = createContext({
  dateFormat: "Month D, Yr",
  setDateFormat: () => {},
});

export function DateFormatProvider({ children }) {
  const [dateFormat, setDateFormatState] = useState("Month D, Yr");

  // Load from localStorage on mount
  useEffect(() => {
    const saved =
      typeof window !== "undefined" && localStorage.getItem("dateFormat");
    if (saved) setDateFormatState(saved);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dateFormat", dateFormat);
    }
  }, [dateFormat]);

  // Wrap setDateFormat to update state
  const setDateFormat = (val) => setDateFormatState(val);

  return (
    <DateFormatContext.Provider value={{ dateFormat, setDateFormat }}>
      {children}
    </DateFormatContext.Provider>
  );
}

export function useDateFormat() {
  return useContext(DateFormatContext);
}
