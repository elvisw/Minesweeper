import { type GameState } from '../core/types'
import { createCellElement } from './cell-renderer'
import { calculateAdjacentMines } from '../core/number-calculator'
import styles from '../assets/grid.module.css'

export function renderGrid(
  container: HTMLElement,
  state: GameState,
  mineGrid: boolean[][] | null
): HTMLDivElement {
  container.replaceChildren() // clear previous grid

  const gridEl = document.createElement('div')
  gridEl.classList.add(styles.grid)
  gridEl.style.gridTemplateColumns = `repeat(${state.cols}, 24px)`
  gridEl.style.gridTemplateRows = `repeat(${state.rows}, 24px)`

  const numbers = mineGrid ? calculateAdjacentMines(mineGrid) : null

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const cell = state.grid[r][c]
      const adjacentMines = numbers ? numbers[r][c] : 0
      const cellEl = createCellElement(cell, adjacentMines)
      cellEl.dataset.row = String(r)
      cellEl.dataset.col = String(c)
      gridEl.appendChild(cellEl)
    }
  }

  container.appendChild(gridEl)
  return gridEl
}

/**
 * Update only changed cells (efficient incremental update)
 */
export function updateGridCell(
  gridEl: HTMLElement,
  row: number,
  col: number,
  state: GameState,
  mineGrid: boolean[][] | null
): void {
  const cells = gridEl.children
  const index = row * state.cols + col
  if (index >= cells.length) return

  const cell = state.grid[row][col]
  const numbers = mineGrid ? calculateAdjacentMines(mineGrid) : null
  const adjacentMines = numbers ? numbers[row][col] : 0

  const newEl = createCellElement(cell, adjacentMines)
  newEl.dataset.row = String(row)
  newEl.dataset.col = String(col)

  gridEl.replaceChild(newEl, cells[index])
}
