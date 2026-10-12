import { useAuth } from "../../context/useAuth";
import { AuthPanel } from "../AuthPanel/AuthPanel";

export function Home() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated)
        return <AuthPanel />;

    return (<></>);

}
