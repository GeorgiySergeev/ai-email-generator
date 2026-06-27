import '@testing-library/jest-dom'
import { beforeEach } from 'bun:test'
import { Window } from 'happy-dom'

// Clear rendered components between tests without destroying the happy-dom document reference
beforeEach(() => {
  document.body.innerHTML = ''
})

const window = new Window()

// @ts-expect-error happy-dom globals not in Node types
globalThis.document = window.document
// @ts-expect-error happy-dom globals not in Node types
globalThis.window = window
// @ts-expect-error happy-dom globals not in Node types
globalThis.navigator = window.navigator
// @ts-expect-error happy-dom globals not in Node types
globalThis.HTMLElement = window.HTMLElement
// @ts-expect-error happy-dom globals not in Node types
globalThis.Element = window.Element
// @ts-expect-error happy-dom globals not in Node types
globalThis.Node = window.Node
// @ts-expect-error happy-dom globals not in Node types
globalThis.DocumentFragment = window.DocumentFragment
// @ts-expect-error happy-dom globals not in Node types
globalThis.MutationObserver = window.MutationObserver
