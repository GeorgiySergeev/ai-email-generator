import { describe, it } from 'bun:test'
import type { ActionResult } from '@/types'

// Type-only compilation tests — if this file compiles, types are correct
describe('types', () => {
  it('ActionResult success variant', () => {
    const r: ActionResult<string> = { success: true, data: 'ok' }
    void r
  })
  it('ActionResult failure variant', () => {
    const r: ActionResult = { success: false, error: 'oops', code: 'SERVER_ERROR' }
    void r
  })
})
