import { type DifficultyConfig, BEGINNER, INTERMEDIATE, EXPERT } from '../core/types'

const DIFFICULTIES: DifficultyConfig[] = [BEGINNER, INTERMEDIATE, EXPERT]

export type DifficultyChangeHandler = (config: DifficultyConfig) => void

export function createDifficultyMenu(onChange: DifficultyChangeHandler): HTMLElement {
  const bar = document.createElement('div')
  bar.className = 'difficulty-bar'

  for (const diff of DIFFICULTIES) {
    const btn = document.createElement('button')
    btn.textContent = diff.label
    btn.className = 'difficulty-btn'
    btn.addEventListener('click', () => onChange(diff))
    bar.appendChild(btn)
  }

  return bar
}
