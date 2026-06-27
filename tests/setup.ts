import '@testing-library/jest-dom'
import { Window } from 'happy-dom'

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
