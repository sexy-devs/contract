import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './features/auth/pages/Login';
import "./app/styles/style.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
