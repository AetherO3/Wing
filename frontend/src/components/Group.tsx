import profile from "../assets/profile.jpg"
import "./Group.css"

function Group({ agreeTitle = "Agree", disagreeTitle = "Disagree"}: { agreeTitle?: string, disagreeTitle?: string }) {

    return (
        <div className="group">

            <div className="group-header">

                <div className="group-header-img-and-title">
                    <img id="group-header-img" src={profile} alt="group picture" />
                    <p id="group-header-title"> Group Title</p>
                </div>

                <div id="group-header-buttons">
                    <Button text={"Join"} />
                    <Button text={"Post"} />
                </div>

            </div>

            <div className="discussion-area">

                <div className="agree">
                    <h2><u>{agreeTitle}</u></h2>
                </div>

                <div className="divider"> </div>

                <div className="disagree">
                    <h2><u>{disagreeTitle}</u></h2>
                </div>

            </div>

        </div>
    )
}

function Button({ text }: { text: string }) {

    return (
        <button >{text}</button>
    )

}

export default Group;
