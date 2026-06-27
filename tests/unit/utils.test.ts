import { describe, it, expect } from 'bun:test'
import { cn, formatDate } from '@/lib/utils'

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })
  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })
  it('resolves tailwind conflicts (last wins)', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })
})

describe('formatDate()', () => {
  it('formats a date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('Jan')
    expect(result).toContain('2024')
  })
  it('accepts a Date object', () => {
    const result = formatDate(new Date('2024-06-26'))
    expect(result).toContain('2024')
  })
})
