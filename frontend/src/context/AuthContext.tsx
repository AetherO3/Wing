import { useState, type ReactNode } from "react";
import api from "../api/client";
import { AuthContext } from "./auth-context";


export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    async function LogIn(userName: string, password: string) {
        await api.post("/auth/login", { userName, password });
        setIsAuthenticated(true);
    }

    async function LogOut() {
        await api.post("/auth/logout");
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, LogIn, LogOut }}>
            {children}
        </AuthContext.Provider>
    );
}
