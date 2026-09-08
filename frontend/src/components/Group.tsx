import profile from "../assets/profile.jpg"
import "./Group.css"
import { useState, useEffect } from "react"
import { useAuth } from "./AuthProvider"
import api from '../api'

type Message = {
    id: number,
    message: string,
    authorId: number,
    authorName: string,
    stance: "PRO" | "AGAINST" | "NEUTRAL"
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


    return (
        <div className="group">

            <div className="group-header">

                <div className="group-header-img-and-title">
                    <img id="group-header-img" src={profile} alt="group picture" />
                    <p id="group-header-title"> {groupInfo?.name} </p>
                </div>

                <div id="group-header-buttons">
                    {isMember == false?
                        (<div onClick={joinGroup}> <Button text={"Join"} /> </div>)
                        :
                        (<>
                            <div onClick={leaveGroup}> <Button text={"Leave"} /> </div>
                            <div> <Button text={"Post"} /> </div>
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

        </div>
    )
}

function renderFor(fMessages: Message[]) {

    return (<div>
        {fMessages.map(message => (<div className="forTheNotion" key={message.id}>{message.message}</div>))}
    </div>);
}

function renderAgainst(aMessages: Message[]) {

    return (<div>
        {aMessages.map(message => (<div className="againstTheNotion" key={message.id}>{message.message}</div>))}
    </div>);
}

function Button({ text }: { text: string }) {

    return (
        <button >{text}</button>
    )

}

export default Group;
