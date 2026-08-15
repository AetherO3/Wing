import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing.tsx'
import Login from './components/Login.tsx'

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Landing />} />
                </Routes >
            </BrowserRouter >
        </div>)
}


export default App
