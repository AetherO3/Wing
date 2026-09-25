import { useEffect, useState, useRef } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

import './MessageCard.css';

type MessageCardProp = {
    id: number;
    message: string;
    author: string;
    stance: "PRO" | "AGAINST" | "NEUTRAL";
    edited: boolean;
    authorId: number;
    noOfReplies: number;
    onStanceChange: (id: number, newStance: "PRO" | "AGAINST") => void;
    onDelete: (id: number) => void;
};

function MessageCard({ message, stance, id, author, edited, authorId, noOfReplies, onStanceChange, onDelete }: MessageCardProp) {
    const { user } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [agreeCount, setAgreeCount] = useState(0);
    const [disagreeCount, setDisagreeCount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(message);
    const [isItEdited, setIsItEdited] = useState(edited);
    const [editText, setEditText] = useState(currentMessage);
    const menuRef = useRef<HTMLDivElement>(null);
    const [currentStance, setCurrentStance] = useState(stance);
    const [myVote, setMyVote] = useState<"PRO" | "AGAINST" | null>(null);
    const nav = useNavigate();

    useEffect(() => {
        async function getMyVote() {
            const response = await api.get(`/api/messagevote/myVote/${id}`);
            setMyVote(response.data || null);
        }

        getMyVote();
    }, [id]);

    useEffect(() => {
        async function getCounts() {
            const agreeResponse = await api.get(`/api/messagevote/agreers/${id}`);

            const disagreeResponse = await api.get(`/api/messagevote/disagreers/${id}`);

            setAgreeCount(agreeResponse.data);
            setDisagreeCount(disagreeResponse.data);
        }

        getCounts();

    }, [id]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node))
                setShowMenu(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function addPro() {
        const response = await api.post(`/api/messagevote/addAgree?messageId=${id}`);
        setAgreeCount(response.data.agreeCount);
        setDisagreeCount(response.data.disagreeCount);
        setMyVote(prev => prev == "PRO" ? null : "PRO");
    }

    async function addAgainst() {
        const response = await api.post(`/api/messagevote/addDisagree?messageId=${id}`);
        setAgreeCount(response.data.agreeCount);
        setDisagreeCount(response.data.disagreeCount);
        setMyVote(prev => prev == "AGAINST" ? null : "AGAINST");
    }

    async function saveEdit() {
        await api.post(`/api/messages/edit/message/${id}`, { newMessage: editText });
        setCurrentMessage(editText);
        setIsItEdited(true);
        setIsEditing(false);
    }

    async function changeStance() {
        const newStance = currentStance == "PRO" ? "AGAINST" : "PRO";
        api.post(`/api/messages/edit/stance/${id}`, newStance, {
            headers: { "Content-Type": "plain/text" }
        });
        setCurrentStance(newStance);
        onStanceChange(id, newStance);
        setShowMenu(false);
    }

    async function deleteMessage() {
        setShowMenu(false);

        try {
            await api.delete(`/api/messages/${id}`);
            onDelete(id);
            setShowDeleteConfirmation(false);
        }

        catch (error) {
            console.log(`Failed to delete message: ${error}`);
        }
    }

    return (
        <div className="message">

            <div className="messageHeader">

                <div id="author"> {isItEdited ? <p>{user?.id != authorId ? author : "You"}-EDITED</p> : <p>{user?.id != authorId ? author : "You"}</p>} </div>

                {user?.id == authorId &&
                    <div ref={menuRef} className='menu-wrapper'>
                        <button id='threeDot' onClick={() => setShowMenu(prev => !prev)}> ⋮ </button>

                        {showMenu && (<div className='menu-dropdown'>
                            <button onClick={() => setIsEditing(true)}>Edit message</button>
                            <button onClick={changeStance}>Change stance</button>
                            <button onClick={() => setShowDeleteConfirmation(true)}>Delete</button>

                        </div>)}

                    </div>}
            </div>
            <p className={currentStance.toLowerCase()}> {currentMessage} </p>


            <div id="count">
                <button onClick={addPro} className={myVote === "PRO" ? "agree-selected" : ""}> {agreeCount} : agreement{agreeCount == 1 ? "" : "s"}</button>
                <button onClick={addAgainst} className={myVote === "AGAINST" ? "disagree-selected" : ""}> {disagreeCount} : disagreement{disagreeCount == 1 ? "" : "s"} </button>
                <button onClick={() => nav(`/group/replies/${id}`)}>{noOfReplies}    Replies</button>
            </div>


            {isEditing && (
                <div className='modal-backdrop'>
                    <div className='message-window'>
                        <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                        <button onClick={saveEdit}> Save </button>
                        <button onClick={() => { setIsEditing(false); setEditText(currentMessage) }}>CANCEL</button>
                    </div>
                </div>

            )
            }

            {
                showDeleteConfirmation && (
                    <div className='modal-backdrop'>
                        <div className='message-window'>

                            <p>Delete Message?(This process is not reversible.)</p>

                            <br />

                            <button onClick={deleteMessage}>DELETE</button>
                            <button onClick={() => setShowDeleteConfirmation(false)}>CANCEL</button>

                        </div>
                    </div>

                )
            }

        </div >
    );
}


export default MessageCard;
