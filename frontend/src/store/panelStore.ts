import { create } from 'zustand'

const KEY = 'dk-right-panel'

function read(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'closed'
  } catch {
    return true
  }
}

interface PanelStore {
  open: boolean
  toggle: () => void
}

/** Whether the right-hand widget column is shown (large screens only). */
export const usePanelStore = create<PanelStore>((set, get) => ({
  open: read(),
  toggle: () => {
    const next = !get().open
    try {
      localStorage.setItem(KEY, next ? 'open' : 'closed')
    } catch {
      // Not saved when storage is blocked; the toggle still works for this visit.
    }
    set({ open: next })
  },
}))
