import { useAuth } from "./AuthProvider"
import Sidebar from "./Sidebar"
import Group from "./Group"
import "./Body.css"

function Body() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="body">
            <Sidebar />

            {isAuthenticated ? <Group/> : <div />}

        </div>
    )

}

export default Body;
