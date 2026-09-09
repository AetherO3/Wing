import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login.tsx'
import SignUp from './pages/SignUp/SignUp'
import { AuthProvider } from './context/AuthProvider'

function App() {
    return (
        <AuthProvider>
            <div className="app">
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp/>} />
                        <Route path="/" element={<Landing />} />
                    </Routes >
                </BrowserRouter >
            </div>
        </AuthProvider>
    )
}


export default App
