import { useAuth } from "./AuthProvider"
import { useState } from "react"
import Sidebar from "./Sidebar"
import Group from "./Group"
import "./Body.css"

function Body() {
    const { isAuthenticated } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

    return (
        <div className="body">
            {isAuthenticated && (<Sidebar setSelectedGroup={setSelectedGroup} />)}

            {isAuthenticated && selectedGroup != null ? < Group id={selectedGroup} /> : <div />}

        </div>
    )

}

export default Body;
