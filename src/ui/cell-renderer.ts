import { type CellState } from '../core/types'
import styles from '../assets/grid.module.css'

const NUMBER_CLASSES: Record<number, string> = {
  1: styles.num1!,
  2: styles.num2!,
  3: styles.num3!,
  4: styles.num4!,
  5: styles.num5!,
  6: styles.num6!,
  7: styles.num7!,
  8: styles.num8!,
}

export function createCellElement(
  cell: CellState,
  adjacentMines: number
): HTMLElement {
  const el = document.createElement('div')
  el.classList.add(styles.cell!)

  if (cell.isRevealed) {
    el.classList.add(styles.revealed!)
    if (cell.isFlagged && !cell.isMined) {
      // Wrong flag (loss only)
      const span = document.createElement('span')
      span.textContent = '❌'
      el.appendChild(span)
    } else if (cell.isMined) {
      el.classList.add(styles.mine!)
      const span = document.createElement('span')
      span.textContent = '💣'
      el.appendChild(span)
    } else if (adjacentMines > 0 && NUMBER_CLASSES[adjacentMines]) {
      el.classList.add(NUMBER_CLASSES[adjacentMines])
      el.textContent = String(adjacentMines)
    }
  } else {
    el.classList.add(styles.covered!)
    if (cell.isFlagged) {
      el.classList.add(styles.flagged!)
      const span = document.createElement('span')
      span.textContent = '🚩'
      el.appendChild(span)
    } else if (cell.isQuestion) {
      el.textContent = '?'
    }
  }

  return el
}
