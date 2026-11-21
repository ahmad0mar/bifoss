import { useEffect } from 'react'

/**
 * Adds data-kb-nav="true" to <html> when the user navigates by keyboard (Tab),
 * and removes it on mouse interaction. Use this to show enhanced focus rings
 * only for keyboard users.
 */
export function useKeyboardNav() {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Tab') {
        document.documentElement.dataset.kbNav = 'true'
      }
    }
    const onMouse = () => {
      delete document.documentElement.dataset.kbNav
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onMouse)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onMouse)
    }
  }, [])
}
