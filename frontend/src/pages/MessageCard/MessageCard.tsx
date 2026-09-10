import './MessageCard.css'

type MessageCardProp = {
    id: number,
    agreers: number,
    disagreers: number,
    message: string,
    author: string
    stance: "PRO" | "AGAINST" | "NEUTRAL"
};

function MessageCard({ message, stance, id, author, agreers, disagreers }: MessageCardProp) {

    return (
        <div className='message'>

            <p id='author'>{author} </p>

            <p className={stance.toLowerCase()} key={id}> {message} </p>

            {/* <div> */}
            {/**/}
            {/*     <div id="agreers"> </div> */}
            {/**/}
            {/*     <div id="disagreers"> </div> */}
            {/**/}
            {/* </div> */}

            <div id="count">
                <button>{agreers}-agreers</button>
                <button>{disagreers}-disagreers</button>
            </div>
        </div>
    );
}

export default MessageCard;

