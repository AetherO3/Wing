import "./CreateGroup.css"

function CreateGroup({ creation }: { creation: (value: boolean) => void }) {

    return (
        <div id="root">
            <h3 id="header">CREATE GROUP</h3>

            <br/>

            

            <div onClick={()=>creation(false)}>CANCEL</div>

        </div>
    );

}

export default CreateGroup;
