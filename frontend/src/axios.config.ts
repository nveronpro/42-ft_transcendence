import axios from 'axios'

const initAxios = (): void => {
  // -----------------------------------------------------------------------------
  // Axios Config
  // -----------------------------------------------------------------------------

  // Url
  axios.defaults.baseURL = 'http://localhost:8080'
  // HTTP Headers
  axios.defaults.headers.common = {
    'Content-Type': 'application/json',
  }
  // HTTP Options
  axios.defaults.withCredentials = true
}

export default initAxios