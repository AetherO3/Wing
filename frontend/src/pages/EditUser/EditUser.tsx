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
        <div className="form-page">
            <div className="form-card">
                <h2>Edit Profile</h2>

                <div className="form-fields">
                    <label>
                        Username
                        <input value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </label>
                    <label>
                        Email
                        <input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                </div>

                <div className="modalButtons">
                    <button className="btn-primary" onClick={() => editUser()}>Submit</button>
                    <button className="btn-secondary" onClick={() => nav(-1)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default EditUser;
