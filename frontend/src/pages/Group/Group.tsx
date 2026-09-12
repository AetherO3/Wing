import { useState, useEffect, type SubmitEvent } from "react"
import { useAuth } from "../../context/AuthProvider"
import "./Group.css"
import MessageCard from "../MessageCard/MessageCard.tsx"
import api from '../../api/api.ts'
import profile from "../../assets/profile.jpg"

type Stance = "PRO" | "AGAINST" | "NEUTRAL";

type Message = {
    id: number,
    agree: number,
    disagree: number,
    message: string,
    authorId: number,
    authorName: string,
    stance: Stance,
    edited: boolean
}
type GroupInfo = {
    id: number,
    name: string,
    topic: string,
    creatorId: number,
    creatorName: string
}

function Group({ id }: { id: number }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [stance, setStance] = useState<Stance>("PRO");
    const [showAddMessage, setShowAddMessage] = useState(false);
    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const [isMember, setIsMember] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        async function getMessages() {
            try {
                const response = await api.get(`/api/messages/group/${id}`);
                setMessages(response.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        getMessages();

    }, [id]);


    useEffect(() => {
        async function getGroupInfo() {
            try {
                const response = await api.get(`/api/groups/${id}`);
                setGroupInfo(response.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        getGroupInfo();

    }, [id]);

    useEffect(() => {
        async function checkMembership() {
            try {
                const response = await api.get(`/api/groups/joinedGroups`);

                setIsMember(
                    response.data.some((group: GroupInfo) => group.id === id)
                );
            }
            catch (error) {
                console.log(`An error occured : ${error}`)
            }
        }

        if (user?.id)
            checkMembership();
    }, [id, user?.id]);

    async function joinGroup() {
        if (!id)
            return;

        try {
            await api.post(`/api/groups/${id}/addMember`)
            setIsMember(true);
        }
        catch (error) {
            console.log(`Encountered an error : ${error}`)
        }
    }

    async function leaveGroup() {
        if (!id)
            return;

        try {
            await api.delete(`/api/groups/${id}/leaveGroup`)
            setIsMember(false);
        }
        catch (error) {
            console.log(`Encountered an error : ${error}`)
        }

    }


    function addMessage() {
        return (
            <form onSubmit={submit} className="postForm">
                <label htmlFor="Message" >
                    <input type="text" id='message' placeholder="add message...." onChange={(e) => setMessage(e.target.value)} />
                </label>
                <div id="radioBtns">
                    <div>
                        <input type="radio" name="agreeOrNot" value="PRO" onChange={() => setStance("PRO")} />
                        <label > agree</label>
                    </div>

                    <div>
                        <input type="radio" name="agreeOrNot" value="AGAINST" onChange={() => setStance("AGAINST")} />
                        <label > disagree</label>
                    </div>
                </div>

                <div className="addMessageButtons">
                    <button type="submit"> POST </button>

                    <button type="button" onClick={() => { setShowAddMessage(false) }}> CANCEL </button>
                </div>
            </form>
        );
    }

    async function submit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await api.post("/api/messages", {
                message: message,
                groupId: id,
                stance: stance,
                parentId: null
            });

            setMessages(prev => [...prev, response.data]);
            setMessage("");
            setStance("PRO");
            setShowAddMessage(false);

        }
        catch (error) {
            console.log(`Login failed because: ${error}`)
        }
    }



    return (
        <div className="group">

            <div className="group-header">

                <div className="group-header-img-and-title">
                    <img id="group-header-img" src={profile} alt="group picture" />
                    <p id="group-header-title"> {groupInfo?.name} </p>
                </div>

                <div id="group-header-buttons">
                    {isMember == false ?
                        (<div onClick={joinGroup} className="button"> <Button text={"Join"} /> </div>)
                        :
                        (<>
                            <div onClick={leaveGroup} className="button"> <Button text={"Leave"} /> </div>
                            <div onClick={() => setShowAddMessage(true)} className="button"> <Button text={"Post"} /> </div>
                        </>)
                    }
                </div>

            </div>

            <div className="discussion-area">

                <div className="agree">
                    <h2><u>Agree</u></h2>
                    <br />
                    {renderFor(messages.filter(message => message.stance === "PRO" || message.stance === "NEUTRAL"))}
                </div>

                <div className="divider"> </div>

                <div className="disagree">
                    <h2><u>Disagree</u></h2>
                    <br />
                    {renderAgainst(messages.filter(message => message.stance === "AGAINST"))}
                </div>

            </div>

            {showAddMessage && (
                <div className="modal-backdrop">
                    <div className="message-window">
                        {addMessage()}
                    </div>
                </div>
            )}

        </div>
    )
}

function renderFor(fMessages: Message[]) {

    return (<div>
        {fMessages.map(message => (<MessageCard key={message.id} message={message.message} stance={message.stance} id={message.id} author={message.authorName} edited={message.edited} authorId={message.authorId}/>))}
    </div>);
}

function renderAgainst(aMessages: Message[]) {

    return (<div>
        {aMessages.map(message => (<MessageCard key={message.id} message={message.message} stance={message.stance} id={message.id} author={message.authorName} edited={message.edited} authorId={message.authorId}/>))}
    </div>);
}

function Button({ text }: { text: string }) {

    return (
        <button >{text}</button>
    )

}

export default Group;
