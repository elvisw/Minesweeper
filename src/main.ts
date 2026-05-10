import { GamePhase, BEGINNER, type GameState } from './core/types'
import './style.css'

// 验证类型导入可用
const initialState: GameState = {
  phase: GamePhase.Idle,
  grid: [],
  rows: BEGINNER.rows,
  cols: BEGINNER.cols,
  mineCount: BEGINNER.mines,
  flagCount: 0,
  elapsedSeconds: 0,
  firstClickDone: false,
}

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Root element #app not found')

const container = document.createElement('div')

const h1 = document.createElement('h1')
h1.textContent = '扫雷'

const p = document.createElement('p')
p.textContent = `${initialState.rows}×${initialState.cols} | ${initialState.mineCount} 雷 | 状态: ${initialState.phase}`

container.appendChild(h1)
container.appendChild(p)
app.appendChild(container)
