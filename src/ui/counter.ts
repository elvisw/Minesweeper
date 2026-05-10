/**
 * Create a 3-digit LED-style counter display.
 */
export function createCounter(): HTMLElement {
  const el = document.createElement('div')
  el.className = 'counter'
  el.textContent = '000'
  return el
}

/**
 * Update counter display with zero-padded value.
 */
export function updateCounter(el: HTMLElement, value: number): void {
  el.textContent = String(Math.max(0, Math.min(999, value))).padStart(3, '0')
}
