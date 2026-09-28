import { useNavigate, useParams } from "react-router-dom";
import group from "../assets/group.jpg"
import { useGroups } from "../context/GroupsProvider";
import "./Sidebar.css"

function Sidebar() {
    const {groups} = useGroups();
    const nav = useNavigate();

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
                        ))}
                        <div className="add-group-btn" onClick={() => nav("/group/create")}> Add New Group </div>
                    </div>)
            }

        </div >
    );
}

function SideGroup({ name, id }: { name: string, id: number }) {
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
