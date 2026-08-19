import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.ts";

function Register() {
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const nav = useNavigate();

    async function submit(event: SubmitEvent<HTMLFormElement>){
        event.preventDefault();

        try{
            await api.post("/api/users", {
                userName: userName,
                password: password,
            });

            nav("/");
        }
        catch(error){
            console.log(`Error : ${error}`);
        }
    }

    return (

        <div className="Register">

            <form onSubmit={submit}>

                <input type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)}/>

                <input type="password" placeholder="Password." value={password} onChange={(e) => setPassword(e.target.value)}/>

                <input type="password" placeholder="Re-enter the Password." value={rePassword} onChange={(e) => setRePassword(e.target.value)}/>

                <button type="submit">
                Submit
                </button>

            </form>

        </div>

    );
}

export default Register;
