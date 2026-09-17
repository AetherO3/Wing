import api from "../../api/api";
import { useState } from "react";
import "./CreateGroup.css"

function CreateGroup({ creation, group }: { creation: (value: boolean) => void, group: (id: number) => void }) {
    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [error, setError] = useState("");


    async function createGroup() {
        try {
            const response = await api.post("api/groups/create", {
                name: groupName,
                topic: groupDesc
            });

            if (response.status == 200) {
                const { id } = response.data;
                group(id);
                creation(false);
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
        <div className="createGroup">
            <h3 className="formHeader">CREATE GROUP</h3>

            <br />

            <div className="body">
                <div className="inputs">
                    <label>Name: <input type="text" placeholder="Group Name." onChange={(e) => setGroupName(e.target.value)} /> </label>

                    <label> Topic: <input type="text" placeholder="Group Desc....." onChange={(e) => setGroupDesc(e.target.value)} /> </label>
                </div>

                <div className="buttons">
                    <button onClick={createGroup}>CREATE</button>
                    <button onClick={() => creation(false)}>CANCEL</button>
                </div>

                {showErrorMessage && <div> There was some issue ${error}</div>}
            </div>

        </div>
    );

}


export default CreateGroup;
