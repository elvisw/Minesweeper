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
import { recordGame, getStats } from './storage/stats-store'
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

// ── Stats ──
const statsEl = document.createElement('div')
statsEl.style.cssText = 'font-size:11px;padding:4px 8px;color:#666;text-align:center;margin-top:6px'

function updateStats(won: boolean): void {
  recordGame(won, state.elapsedSeconds)
  const s = getStats()
  const rate = s.gamesPlayed > 0 ? Math.round((s.gamesWon / s.gamesPlayed) * 100) : 0
  statsEl.textContent = `总局: ${s.gamesPlayed} | 胜: ${s.gamesWon} (${rate}%) | 最佳: ${s.bestTime ?? '-'}s | 连胜: ${s.currentStreak}`
}

// Init stats display
;(function initStats() {
  const s = getStats()
  const rate = s.gamesPlayed > 0 ? Math.round((s.gamesWon / s.gamesPlayed) * 100) : 0
  statsEl.textContent = `总局: ${s.gamesPlayed} | 胜: ${s.gamesWon} (${rate}%) | 最佳: ${s.bestTime ?? '-'}s | 连胜: ${s.currentStreak}`
})()

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
    updateStats(false)
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
    updateStats(true)
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

  // ── Touch support ──
  let touchStartTime = 0
  let touchStartPos: { x: number; y: number } | null = null
  let lastTapTime = 0
  let lastTapCell: { row: number; col: number } | null = null

  gridContainer.addEventListener('touchstart', (e: TouchEvent) => {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    touchStartTime = Date.now()
    touchStartPos = { x: t.clientX, y: t.clientY }
  }, { passive: true })

  gridContainer.addEventListener('touchend', (e: TouchEvent) => {
    if (!touchStartPos) return
    e.preventDefault()
    const duration = Date.now() - touchStartTime
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStartPos.x
    const dy = t.clientY - touchStartPos.y
    const moved = Math.sqrt(dx * dx + dy * dy) > 10

    const cellEl = (document.elementFromPoint(t.clientX, t.clientY) as HTMLElement)
      ?.closest<HTMLElement>(`.${gridStyles.cell}`)
    if (!cellEl) { touchStartPos = null; return }

    const row = Number(cellEl.dataset.row)
    const col = Number(cellEl.dataset.col)
    const cell = state.grid[row]?.[col]

    if (!moved && duration < 400) {
      // Double-tap on revealed number → chord
      const now = Date.now()
      if (cell?.isRevealed && !cell.isMined &&
          lastTapCell?.row === row && lastTapCell?.col === col &&
          now - lastTapTime < 400) {
        chordReveal(row, col)
        lastTapCell = null
      } else {
        revealCell(row, col)
        lastTapTime = now
        lastTapCell = { row, col }
      }
    } else if (!moved && duration >= 500) {
      // Long press → flag
      toggleFlag(row, col)
    }
    touchStartPos = null
  })

  gridContainer.addEventListener('touchmove', () => {
    // Movement detected — cancel long press
  }, { passive: true })

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

// Custom difficulty controls
const customRow = document.createElement('div')
customRow.style.cssText = 'display:none;gap:4px;align-items:center;font-size:11px;padding:2px 8px'

const rowsInput = document.createElement('input')
rowsInput.type = 'number'; rowsInput.min = '5'; rowsInput.max = '30'; rowsInput.value = '16'
rowsInput.style.width = '46px'
const colsInput = document.createElement('input')
colsInput.type = 'number'; colsInput.min = '5'; colsInput.max = '40'; colsInput.value = '30'
colsInput.style.width = '46px'
const minesInput = document.createElement('input')
minesInput.type = 'number'; minesInput.min = '1'; minesInput.max = '999'; minesInput.value = '99'
minesInput.style.width = '46px'
const applyBtn = document.createElement('button')
applyBtn.textContent = '自定义'; applyBtn.style.cssText = 'font-size:11px'

applyBtn.addEventListener('click', () => {
  const rows = Math.max(5, Math.min(30, Number(rowsInput.value) || 16))
  const cols = Math.max(5, Math.min(40, Number(colsInput.value) || 30))
  const mines = Math.max(1, Math.min(rows * cols - 1, Number(minesInput.value) || 10))
  resetGame({ label: `${rows}×${cols}`, rows, cols, mines })
})

// Hide custom inputs when preset difficulty selected
diffBar.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => { customRow.style.display = 'none' })
})

// Add custom difficulty button
const customBtn = document.createElement('button')
customBtn.textContent = '自定义'
customBtn.className = 'difficulty-btn'
customBtn.addEventListener('click', () => {
  customRow.style.display = 'flex'
})
diffBar.appendChild(customBtn)

customRow.appendChild(document.createTextNode('行:'))
customRow.appendChild(rowsInput)
customRow.appendChild(document.createTextNode('列:'))
customRow.appendChild(colsInput)
customRow.appendChild(document.createTextNode('雷:'))
customRow.appendChild(minesInput)
customRow.appendChild(applyBtn)
container.appendChild(customRow)

const gridContainer = document.createElement('div')
container.appendChild(gridContainer)
container.appendChild(statsEl)

const versionEl = document.createElement('div')
versionEl.style.cssText = 'font-size:10px;color:#999;text-align:center;margin-top:4px'
versionEl.textContent = `v${__VERSION__} · ${__GIT_HASH__}`
container.appendChild(versionEl)

app.appendChild(container)

// ── Start ──
updateCounter(mineCounter, state.mineCount)
updateCounter(timerEl, 0)
renderGrid(gridContainer, state, null)
setupEvents()
