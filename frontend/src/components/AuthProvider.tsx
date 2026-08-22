import { useEffect, useState, createContext, type ReactNode } from "react";
import api from "../api.ts";

type User = {
    id: number;
    userName: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    setIsAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/users/me")
            .then((response) => {
                setUser(response.data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                setUser(null);
                setIsAuthenticated(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                setIsAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

