import './App.css'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Group from './pages/Group/Group'
import CreateGroup from './pages/CreateGroup/CreateGroup'
import EditGroup from './pages/EditGroup/EditGroup'
import EditUser from './pages/EditUser/EditUser'
import { Replies } from './pages/Replies/Replies'
import { AuthProvider } from './context/AuthProvider'
import { RequireAuth } from './components/RequireAuth'
import { Home } from './pages/Home/Home'

function GroupRoute(){
    const {id} = useParams();
    return <Group key={id} />;
}

function App() {
    return (
        <AuthProvider>
            <div className="app">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Landing />} >
                            <Route index element={<Home />} />
                            <Route element={<RequireAuth />} >
                                <Route path="/group/:id" element={<GroupRoute/>} />
                                <Route path="/group/create" element={<CreateGroup />} />
                                <Route path="/group/edit/:id" element={<EditGroup />} />
                                <Route path="/group/replies/:id" element={<Replies />} />
                                <Route path="/user/edit" element={<EditUser />} />
                            </Route>
                        </Route>
                    </Routes >
                </BrowserRouter >
            </div>
        </AuthProvider>
    )
}


export default App
