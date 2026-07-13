import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
    const [UserName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { LogIn } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        try {
            await LogIn(UserName, password);
            navigate("/");

        } catch {
            setError("Inavlid UserName or Password");
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>Log in</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
            />
            <button type="submit">Log in</button>
        </form>
    );
}
