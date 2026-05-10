import { GamePhase } from '../core/types'

const FACE_MAP: Record<string, string> = {
  [GamePhase.Idle]: '🙂',
  [GamePhase.Playing]: '🙂',
  [GamePhase.Won]: '😎',
  [GamePhase.Lost]: '😵',
}

export function createFaceButton(): HTMLElement {
  const btn = document.createElement('button')
  btn.className = 'face-button'
  btn.textContent = FACE_MAP[GamePhase.Idle]
  btn.setAttribute('aria-label', 'Reset game')
  return btn
}

export function updateFaceButton(btn: HTMLElement, phase: GamePhase): void {
  btn.textContent = FACE_MAP[phase] || FACE_MAP[GamePhase.Idle]
}
