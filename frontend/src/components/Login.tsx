import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider.tsx';
import api from '../api.ts'
import './login.css'

function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const { refreshUser } = useAuth();
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

    return (<>
        <form onSubmit={submit} className='login'>

            <label htmlFor="Username">
                <input type='text' value={username} placeholder='username' onChange={(e) => setUserName(e.target.value)} />
            </label>

            <label htmlFor="Password">
                <input type='password' value={password} placeholder='password' onChange={(e) => setPassword(e.target.value)} />
            </label>

            <button type='submit'>
                Login
            </button>

        </form>
    </>);
}

export default Login;
