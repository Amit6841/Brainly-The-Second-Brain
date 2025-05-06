import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Layout from './pages/Layout'
import Home from './pages/Home'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'
import { useEffect } from "react";


function App() {
  const {showUserLogin,showUserSignup} = useAppContext()

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (darkMode === "true" || (darkMode === null && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    {showUserLogin && <Login />}
    {showUserSignup && <Signup />}

      <Toaster />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="twitter" element={<Home filterType="Twitter" />} />
          <Route path="youtube" element={<Home filterType="Youtube" />} />
          <Route path="documents" element={<Home filterType="Document" />} />
          <Route path="instagram" element={<Home filterType="Instagram" />} />
          <Route path="spotify" element={<Home filterType="Spotify" />} />
          <Route path="linkedin" element={<Home filterType="Linkedin" />} />
        </Route>
       
      </Routes>
    </div>
  )
}

export default App
