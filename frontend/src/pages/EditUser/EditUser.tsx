import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import './EditUser.css'
import api from '../../api/api';

function EditUser() {
    const { user, setIsAuthenticated, setUser} = useAuth();
    const [userName, setUserName] = useState(user?.userName);
    const [email, setEmail] = useState(user?.email);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [password, setPassword] = useState("");
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

    async function deleteUser() {
        try {
            await api.delete(`/api/users/${user?.id}`, { data: { password } });
            setUser(null);
            setIsAuthenticated(false);
            nav("/");

        } catch (error) {
            console.log(error);
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
                    <button className="btn-danger" onClick={() => setShowDeleteConfirmation(true)}>Delete</button>
                </div>
            </div>


            {showDeleteConfirmation && (
                <div className="modal-backdrop">
                    <div className="message-window deleteForm">
                        <p>Delete this User? This can't be undone.</p>

                        <input type='password' placeholder='Enter the password.' onChange={(e) => setPassword(e.target.value)} />

                        <div className="modalButtons">
                            <button className="btn-danger" onClick={deleteUser}>Delete</button>
                            <button className="btn-secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default EditUser;
