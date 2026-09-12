import { useEffect, useState, useRef } from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthProvider';

import './MessageCard.css';

type MessageCardProp = {
    id: number;
    message: string;
    author: string;
    stance: "PRO" | "AGAINST" | "NEUTRAL";
    edited: boolean;
    authorId: number;
};

function MessageCard({ message, stance, id, author, edited, authorId }: MessageCardProp) {
    const { user } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [agreeCount, setAgreeCount] = useState(0);
    const [disagreeCount, setDisagreeCount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(message);
    const [editText, setEditText] = useState(currentMessage);
    const menuRef = useRef<HTMLDivElement>(null);

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
    }

    async function addAgainst() {
        const response = await api.post(`/api/messagevote/addDisagree?messageId=${id}`);
        setAgreeCount(response.data.agreeCount);
        setDisagreeCount(response.data.disagreeCount);
    }

    async function saveEdit() {
        await api.post(`/api/messages/edit/message/${id}`, { newMessage: editText });
        setCurrentMessage(editText);
        setIsEditing(false);
    }

    return (
        <div className="message">

            <div className="messageHeader">

                <div> <p id="author">{author}</p> {edited ? <p>edited</p> : <></>} </div>

                {user?.id == authorId &&
                    <div ref={menuRef} className='menu-wrapper'>
                        <button id='threeDot' onClick={() => setShowMenu(prev => !prev)}> ⋮ </button>

                        {showMenu && (<div className='menu-dropdown'>
                            <button onClick={()=>setIsEditing(true)}>Edit message</button>
                            <button>Flip stance</button>
                            <button>Delete</button>

                        </div>)}

                    </div>}
            </div>
            <p className={stance.toLowerCase()}> {currentMessage} </p>

            <div id="count">
                <button onClick={addPro}> {agreeCount}-agreers </button>
                <button onClick={addAgainst}> {disagreeCount}-disagreers </button>
            </div>

            {isEditing && (
                <div className='modal-backdrop'>
                    <div className='message-window'>
                        <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                        <button onClick={saveEdit}> Save </button>
                        <button onClick={() => { setIsEditing(false); setEditText(message) }}>CANCEL</button>
                    </div>
                </div>

            )}


        </div>
    );
}


export default MessageCard;
