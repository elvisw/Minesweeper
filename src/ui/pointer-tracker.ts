/**
 * Tracks mouse button state for chord detection.
 * bit 0 = left, bit 1 = right
 */
export class PointerTracker {
  private _buttons = 0

  get isLeftDown(): boolean {
    return (this._buttons & 1) !== 0
  }

  get isRightDown(): boolean {
    return (this._buttons & 2) !== 0
  }

  get isChord(): boolean {
    return this.isLeftDown && this.isRightDown
  }

  down(button: number): void {
    if (button === 0) this._buttons |= 1
    if (button === 2) this._buttons |= 2
  }

  up(button: number): void {
    if (button === 0) this._buttons &= ~1
    if (button === 2) this._buttons &= ~2
  }

  reset(): void {
    this._buttons = 0
  }
}
