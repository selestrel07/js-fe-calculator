const operationLineElement = document.querySelector('[data-display="operation"]')

const INITIAL_STATE = Object.freeze({
  leftOperand: "",
  rightOperand: "",
  operator: "",
  justEvaluated: false,
});

const MAX_DECIMAL_LENGTH = 6;

const state = { ...INITIAL_STATE };
const currentValueElement = document.querySelector(
  '[data-display="current-value"]'
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

  const symbol = OPERATOR_SYMBOLS[state.operator] || ''

  return [state.leftOperand, input, state.rightOperand]
    .filter((part) => part !== '')
    .join(' ')
}

function updateOperationLine() {
  operationLineElement.textContent = getOperationText()
}

function getDisplayValue() {
  if (state.operator !== '' && state.rightOperand !== '') return state.rightOperand
  return state.leftOperand || '0'
}

function clearCalculator() {
  resetState()
  updateDisplay('0')
  updateOperationLine()
}

function deleteLastEntry() {
  if (state.rightOperand !== '') {
    state.rightOperand = state.rightOperand.slice(0, -1)
  } else if (state.operator !== '') {
    state.operator = ''
  } else {
    state.leftOperand = state.leftOperand.slice(0, -1)
  }

  state.justEvaluated = false
  updateDisplay(getDisplayValue())
  updateOperationLine()
}

const clearButton = document.querySelector('[data-action="clear"]')
const backspaceButton = document.querySelector('[data-action="backspace"]')

clearButton.addEventListener('click', clearCalculator)
backspaceButton.addEventListener('click', deleteLastEntry)

function updateActiveOperand(input) {
  let value = state.operator ? state.rightOperand : state.leftOperand;
  switch (input) {
    case ".": {
      if (!value) value = "0.";
      if (value.indexOf(input) === -1) value += input;
      break;
    }
    case "0": {
      if (value !== "0") value += input;
      break;
    }
    default: {
      if (value !== "0") {
        value += input;
      } else {
        value = input;
      }
    }
  }
  if (state.operator) {
    state.rightOperand = value;
  } else {
    state.leftOperand = value;
  }
  return value;
}

function handleInputKey(event) {
  if (state.justEvaluated) resetState();
  updateDisplay(updateActiveOperand(event.target.textContent));
  updateOperationLine();
}

document
  .querySelectorAll("[data-digit]")
  .forEach((button) => button.addEventListener("click", handleInputKey));
document
  .querySelector('[data-action="decimal"]')
  .addEventListener("click", handleInputKey);

function resetState() {
  Object.assign(state, { ...INITIAL_STATE });
}

function updateDisplay(value) {
  currentValueElement.textContent = value;
}

function showErrorMessage(message) {
  updateDisplay(message);
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

const KEY_BUTTONS = {
  '+': document.querySelector('[data-operator="add"]'),
  '-': document.querySelector('[data-operator="subtract"]'),
  '*': document.querySelector('[data-operator="multiply"]'),
  '/': document.querySelector('[data-operator="divide"]'),
  '.': document.querySelector('[data-action="decimal"]'),
  '=': document.querySelector('[data-action="equals"]'),
  Enter: document.querySelector('[data-action="equals"]'),
  Backspace: backspaceButton,
  Delete: clearButton,
  Escape: clearButton
}

document.querySelectorAll('[data-digit]').forEach((button) => {
  KEY_BUTTONS[button.dataset.digit] = button
})

document.addEventListener('keydown', (event) => {
  const button = KEY_BUTTONS[event.key]
  if (!button) return

  event.preventDefault()
  button.click()
})
