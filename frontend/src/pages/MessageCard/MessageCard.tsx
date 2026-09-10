import { useEffect, useState } from 'react';
import api from '../../api/api';

import './MessageCard.css';

type MessageCardProp = {
    id: number;
    message: string;
    author: string;
    stance: "PRO" | "AGAINST" | "NEUTRAL";
};

function MessageCard({ message, stance, id, author }: MessageCardProp) {

    const [agreeCount, setAgreeCount] = useState(0);
    const [disagreeCount, setDisagreeCount] = useState(0);

    useEffect(() => {
        async function getCounts() {
            const agreeResponse = await api.get( `/api/messagevote/agreers/${id}`);

            const disagreeResponse = await api.get( `/api/messagevote/disagreers/${id}`);

            setAgreeCount(agreeResponse.data);
            setDisagreeCount(disagreeResponse.data);
        }

        getCounts();

    }, [id]);

    async function addPro() {
        const response = await api.post( `/api/messagevote/addAgree?messageId=${id}`);
        setAgreeCount(response.data.agreeCount);
        setDisagreeCount(response.data.disagreeCount);
    }

    async function addAgainst() {
        const response = await api.post( `/api/messagevote/addDisagree?messageId=${id}`);
        setAgreeCount(response.data.agreeCount);
        setDisagreeCount(response.data.disagreeCount);
    }

    return (
        <div className="message">

            <p id="author">{author}</p>
            <p className={stance.toLowerCase()}> {message} </p>

            <div id="count">
                <button onClick={addPro}> {agreeCount}-agreers </button>
                <button onClick={addAgainst}> {disagreeCount}-disagreers </button>
            </div>

        </div>
    );
}

export default MessageCard;
