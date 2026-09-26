import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CreateGroup() {
    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [error, setError] = useState("");
    const nav = useNavigate();


    async function createGroup() {
        try {
            const response = await api.post("api/groups/create", {
                name: groupName,
                topic: groupDesc
            });

            if (response.status == 200) {
                nav(`group/${response.data.id}`);
            }

            else {
                setError(response.statusText);
                setShowErrorMessage(true);
            }

        } catch (e) {
            console.log(`Error occured ${e}`);
        }
    }

    return (
        <div className="form-page">
            <div className="form-card">
                <h3>Create Group</h3>

                <div className="form-fields">
                    <label>
                        Name
                        <input type="text" placeholder="Group Name" onChange={(e) => setGroupName(e.target.value)} />
                    </label>
                    <label>
                        Topic
                        <input type="text" placeholder="Group Description" onChange={(e) => setGroupDesc(e.target.value)} />
                    </label>
                </div>

                <div className="modalButtons">
                    <button className="btn-primary" onClick={createGroup}>Create</button>
                    <button className="btn-secondary" onClick={() => nav(-1)}>Cancel</button>
                </div>

                {showErrorMessage && <p className="formError">There was some issue: {error}</p>}
            </div>
        </div>
    );
}

export default CreateGroup;
