import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Create axios instance with default config
const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
    headers: {
        'Content-Type': 'application/json',
    }
});

interface AppContextType {
    user: any;
    setuser: (user: any) => void;
    showUserLogin: boolean;
    setShowUserLogin: (value: boolean) => void;
    showUserSignup: boolean;
    setShowUserSignup: (value: boolean) => void;
    navigate: ReturnType<typeof useNavigate>;
    toast: typeof toast;
    axios: typeof axiosInstance;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [user, setuser] = useState<any>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [showUserSignup, setShowUserSignup] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const value: AppContextType = {
        user,
        setuser,
        showUserLogin,
        setShowUserLogin,
        showUserSignup,
        setShowUserSignup,
        navigate,
        toast,
        axios: axiosInstance,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
