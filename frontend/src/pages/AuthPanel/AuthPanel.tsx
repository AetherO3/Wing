import { useState, type SubmitEvent } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import api from '../../api/api';
import './AuthPanel.css';

type Tab = "login" | "signup";

export function AuthPanel() {
    const [tab, setTab] = useState<Tab>("login");

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-tabs">
                    <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}> Login </button >
                    <button className={`auth-tab${tab === "signup" ? " active" : ""}`} onClick={() => setTab("signup")}> Sign-Up </button >
                </div>
                <div className={`auth-inner${tab === "signup" ? " signup-active" : ""}`}>
                    {tab === "login" ? <LoginForm /> : <SignUpForm onDone={() => setTab("login")} />}
                </div>
            </div >
        </div >
    );
}

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { refreshUser } = useAuth();
    const nav = useNavigate();

    async function submit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            await api.post("/auth/login", { userName: username, password: password });
            await refreshUser();
            nav("/");
        } catch (error) {
            setError("Login failed, check your username and password");
            console.log(`Login failed because: ${error}`);
        }
    }

    return (
        <form onSubmit={submit} className="auth-fields">
            <input type="text" placeholder="UserName" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="formError">{error}</p>}
            <button type="submit" className="btn-primary">Login</button>
        </form>
    );
}

function SignUpForm({ onDone }: { onDone: () => void }) {
    const [userName, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [error, setError] = useState("");

    async function submit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password !== rePassword) {
            setError("The passwords don't match");
            return;
        }
        setError("");

        try {
            await api.post("/api/users", { userName: userName, password: password, email: email });
            onDone();
        } catch (error) {
            setError("Sign-up failed, try a different username/email");
            console.log(`Error : ${error}`);
        }
    }

    return (
        <form onSubmit={submit} className="auth-fields">
            <input type="text" placeholder="UserName" value={userName} onChange={(e) => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" placeholder="Re-enter Password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} required />
            {error && <p className="formError">{error}</p>}
            <button type="submit" className="btn-primary">Submit</button>
        </form>
    );
}
