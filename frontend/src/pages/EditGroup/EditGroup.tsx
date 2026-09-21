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
        <div className="createGroup">
            <h3 className="formHeader">EDIT GROUP</h3>

            <br />

            <div className="body">
                <div className="inputs">
                    <label>Name: <input value={groupName} type="text" placeholder="Group Name." onChange={(e) => setGroupName(e.target.value)} /> </label>

                    <label> Topic: <input value={groupDesc} type="text" placeholder="Group Desc....." onChange={(e) => setGroupDesc(e.target.value)} /> </label>
                </div>

                <div className="buttons">
                    <button onClick={updateGroup}>UPDATE</button>
                    <button onClick={() => nav(`/group/${id}`)}>CANCEL</button>
                    <button onClick={() => setShowDeleteConfirmation(true)}>DELETE</button>
                </div>

                {showErrorMessage && <div> There was some issue ${error}</div>}

                {showDeleteConfirmation && (
                    <div className='modal-backdrop'>
                        <div className='message-window'>

                            <p>Delete Message?(This process is not reversible.)</p>

                            <br />

                            <button onClick={deleteGroup}>DELETE</button>
                            <button onClick={() => setShowDeleteConfirmation(false)}>CANCEL</button>

                        </div>
                    </div>

                )}
            </div>

        </div>
    );

}


export default EditGroup;

