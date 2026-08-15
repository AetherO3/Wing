import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.ts'

function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    async function submit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            await api.post("/auth/login", {
                userName: username,
                password: password
            });

            console.log("We're in");
            nav("/");
        }
        catch (error) {
            console.log(`Login failed because: ${error}`)
        }
    }

    return (<>
        <form onSubmit={submit}>

            <label htmlFor="Username">
                <input type='text' value={username} placeholder='username' onChange={(e) => setUserName(e.target.value)} />
            </label>

            <label htmlFor="Password">
                <input type='text' value={password} placeholder='password' onChange={(e) => setPassword(e.target.value)} />
            </label>

            <button type='submit'>
                Login
            </button>

        </form>
    </>);
}

export default Login;
