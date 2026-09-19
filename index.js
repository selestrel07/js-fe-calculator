const operationLineElement = document.querySelector(
  '[data-display="operation"]'
);

const INITIAL_STATE = Object.freeze({
  leftOperand: "",
  rightOperand: "",
  operator: "",
  justEvaluated: false,
});

const MAX_DISPLAY_VALUE_LENGTH = 12;

const state = { ...INITIAL_STATE };
const currentValueElement = document.querySelector(
  '[data-display="current-value"]'
);

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new RangeError("Error: division by 0");
  return a / b;
}

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);

  if (operator === "add") return add(a, b);
  else if (operator === "subtract") return subtract(a, b);
  else if (operator === "multiply") return multiply(a, b);
  else if (operator === "divide") return divide(a, b);
}

const OPERATOR_SYMBOLS = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

function getOperationText() {
  if (state.leftOperand === "") return "";

  const symbol = OPERATOR_SYMBOLS[state.operator] || "";

  return [state.leftOperand, symbol, state.rightOperand]
    .filter((part) => part !== "")
    .join(" ");
}

function updateOperationLine(input) {
  operationLineElement.textContent = `${getOperationText()} ${
    input ? ` ${input}` : ""
  }`;
}

function getDisplayValue() {
  if (state.operator !== "" && state.rightOperand !== "")
    return state.rightOperand;
  return state.leftOperand || "0";
}

function clearCalculator() {
  resetState();
  updateDisplay("0");
  updateOperationLine();
}

function deleteLastEntry() {
  if (state.rightOperand !== "") {
    state.rightOperand = state.rightOperand.slice(0, -1);
  } else if (state.operator !== "") {
    state.operator = "";
  } else if (state.leftOperand.includes("e")) {
    state.leftOperand = "";
  } else {
    state.leftOperand = state.leftOperand.slice(0, -1);
  }

  state.justEvaluated = false;
  updateDisplay(getDisplayValue());
  updateOperationLine();
}

function handleOperator(operator) {
  if (state.leftOperand === "") {
    state.leftOperand = "0";
  }

  if (state.rightOperand !== "") {
    completeOperation();

    if (!state.justEvaluated) return;
  }

  state.leftOperand = normalizeNumber(state.leftOperand);
  updateDisplay(getDisplayValue());
  state.operator = operator;
  state.justEvaluated = false;
  updateOperationLine();
}

const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');
const operatorButtons = document.querySelectorAll("[data-operator]");

clearButton.addEventListener("click", clearCalculator);
backspaceButton.addEventListener("click", deleteLastEntry);

operatorButtons.forEach((button) => {
  button.addEventListener("click", () =>
    handleOperator(button.dataset.operator)
  );
});

function updateActiveOperand(input) {
  let value = state.operator ? state.rightOperand : state.leftOperand;
  if (value.length >= MAX_DISPLAY_VALUE_LENGTH) return value;
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

function fitDisplay() {
  let fontSize = 40;

  currentValueElement.style.fontSize = `${fontSize}px`;

  const display = currentValueElement.parentElement;
  const styles = getComputedStyle(display);
  const available =
    display.clientWidth -
    parseFloat(styles.paddingLeft) -
    parseFloat(styles.paddingRight);

  while (currentValueElement.scrollWidth > available && fontSize > 1) {
    fontSize--;
    currentValueElement.style.fontSize = `${fontSize}px`;
  }
}

function updateDisplay(value) {
  currentValueElement.textContent = value;
  fitDisplay();
}

function showErrorMessage(message) {
  updateDisplay(message);
}

function roundNumber(number) {
  const numberString = String(number);
  return numberString.length > MAX_DISPLAY_VALUE_LENGTH
    ? normalizeNumber(
        String((+numberString).toPrecision(MAX_DISPLAY_VALUE_LENGTH))
      )
    : numberString;
}

const KEY_BUTTONS = {
  "+": document.querySelector('[data-operator="add"]'),
  "-": document.querySelector('[data-operator="subtract"]'),
  "*": document.querySelector('[data-operator="multiply"]'),
  "/": document.querySelector('[data-operator="divide"]'),
  ".": document.querySelector('[data-action="decimal"]'),
  "=": document.querySelector('[data-action="equals"]'),
  Enter: document.querySelector('[data-action="equals"]'),
  Backspace: backspaceButton,
  Delete: clearButton,
  Escape: clearButton,
};

document.querySelectorAll("[data-digit]").forEach((button) => {
  KEY_BUTTONS[button.dataset.digit] = button;
});

document.addEventListener("keydown", (event) => {
  const button = KEY_BUTTONS[event.key];
  if (!button) return;

  event.preventDefault();
  button.click();
});

function completeOperation(event) {
  if (state.operator && state.rightOperand !== "") {
    state.rightOperand = normalizeNumber(state.rightOperand);
    updateDisplay(getDisplayValue());
    updateOperationLine();
    try {
      const result = operate(
        state.operator,
        state.leftOperand,
        state.rightOperand
      );
      if (event) updateOperationLine(event.target.textContent);
      resetState();
      state.leftOperand = roundNumber(result);
      state.justEvaluated = true;
      updateDisplay(getDisplayValue());
    } catch (error) {
      updateDisplay(error.message);
      resetState();
    }
  }
}

KEY_BUTTONS["="].addEventListener("click", completeOperation);

function normalizeNumber(numberString) {
  return numberString
    .replace(/(\.\d*?[1-9])0+$|\.0*$|\.?$/, "$1")
    .replace(/0+e/, "e");
}
