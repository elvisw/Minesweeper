import {
  BEGINNER, GamePhase, type DifficultyConfig,
  type GameState, type CellState,
} from './core/types'
import { createInitialState } from './state/game-state'
import { startGame, winGame, loseGame } from './state/state-machine'
import { generateMines } from './core/mine-generator'
import { floodFill } from './core/flood-fill'
import { calculateAdjacentMines } from './core/number-calculator'
import { checkWin, isGameOver } from './core/win-detector'
import { renderGrid, updateGridCell } from './ui/grid-renderer'
import { createFaceButton, updateFaceButton } from './ui/face-button'
import { createCounter, updateCounter } from './ui/counter'
import { createDifficultyMenu } from './ui/difficulty-menu'
import './assets/variables.css'
import appStyles from './assets/main.module.css'
import gridStyles from './assets/grid.module.css'
import './style.css'

// ── State ──
let state: GameState = createInitialState(BEGINNER)
let currentConfig: DifficultyConfig = BEGINNER
let mineGrid: boolean[][] | null = null
let numberGrid: number[][] | null = null
let timerInterval: ReturnType<typeof setInterval> | null = null
let currentCellEl: HTMLElement | null = null

// ── DOM refs ──
const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Root element #app not found')

const mineCounter = createCounter()
const faceBtn = createFaceButton()
const timerEl = createCounter()

// ── Timer ──
function startTimer(): void {
  if (timerInterval) return
  timerInterval = setInterval(() => {
    state = { ...state, elapsedSeconds: state.elapsedSeconds + 1 }
    updateCounter(timerEl, state.elapsedSeconds)
  }, 1000)
}

function stopTimer(): void {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
}

// ── Game actions ──
function resetGame(config: DifficultyConfig): void {
  stopTimer()
  currentConfig = config
  state = createInitialState(config)
  mineGrid = null
  numberGrid = null
  updateCounter(mineCounter, state.mineCount)
  updateCounter(timerEl, 0)
  updateFaceButton(faceBtn, GamePhase.Idle)
  renderGrid(gridContainer, state, null)
}

function revealCell(row: number, col: number): void {
  if (isGameOver(state)) return

  const cell = state.grid[row][col]
  if (cell.isRevealed || cell.isFlagged) return

  // First click → generate mines
  if (state.phase === GamePhase.Idle) {
    const { grid, actualMineCount } = generateMines(
      state.rows, state.cols, state.mineCount, row, col
    )
    mineGrid = grid
    numberGrid = calculateAdjacentMines(mineGrid)
    // Mark mine cells in state grid
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        if (mineGrid[r][c]) {
          state.grid[r][c] = { ...state.grid[r][c], isMined: true }
        }
      }
    }
    state = { ...state, mineCount: actualMineCount }
    updateCounter(mineCounter, state.mineCount)
    state = startGame(state)
    startTimer()
  }

  if (!mineGrid || !numberGrid) return

  // Check loss
  if (mineGrid[row][col]) {
    // Reveal all mines, mark wrong flags
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const cell = state.grid[r][c]
        if (mineGrid[r][c]) {
          state.grid[r][c] = { ...cell, isMined: true, isRevealed: true }
        } else if (cell.isFlagged && !mineGrid[r][c]) {
          // Wrong flag — show as mine with X
          state.grid[r][c] = { ...cell, isRevealed: true, isMined: false }
        }
      }
    }
    state = loseGame(state)
    stopTimer()
    updateFaceButton(faceBtn, GamePhase.Lost)
    renderGrid(gridContainer, state, mineGrid)
    return
  }

  // Reveal cell (flood fill if 0)
  if (numberGrid[row][col] === 0 && !cell.isMined) {
    const toReveal = floodFill(numberGrid, row, col)
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        if (toReveal[r][c]) {
          state.grid[r][c] = { ...state.grid[r][c], isRevealed: true }
        }
      }
    }
  } else {
    state.grid[row][col] = { ...state.grid[row][col], isRevealed: true }
  }

  // Check win
  if (checkWin(state.grid)) {
    state = winGame(state)
    stopTimer()
    updateFaceButton(faceBtn, GamePhase.Won)
    renderGrid(gridContainer, state, mineGrid)
    return
  }

  // Re-render
  renderGrid(gridContainer, state, mineGrid)
}

function toggleFlag(row: number, col: number): void {
  if (isGameOver(state)) return
  const cell = state.grid[row][col]
  if (cell.isRevealed) return

  let newCell: CellState
  if (!cell.isFlagged && !cell.isQuestion) {
    newCell = { ...cell, isFlagged: true, isQuestion: false }
  } else if (cell.isFlagged) {
    newCell = { ...cell, isFlagged: false, isQuestion: true }
  } else {
    newCell = { ...cell, isFlagged: false, isQuestion: false }
  }

  state.grid[row][col] = newCell
  state = {
    ...state,
    flagCount: state.flagCount + (newCell.isFlagged ? 1 : cell.isFlagged ? -1 : 0),
  }
  updateCounter(mineCounter, state.mineCount - state.flagCount)
  const gridEl = gridContainer.querySelector<HTMLElement>(`.${gridStyles.grid}`)
  if (gridEl) updateGridCell(gridEl, row, col, state, mineGrid)
}

function chordReveal(row: number, col: number): void {
  if (isGameOver(state)) return
  const cell = state.grid[row][col]
  if (!cell.isRevealed || !numberGrid) return

  // Count flags around
  let flagCount = 0
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = row + dr; const nc = col + dc
      if (nr >= 0 && nr < state.rows && nc >= 0 && nc < state.cols) {
        if (state.grid[nr][nc].isFlagged) flagCount++
      }
    }
  }

  if (flagCount !== numberGrid[row][col]) return

  // Reveal all unflagged, unrevealed neighbors
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = row + dr; const nc = col + dc
      if (nr >= 0 && nr < state.rows && nc >= 0 && nc < state.cols) {
        const neighbor = state.grid[nr][nc]
        if (!neighbor.isRevealed && !neighbor.isFlagged) {
          revealCell(nr, nc)
        }
      }
    }
  }
}

// ── Grid event binding (event delegation on gridContainer) ──
function setupEvents(): void {
  // Use mousedown for reliable multi-button (chord) detection
  gridContainer.addEventListener('mousedown', (e: MouseEvent) => {
    const cellEl = (e.target as HTMLElement).closest<HTMLElement>(`.${gridStyles.cell}`)
    if (!cellEl) return
    e.preventDefault()

    const bothDown = (e.buttons & 1) !== 0 && (e.buttons & 2) !== 0

    if (bothDown) {
      // Chord: both buttons pressed on a revealed number cell
      currentCellEl = null // cancel normal left-click
      const row = Number(cellEl.dataset.row)
      const col = Number(cellEl.dataset.col)
      chordReveal(row, col)
    } else if (e.button === 0) {
      // Left click: show pressed state, reveal on mouseup
      currentCellEl = cellEl
      cellEl.classList.add(gridStyles.pressed!)
    } else if (e.button === 2) {
      // Right click: toggle flag
      const row = Number(cellEl.dataset.row)
      const col = Number(cellEl.dataset.col)
      toggleFlag(row, col)
    }
  })

  gridContainer.addEventListener('mouseup', (e: MouseEvent) => {
    if (e.button === 0 && currentCellEl) {
      currentCellEl.classList.remove(gridStyles.pressed!)
      const row = Number(currentCellEl.dataset.row)
      const col = Number(currentCellEl.dataset.col)
      revealCell(row, col)
    }
    currentCellEl = null
  })

  gridContainer.addEventListener('mouseleave', () => {
    if (currentCellEl) {
      currentCellEl.classList.remove(gridStyles.pressed!)
      currentCellEl = null
    }
  })

  gridContainer.addEventListener('contextmenu', (e: Event) => {
    e.preventDefault()
  })

  // Face button
  faceBtn.onpointerdown = () => { faceBtn.textContent = '😮' }
  faceBtn.onpointerup = () => { resetGame(currentConfig) }
}

// ── Build UI ──
const container = document.createElement('div')
container.classList.add(appStyles.app!)

const header = document.createElement('div')
header.classList.add(appStyles.header!)
mineCounter.classList.add(appStyles.counter!)
faceBtn.classList.add(appStyles.faceButton!)
timerEl.classList.add(appStyles.counter!)
header.appendChild(mineCounter)
header.appendChild(faceBtn)
header.appendChild(timerEl)
container.appendChild(header)

const diffBar = createDifficultyMenu((config: DifficultyConfig) => resetGame(config))
diffBar.classList.add(appStyles.difficultyBar!)
container.appendChild(diffBar)

const gridContainer = document.createElement('div')
container.appendChild(gridContainer)

app.appendChild(container)

// ── Start ──
updateCounter(mineCounter, state.mineCount)
updateCounter(timerEl, 0)
renderGrid(gridContainer, state, null)
setupEvents()
