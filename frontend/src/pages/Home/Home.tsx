import { useAuth } from "../../context/AuthProvider";
import { AuthPanel } from "../AuthPanel/AuthPanel";

export function Home() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated)
        return <AuthPanel />;

    return (<></>);

}
