import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"
import api from "../api.ts";

function SignUp() {
    const nav = useNavigate();
    const [userName, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [error, setError] = useState("");

    async function submit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password != rePassword) {
            setError("The passwords don't match");
            console.log("The passwords don't match");
            return;
        }

        setError("");

        try {
            await api.post("/api/users", {
                userName: userName,
                password: password,
                email: email,
            });

            console.log("New User Created");

            nav("/login");
        }
        catch (error) {
            console.log(`Error : ${error}`);
        }
    }

    return (

        <div >

            <form onSubmit={submit} className="SignUp">

                <input type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} required/>

                <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

                <input type="password" placeholder="Password." value={password} onChange={(e) => setPassword(e.target.value)} required/>

                {error && <div>{error}</div>}
                <input type="password" placeholder="Re-enter the Password." value={rePassword} onChange={(e) => setRePassword(e.target.value)} required/>

                <button type="submit">
                    Submit
                </button>

            </form>

        </div>

    );
}

export default SignUp;
