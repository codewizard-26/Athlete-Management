import React, { createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem("app_theme") || "dark";
    });

    useEffect(() => {
        if (themeMode === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.setAttribute("data-theme", "light");
        }
        localStorage.setItem("app_theme", themeMode);
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const antdTheme = {
        algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: themeMode === "dark" ? "#FFFFFF" : "#111827",
            colorBgLayout: "transparent",
            colorBgContainer: themeMode === "dark" ? "#111827" : "#FFFFFF",
            colorBorder: themeMode === "dark" ? "#1F2937" : "#E5E7EB",
            colorText: themeMode === "dark" ? "#F9FAFB" : "#111827",
            colorTextSecondary: themeMode === "dark" ? "#D1D5DB" : "#374151",
            colorTextDescription: themeMode === "dark" ? "#9CA3AF" : "#4B5563",
        },
    };

    return (
        <ThemeContext.Provider value={{ themeMode, toggleTheme, setThemeMode, antdTheme }}>
            <ConfigProvider theme={antdTheme}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        return {
            themeMode: "dark",
            toggleTheme: () => {},
            setThemeMode: () => {},
            antdTheme: {}
        };
    }
    return context;
};
