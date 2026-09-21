import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import './EditUser.css'
import api from '../../api/api';

function EditUser() {
    const { user } = useAuth();
    const [userName, setUserName] = useState(user?.userName);
    const [email, setEmail] = useState(user?.email);
    const nav = useNavigate();

    async function editUser() {
        if (user?.id == null) {
            nav(-1);
        }
        else {
            try {
                api.put(`/api/users/update/${user.id}`, {
                    userName: userName,
                    email: email
                })
                nav(-1);
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
                <button className='button' onClick={() => nav(-1)}> cancel </button >
            </div >

        </div>
    );
} 

export default EditUser;
