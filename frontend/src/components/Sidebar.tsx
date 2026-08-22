import { useEffect, useState } from "react";
import profile from "../assets/profile.jpg"
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
            <img src={profile} className='header-logo' alt="profile picture." />
            <p>{name}</p>
        </div>
    )
}

export default Sidebar
