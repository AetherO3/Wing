import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";
import "./Replies.css"
import MessageCard from "../MessageCard/MessageCard";

type Stance = "PRO" | "AGAINST" | "NEUTRAL";

type Message = {
    id: number,
    agree: number,
    disagree: number,
    message: string,
    authorId: number,
    authorName: string,
    stance: Stance,
    edited: boolean,
    replyCount: number
}

export function Replies() {
    const [parentMessage, setParentMessage] = useState<Message | null>(null);
    const { id: idParams } = useParams();
    const id = Number(idParams);
    const nav = useNavigate();
    const [replies, setReplies] = useState<Message[]>([]);
    const [newReply, setNewReply] = useState("");
    const [stance, setStance] = useState("PRO");

    useEffect(() => {
        async function getMessage() {
            try {
                const response = await api.get(`/api/messages/${id}`);
                if (response.status == 200) {
                    setParentMessage(response.data);
                }
                else {
                    console.log(`Error in getting the message id : ${id}`);
                    nav(-1);
                }
            }

            catch (e) {
                console.log(`An Error occured : ${e}`);
                nav(-1);
            }
        }

        getMessage();
    }, [id]);


    useEffect(() => {
        if (!parentMessage?.id) return;

        async function getReplies() {
            const response = await api.get(`api/messages/replies/${parentMessage?.id}`);
            setReplies(response.data);
        }

        getReplies();
    }, [parentMessage?.id]);

    async function onDelete(id: number) {
        try {
            const response = await api.delete(`api/message/${id}`);
            if (response.status == 200)
                console.log("deleted");
            else
                console.log(`error ${response.statusText}`);
        }
        catch (error) {
            console.log(`Error occured : ${error}`);
        }
    }

    async function setChangeStance(id: number, newStance: "PRO" | "AGAINST") {
        try {
            api.post(`/api/messages/edit/stance/${id}`, newStance, {
                headers: { "Content-Type": "plain/text" }
            });

            setReplies(prev => prev?.map(m => m.id === id ? { ...m, stance: newStance } : m));

        } catch (error) {
            console.log(`Couldn't chane the stance for message id : ${id} with error ${error}`);
        }
    }

    async function addReply(newReply: string) {
        const groupId = await api.get(`/api/messages/groupid/${id}`);
        try {
            await api.post("/api/messages", {
                message: newReply,
                parentId: parentMessage?.id,
                groupId: groupId.data,
                stance: stance
            });
        } catch (error) {
            console.log(`An error occured ${error}`);
        }
    }

    return (<div className="repliesBody">
        <h3 className="parentMessage">{parentMessage?.message}</h3>
        <hr />
        <div>
            {
                replies?.map(
                    reply => (<MessageCard key={reply.id}
                        message={reply.message}
                        stance={reply.stance}
                        id={reply.id}
                        author={reply.authorName}
                        edited={reply.edited}
                        authorId={reply.authorId}
                        noOfReplies={reply.replyCount}
                        onStanceChange={setChangeStance}
                        onDelete={onDelete}
                    />
                    ))
            }
        </div>

        <div>
            <input placeholder="addReply" onChange={(e) => setNewReply(e.target.value)} />
            <input type="radio" name="agreeOrNot" value="PRO" onChange={() => setStance("PRO")} />
            <label > agree</label>
            <input type="radio" name="agreeOrNot" value="AGAINST" onChange={() => setStance("AGAINST")} />
            <label > disagree</label>
            <button onClick={() => addReply(newReply)}> Submit </button>
        </div>

    </div>);
}
