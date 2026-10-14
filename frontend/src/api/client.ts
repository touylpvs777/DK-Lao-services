import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from '@/store/toastStore'

const baseURL = import.meta.env.VITE_API_BASE_URL as string

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Silent token refresh ────────────────────────────────────────────────
// One in-flight refresh is shared by every request that hits a 401 at the
// same time, so a burst of parallel calls does not rotate the token N times.
let refreshing: Promise<string> | null = null

function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return Promise.reject(new Error('no refresh token'))
  refreshing ??= axios
    .post(`${baseURL}/auth/refresh`, { refresh_token: refreshToken }, { timeout: 15_000 })
    .then((res) => {
      localStorage.setItem('access_token', res.data.access_token)
      if (res.data.refresh_token) localStorage.setItem('refresh_token', res.data.refresh_token)
      return res.data.access_token as string
    })
    .finally(() => { refreshing = null })
  return refreshing
}

function endSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  if (window.location.pathname !== '/login') window.location.href = '/login'
}

// ── Connectivity toast (deduped so a failing page does not spam) ────────
let lastNetworkToast = 0
function notifyNetworkProblem(err: AxiosError) {
  const now = Date.now()
  if (now - lastNetworkToast < 8_000) return
  lastNetworkToast = now
  toast.error(
    err.code === 'ECONNABORTED'
      ? 'ເຊີບເວີຕອບຊ້າເກີນໄປ, ກະລຸນາລອງໃໝ່'
      : 'ເຊື່ອມຕໍ່ເຊີບເວີບໍ່ໄດ້, ກວດສອບອິນເຕີເນັດ ແລ້ວລອງໃໝ່',
  )
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

client.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<{ detail?: unknown }>) => {
    const config = err.config as RetriableConfig | undefined
    const isAuthEndpoint = config?.url?.includes('/auth/')
    const status = err.response?.status
    const detail = err.response?.data?.detail

    // No response at all: network down, CORS, or timeout.
    if (!err.response) {
      if (err.code !== 'ERR_CANCELED') notifyNetworkProblem(err)
      return Promise.reject(err)
    }

    // 401 → missing / expired token (HTTPBearer + invalid JWT)
    // 403 "Not authenticated" → HTTPBearer raised 403 on some Starlette versions for absent header
    // 403 "Insufficient permissions" is a role/permission error — do NOT redirect; let the page handle it
    const isUnauthenticated =
      status === 401 ||
      (status === 403 && typeof detail === 'string' && detail === 'Not authenticated')

    if (isUnauthenticated && !isAuthEndpoint && config) {
      if (!config._retried) {
        config._retried = true
        try {
          const token = await refreshAccessToken()
          config.headers.Authorization = `Bearer ${token}`
          return client(config)
        } catch {
          /* refresh failed → fall through to sign-out */
        }
      }
      endSession()
    }
    return Promise.reject(err)
  }
)

export default client
