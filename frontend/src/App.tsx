import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing.tsx'
import Login from './components/Login.tsx'
import SignUp from './components/SignUp.tsx'
import { AuthProvider } from './components/AuthProvider.tsx'

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
