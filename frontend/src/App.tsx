import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Group from './pages/Group/Group'
import CreateGroup from './pages/CreateGroup/CreateGroup'
import EditGroup from './pages/EditGroup/EditGroup'
import EditUser from './pages/EditUser/EditUser'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import { Replies } from './pages/Replies/Replies'
import { AuthProvider } from './context/AuthProvider'

function App() {
    return (
        <AuthProvider>
            <div className="app">
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/" element={<Landing />} >
                            <Route path="/group/:id" element={<Group />} />
                            <Route path="/group/create" element={<CreateGroup />} />
                            <Route path="/group/edit/:id" element={<EditGroup />} />
                            <Route path="/group/replies/:id" element={<Replies />} />
                            <Route path="/user/edit" element={<EditUser />} />
                        </Route>
                    </Routes >
                </BrowserRouter >
            </div>
        </AuthProvider>
    )
}


export default App
