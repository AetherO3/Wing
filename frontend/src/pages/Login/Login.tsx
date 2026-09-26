import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import api from '../../api/api.ts'
import './login.css'

function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState(""); const { refreshUser } = useAuth();
    const nav = useNavigate();

    async function submit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            await api.post("/auth/login", {
                userName: username,
                password: password
            });

            await refreshUser();
            console.log("We're in");
            nav("/");
        }
        catch (error) {
            console.log(`Login failed because: ${error}`)
        }
    }

    return (
        <div className="form-page">
            <div className="form-card">
                <h2>Welcome back</h2>
                <p className="login-subtitle">Log in to join the debate!!</p>

                <form onSubmit={submit} className="form-fields">
                    <label htmlFor="username">
                        <input id="username" type="text" value={username} placeholder="Username" onChange={(e) => setUserName(e.target.value)} />
                    </label>
                    <label htmlFor="password">
                        <input id="password" type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <button type="submit" className="btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
