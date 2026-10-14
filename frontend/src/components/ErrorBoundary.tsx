import React from 'react'
import { useLocation } from 'react-router-dom'

interface Props { children: React.ReactNode }
interface State { error: Error | null }

// A lazy chunk that 404s after a new deploy ("Failed to fetch dynamically
// imported module") is fixed by a reload, not by retrying the render.
const isChunkError = (e: Error | null) =>
  !!e && /dynamically imported module|Loading chunk|Importing a module script failed/i.test(e.message)

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  private reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const chunk = isChunkError(error)
    return (
      <div role="alert" style={{ maxWidth: 520, margin: '12vh auto', padding: 28, textAlign: 'center', background: 'var(--color-surface, #fff)', border: '1px solid var(--color-border, #e2e8f0)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,.06)' }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>
          {chunk ? 'ມີເວີຊັນໃໝ່ຂອງລະບົບ' : 'ເກີດຂໍ້ຜິດພາດໃນການສະແດງໜ້ານີ້'}
        </h2>
        <p style={{ color: 'var(--color-text-secondary, #475569)', marginBottom: 20 }}>
          {chunk
            ? 'ກະລຸນາໂຫຼດໜ້າໃໝ່ເພື່ອອັບເດດ.'
            : 'ຂໍ້ມູນຂອງທ່ານບໍ່ໄດ້ຮັບຜົນກະທົບ. ລອງໃໝ່ ຫຼື ກັບໄປໜ້າຫຼັກ.'}
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {!chunk && <button className="btn btn-ghost" onClick={this.reset}>ລອງໃໝ່</button>}
          <button className="btn btn-primary" onClick={() => window.location.reload()}>ໂຫຼດໜ້າໃໝ່</button>
          <a className="btn btn-ghost" href="/dashboard">ໜ້າຫຼັກ</a>
        </div>
        {import.meta.env.DEV && (
          <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap', fontSize: 11, marginTop: 20, color: 'var(--color-danger-700, #b91c1c)' }}>
            {error.stack ?? String(error)}
          </pre>
        )}
      </div>
    )
  }
}

/**
 * Per-page boundary: a crash inside one page keeps the sidebar/header alive,
 * and navigating elsewhere clears the error (keyed by pathname).
 */
export function RouteErrorBoundary({ children }: Props) {
  const { pathname } = useLocation()
  return <ErrorBoundary key={pathname}>{children}</ErrorBoundary>
}
