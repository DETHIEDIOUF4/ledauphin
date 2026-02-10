import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { auth } = useAuth()
  if (!auth?.token) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default ProtectedRoute
