import { BEGINNER } from './core/types'
import { createInitialState } from './state/game-state'
import './style.css'

const state = createInitialState(BEGINNER)

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Root element #app not found')

const container = document.createElement('div')

const h1 = document.createElement('h1')
h1.textContent = '扫雷'

const p = document.createElement('p')
p.textContent = `${state.rows}×${state.cols} | ${state.mineCount} 雷 | 状态: ${state.phase}`
p.setAttribute('data-phase', state.phase)

const p2 = document.createElement('p')
p2.textContent = `grid 尺寸: ${state.grid.length}×${state.grid[0].length} | firstClickDone: ${state.firstClickDone}`

container.appendChild(h1)
container.appendChild(p)
container.appendChild(p2)
app.appendChild(container)
