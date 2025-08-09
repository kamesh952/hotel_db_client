import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold text-gray-800">Hotel Management</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar