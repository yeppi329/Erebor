import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./fonts.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
export const BASE_URL = "http://localhost:8000"; //BaseURL 선언 
export const SERVER_URL = "http://192.168.50.240:5000"; //BaseURL 선언 
export const BaseUrlContext = React.createContext(BASE_URL);
export const ServerUrlContext = React.createContext(BASE_URL);

const root = ReactDOM.createRoot(document.getElementById("root"));
var link = window.location.href;
console.log(link);

root.render(
  <BrowserRouter>
  <BaseUrlContext.Provider value={BASE_URL}>
  <ServerUrlContext.Provider value={SERVER_URL}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    </ServerUrlContext.Provider>
    </BaseUrlContext.Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
