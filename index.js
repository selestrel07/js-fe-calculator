const operationLineElement = document.querySelector('[data-display="operation"]')

function add(a, b) {
  return a + b
}

function subtract(a, b) {
  return a - b
}

function multiply(a, b) {
  return a * b
}

function divide(a, b) {
  if (b === 0) throw new RangeError("Error: You tried to divide a number by 0")
  return a / b
}

function operate(operator, a, b) {
  a = Number(a)
  b = Number(b)

  try {
    if (operator === 'add') return add(a, b)
    else if (operator === 'subtract') return subtract(a, b)
    else if (operator === 'multiply') return multiply(a, b)
    else if (operator === 'divide') return divide(a, b)

  } catch (error) {
    if (error) return null
    // Display an error message if operate() returns null
  }
}

const OPERATOR_SYMBOLS = {
  add: '+',
  subtract: '-',
  multiply: '*',
  divide: '/'
}

const KEY_SELECTORS = {
  '+': '[data-operator="add"]',
  '-': '[data-operator="subtract"]',
  '*': '[data-operator="multiply"]',
  '/': '[data-operator="divide"]',
  '.': '[data-action="decimal"]',
  '=': '[data-action="equals"]',
  Enter: '[data-action="equals"]',
  Backspace: '[data-action="backspace"]',
  Escape: '[data-action="clear"]'
}

function getOperationText() {
  if (state.leftOperand === '') return ''

  const symbol = OPERATOR_SYMBOLS[state.operation] || ''

  return [state.leftOperand, symbol, state.rightOperand]
    .filter((part) => part !== '')
    .join(' ')
}

function updateOperationLine() {
  operationLineElement.textContent = getOperationText()
}

function getDisplayValue() {
  if (state.operation !== '' && state.rightOperand !== '') return state.rightOperand
  return state.leftOperand || '0'
}

function clearCalculator() {
  resetState()
  clearErrorMessage()
  updateDisplay('0')
  updateOperationLine()
}

function deleteLastEntry() {
  if (state.rightOperand !== '') {
    state.rightOperand = state.rightOperand.slice(0, -1)
  } else if (state.operation !== '') {
    state.operation = ''
  } else {
    state.leftOperand = state.leftOperand.slice(0, -1)
  }

  state.justEvaluated = false
  clearErrorMessage()
  updateDisplay(getDisplayValue())
  updateOperationLine()
}

const clearButton = document.querySelector('[data-action="clear"]')
const backspaceButton = document.querySelector('[data-action="backspace"]')

clearButton.addEventListener('click', clearCalculator)
backspaceButton.addEventListener('click', deleteLastEntry)

function getButtonForKey(key) {
  if (key.length === 1 && key >= '0' && key <= '9') {
    return document.querySelector(`[data-digit="${key}"]`)
  }

  const selector = KEY_SELECTORS[key]

  if (!selector) {
    return null
  }

  return document.querySelector(selector)
}

document.addEventListener('keydown', (event) => {
  const button = getButtonForKey(event.key)
  if (!button) return

  event.preventDefault()
  button.click()
})