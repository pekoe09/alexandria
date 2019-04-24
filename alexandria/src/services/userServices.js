import axios from 'axios'

const baseUrl = '/api/users'

const register = async (user) => {
  console.log('Registering (userServices.js)', user)
  const response = await axios.post(`${baseUrl}/register`, user)
  console.log('Received (userServices.js):', response.data)
  return response.data
}

const login = async (credentials) => {
  console.log('Login (userServices.js)', credentials)
  const response = await axios.post(`${baseUrl}/login`, credentials)
  if (response.data) {
    localStorage.setItem('alexandriauser', JSON.stringify(response.data))
  }
  console.log('Received (userServices.js):', response.data)
  return response.data
}

const logout = () => {
  localStorage.removeItem('alexandriauser')
}

export default {
  login,
  logout,
  register
}