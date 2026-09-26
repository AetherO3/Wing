import api from "../../api/api";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function EditGroup() {
    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [error, setError] = useState("");
    const { id: idParams } = useParams();
    const id = Number(idParams);
    const nav = useNavigate();

    useEffect(() => {
        async function getInitialData() {
            try {
                const response = await api.get(`/api/groups/${id}`);
                setGroupName(response.data.name);
                setGroupDesc(response.data.topic);
            } catch (e) {
                console.error(`Error fetching group: ${e}`);
            }
        }

        if (id) {
            getInitialData();
        }
    }, [id]);

    async function updateGroup() {
        try {
            const response = await api.patch(`/api/groups/update/${id}`, {
                name: groupName,
                topic: groupDesc
            });

            if (response.status == 200) {
                nav(`/group/${id}`);
            }

            else {
                setError(response.statusText);
                setShowErrorMessage(true);
            }

        } catch (e) {
            console.log(`Error occured ${e}`);
        }
    }

    async function deleteGroup() {
        try {
            await api.delete(`/api/groups/delete/${id}`)
            nav("/");
        } catch (error) {
            console.log(`Error occured ${error}`);
        }
    }

    return (
        <div className="form-page">
            <div className="form-card">
                <h3>Edit Group</h3>

                <div className="form-fields">
                    <label>
                        Name
                        <input value={groupName} type="text" placeholder="Group Name" onChange={(e) => setGroupName(e.target.value)} />
                    </label>
                    <label>
                        Topic
                        <input value={groupDesc} type="text" placeholder="Group Description" onChange={(e) => setGroupDesc(e.target.value)} />
                    </label>
                </div>

                <div className="modalButtons">
                    <button className="btn-primary" onClick={updateGroup}>Update</button>
                    <button className="btn-secondary" onClick={() => nav(`/group/${id}`)}>Cancel</button>
                    <button className="btn-danger" onClick={() => setShowDeleteConfirmation(true)}>Delete</button>
                </div>

                {showErrorMessage && <p className="formError">There was some issue: {error}</p>}
            </div>

            {showDeleteConfirmation && (
                <div className="modal-backdrop">
                    <div className="message-window deleteForm">
                        <p>Delete this group? This can't be undone.</p>
                        <div className="modalButtons">
                            <button className="btn-danger" onClick={deleteGroup}>Delete</button>
                            <button className="btn-secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default EditGroup;

