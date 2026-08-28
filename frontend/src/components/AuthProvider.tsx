import { useEffect, useState, createContext, useContext, type ReactNode } from "react";
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
    setUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    async function refreshUser() {
        const response = await api.get('/api/users/me');
        setUser(response.data);
        setIsAuthenticated(true);
    }

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
                setIsAuthenticated,
                refreshUser,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined)
        throw new Error("useAuth must be used within AuthProvider");

    return context;
}

export { AuthContext, AuthProvider, useAuth };
