import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth"

export function RequireAuth(){
    const {isAuthenticated, loading} = useAuth();

    if(loading) return null;

    if(!isAuthenticated)    return <Navigate to="/" replace />;

    return <Outlet />;
}
