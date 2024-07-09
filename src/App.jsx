import './App.css'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

function App() {

  const { currUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currUser) {
      return <Navigate to='/login' />
    }
    return children
  };

  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
