import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import appConfig from 'src/config/app'

export const useFetch = () => {
  const tokenJson = localStorage.getItem('token')
  const token = tokenJson ? JSON.parse(localStorage.getItem('token')) : null
  const navigate = useNavigate()

  const crxFetch = axios.create({
    baseURL: appConfig.DOMAINS,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  crxFetch.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        config.headers.version = '1.1.1'
      } else {
        navigate('/authentication/sign-in')
      }

      return config
    },
    (err) => Promise.reject(err)
  )

  crxFetch.interceptors.response.use(
    (res) => res.data,
    async (err) => {
      if (err.response.status === 401) {
        return navigate('/authentication/sign-in')
      }
      return Promise.reject(err)
    }
  )

  return crxFetch
}
