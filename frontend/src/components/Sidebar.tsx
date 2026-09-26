import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import group from "../assets/group.jpg"
import api from "../api/api"
import "./Sidebar.css"

type GroupType = {
    id: number;
    name: string;
};

function Sidebar() {
    const [groups, setGroups] = useState<GroupType[]>([]);
    const nav = useNavigate();

    useEffect(() => { api.get("/api/groups/joinedGroups").then((response) => setGroups(response.data)).catch((error) => console.log(`Error found ${error}`)); }, []);

    return (
        <div className="sidebar">
            {
                (!groups || groups.length == 0) ?
                    (<div  >
                        No Joined Groups
                        <div className="add-group-btn" onClick={() => nav("/group/create")}> Add New Group </div>
                    </div>)
                    :
                    (<div>
                        {groups.map((group) => (
                            <SideGroup name={group.name} id={group.id} key={group.id} />
                        )) }
                        <div className="add-group-btn" onClick={() => nav("/group/create")}> Add New Group </div>
                    </div>)
            }

        </div >
    );
}

function SideGroup({ name, id}: { name: string, id: number }) {
    const nav = useNavigate();
    const { id: activeId } = useParams();
    const isActive = activeId === String(id);

    return (
        <div className={`sidebar-group${isActive ? " active" : ""}`} onClick={() => nav(`/group/${id}`)}>
            <img src={group} className='group-logo' alt="profile picture." />
            <p>{name}</p>
        </div>
    )
}

export default Sidebar;
