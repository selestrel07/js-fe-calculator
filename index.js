const operationLineElement = document.querySelector('[data-display="operation"]')

const INITIAL_STATE = Object.freeze({
  leftOperand: "",
  rightOperand: "",
  operation: "",
  justEvaluated: false,
});

const MAX_DECIMAL_LENGTH = 6;

const state = { ...INITIAL_STATE };
const currentValueElement = document.querySelector(
  '[data-display="current-value"]'
);
const errorMessageElement = document.querySelector(
  '[data-display="error-message"]'
);

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

function resetState() {
  Object.assign(state, { ...INITIAL_STATE });
}

function updateDisplay(value) {
  currentValueElement.textContent = value;
}

function showErrorMessage(message) {
  errorMessageElement.textContent = message;
}

function clearErrorMessage() {
  showErrorMessage("");
}

function roundNumber(number) {
  const numberString = String(number);
  const dotIndex = numberString.indexOf(".");
  if (
    dotIndex !== -1 &&
    numberString.slice(dotIndex + 1).length > MAX_DECIMAL_LENGTH
  ) {
    return String(+number.toFixed(MAX_DECIMAL_LENGTH));
  }
  return numberString;
}
