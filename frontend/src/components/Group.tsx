import profile from "../assets/profile.jpg"
import "./Group.css"
import { useState, useEffect } from "react"
import api from '../api'

type Message = {
    id: number,
    message: string,
    authorId: number,
    authorName: string,
    stance: "PRO" | "AGAINST" | "NEUTRAl"
}

function Group({ title = "Group Title", id }: { title?: string, id: number }) {
    const [messages, setMessages] = useState<Message[]>([]);

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


    return (
        <div className="group">

            <div className="group-header">

                <div className="group-header-img-and-title">
                    <img id="group-header-img" src={profile} alt="group picture" />
                    <p id="group-header-title"> {title} </p>
                </div>

                <div id="group-header-buttons">
                    <Button text={"Join"} />
                    <Button text={"Post"} />
                </div>

            </div>

            <div className="discussion-area">

                <div className="agree">
                    <h2><u>Agree</u></h2>
                    <br />
                    {renderFor(messages.filter(message => message.stance === "PRO" || message.stance === "NEUTRAl"))}
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
