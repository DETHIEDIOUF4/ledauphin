import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post(`${API_URL}/auth/login`, form)
      login(res.data)
      if (res.data.user.role === 'gestionnaire') navigate('/gestion')
      else navigate('/caisse')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion')
    }
  }

  return (
    <div className="page login-page">
      <section className="login-section">
        <div className="login-box">
          <h1>Connexion</h1>
          <p className="login-subtitle">Espace gestionnaire & caisse</p>
          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
              />
            </label>
            <label>
              <span>Mot de passe</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </label>
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block">Se connecter</button>
          </form>
        </div>
      </section>
    </div>
  )
}
