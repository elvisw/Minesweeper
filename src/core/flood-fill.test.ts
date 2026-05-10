import { describe, it, expect } from 'vitest'
import { floodFill } from './flood-fill'

describe('floodFill', () => {
  it('should reveal only the start cell when it is non-zero', () => {
    // All cells have number 1 (non-zero), start at (0,0)
    const numbers = [
      [1, 1],
      [1, 1],
    ]
    const revealed = floodFill(numbers, 0, 0)
    expect(revealed[0][0]).toBe(true)
    expect(revealed[0][1]).toBe(false)
    expect(revealed[1][0]).toBe(false)
    expect(revealed[1][1]).toBe(false)
  })

  it('should reveal only the mine cell without expanding', () => {
    const numbers = [
      [-1, 1],
      [1, 1],
    ]
    const revealed = floodFill(numbers, 0, 0)
    expect(revealed[0][0]).toBe(true)
    expect(revealed[0][1]).toBe(false)
    expect(revealed[1][0]).toBe(false)
  })

  it('should flood fill through connected zeros', () => {
    // 3x3, all zeros in top row
    const numbers = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]
    const revealed = floodFill(numbers, 0, 0)
    // All zeros and the 1 should be revealed
    expect(revealed[0][0]).toBe(true)
    expect(revealed[0][1]).toBe(true)
    expect(revealed[0][2]).toBe(true)
    expect(revealed[1][0]).toBe(true)
    expect(revealed[1][1]).toBe(true) // non-zero but reachable
    expect(revealed[1][2]).toBe(true)
    expect(revealed[2][0]).toBe(true)
    expect(revealed[2][1]).toBe(true)
    expect(revealed[2][2]).toBe(true)
  })

  it('should stop at non-zero boundaries', () => {
    // Zeros in center, surrounded by 1s
    const numbers = [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ]
    const revealed = floodFill(numbers, 2, 2) // center
    // All zeros should be revealed
    for (let r = 1; r <= 3; r++) {
      for (let c = 1; c <= 3; c++) {
        expect(revealed[r][c]).toBe(true)
      }
    }
    // Surrounding 1s should be revealed (they're adjacent to zeros)
    expect(revealed[0][1]).toBe(true)
    expect(revealed[1][0]).toBe(true)
    // Corners are also adjacent to zeros (diagonal from 1,1)
    expect(revealed[0][0]).toBe(true)
    expect(revealed[4][4]).toBe(true)
  })

  it('should not stack overflow on large zero area', () => {
    const size = 50
    const numbers = Array.from({ length: size }, () => Array(size).fill(0))
    const revealed = floodFill(numbers, 0, 0)
    // Should complete without error
    let revealedCount = 0
    for (const row of revealed) {
      for (const cell of row) {
        if (cell) revealedCount++
      }
    }
    expect(revealedCount).toBe(size * size)
  })

  it('should not mutate the input', () => {
    const numbers = [
      [0, 0],
      [0, 0],
    ]
    const copy = numbers.map(row => [...row])
    floodFill(numbers, 0, 0)
    expect(numbers).toEqual(copy)
  })
})
