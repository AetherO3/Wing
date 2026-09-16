import api from "../../api/api";
import { useState } from "react";

function EditGroup({ id, edit }: { id: number, edit: (value: boolean) => void }) {
    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [error, setError] = useState("");


    async function updateGroup() {
        try {
            const response = await api.post(`api/groups/update/${id}`, {
                name: groupName,
                topic: groupDesc
            });

            if (response.status == 200) {
                edit(false);
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
            api.delete(`/api/groups/delete/${id}`)
            edit(false);
        } catch (error) {
            console.log(`Error occured ${error}`);
        }
    }

    return (
        <div className="createGroup">
            <h3 className="header">CREATE GROUP</h3>

            <br />

            <div className="body">
                <div className="inputs">
                    <label>Name: <input value={groupName} type="text" placeholder="Group Name." onChange={(e) => setGroupName(e.target.value)} /> </label>

                    <label> Topic: <input value={groupDesc} type="text" placeholder="Group Desc....." onChange={(e) => setGroupDesc(e.target.value)} /> </label>
                </div>

                <div className="buttons">
                    <button onClick={updateGroup}>UPDATE</button>
                    <button onClick={() => edit(false)}>CANCEL</button>
                    <button onClick={()=>setShowDeleteConfirmation(true)}>DELETE</button>
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

