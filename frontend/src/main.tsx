import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { registerSW } from 'virtual:pwa-register'
import ThemeProvider from '@/providers/ThemeProvider'
import i18n from '@/i18n'
import './index.css'
import './styles/shared.css'
import './styles/marketplace.css'
import './styles/print.css'
import App from './App'

// autoUpdate: silently activates new service worker versions on navigation,
// no user prompt needed for this step of offline support.
registerSW({ immediate: true })

// Default staleTime of 30s means data fetched by a list page (e.g. Sales
// Orders) renders instantly from cache on remount within that window — no
// skeleton loader — while a background refetch quietly checks for updates.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      // Retry transient failures (network, timeout, 5xx) with backoff, but never
      // client errors (4xx): retrying a 401/403/404/422 cannot succeed.
      retry: (failureCount, error) => {
        const status = (error as { response?: { status?: number } }).response?.status
        if (status !== undefined && status >= 400 && status < 500) return false
        return failureCount < 2
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    },
    // Mutations are not retried: they may not be idempotent.
    mutations: { retry: false },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </I18nextProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
)
