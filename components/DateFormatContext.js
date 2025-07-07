import { createContext, useContext, useState } from "react";

const DateFormatContext = createContext({
  dateFormat: "Month D, Yr",
  setDateFormat: () => {},
});

export function DateFormatProvider({ children }) {
  const [dateFormat, setDateFormat] = useState("Month D, Yr");
  return (
    <DateFormatContext.Provider value={{ dateFormat, setDateFormat }}>
      {children}
    </DateFormatContext.Provider>
  );
}

export function useDateFormat() {
  return useContext(DateFormatContext);
}
