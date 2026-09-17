import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import './EditUser.css'
import api from '../../api/api';

export function EditUser({ editing }: { editing: (flag: boolean) => void }) {
    const { user } = useAuth();
    const [userName, setUserName] = useState(user?.userName);
    const [email, setEmail] = useState(user?.email);

    async function editUser() {
        if (user?.id == null) {
            editing(false);
        }
        else {
            try {
                api.put(`/api/users/update/${user.id}`, {
                    userName: userName,
                    email: email
                })
                editing(false);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="editUser">
            <h2>Edit User</h2>

            <br />

            < div className='inputs'>
                <label>UserName:<input value={userName} className='userInput' onChange={(e) => setUserName(e.target.value)} /></label>
                <label>Email:<input value={email} className='userInput' onChange={(e) => setEmail(e.target.value)} /></label>
            </div >

            < div className='buttons'>
                <button className='button' onClick={() => editUser()}> Submit </button >
                <button className='button' onClick={() => editing(false)}> cancel </button >
            </div >

        </div>
    );
} 
