import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"
import api from "../../api/api.ts";

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
        <div className="form-page">
            <div className="form-card">
                <h2>Create an account</h2>

                <form onSubmit={submit} className="form-fields">
                    <label>
                        Username
                        <input type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} required />
                    </label>

                    <label>
                        Email
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>

                    <label>
                        Password
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>

                    <label>
                        Confirm password
                        <input type="password" placeholder="Re-enter the password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} required />
                    </label>

                    {error && <p className="formError">{error}</p>}

                    <button type="submit" className="btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
