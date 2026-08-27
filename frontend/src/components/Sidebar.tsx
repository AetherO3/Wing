import { useEffect, useState } from "react";
import group from "../assets/group.jpg"
import api from "../api"
import "./Sidebar.css"

type GroupType = {
    id: number;
    name: string;
};

function Sidebar() {
    const [groups, setGropus] = useState<GroupType[]>([]);

    useEffect(() => {
        api.get("/api/groups/joinedGroups").then((response) => setGropus(response.data)).catch((error) => console.log(`Error found ${error}`));
    }, []);

    if (!groups || groups.length == 0)
        return (
            <div className="sidebar" >
                No Joined Groups
            </div>
        )
    else
        return (
            <div className="sidebar">
                {groups.map((group) => (
                    <Group name={group.name} key={group.id} />
                ))}
            </div>
        )
}

function Group({ name }: { name: string }) {
    return (
        <div className="sidebar-group">
            <img src={group} className='group-logo' alt="profile picture." />
            <p>{name}</p>
        </div>
    )
}

export default Sidebar;
