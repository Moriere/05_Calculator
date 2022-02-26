// OPERATOR FUNCTIONS

function add(num1, num2) {
    return num1 + num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    if (num2 === 0) return "Error";
    else return (num1 / num2);
}

function power(num1, num2) {
    return num1 ** num2;
}

function operate(operator, num1, num2) {
    switch(operator) {
        case "+":
            return add(num1, num2);
        case "-":
            return add(num1, -num2);
        case "*":
            return multiply(num1, num2);
        case "/":
            return divide(num1, num2);
        case "^":
            return power(num1, num2);
    }
}

// UI FUNCTIONS

function updateScreen(button) {
    if (button.target.id === 'decimal') {
        displayBuffer += ".";
        button.target.disabled = true;
    } else {
        displayBuffer += button.target.id;
    }
    screenBuffer.textContent = displayBuffer;
}

function eraseScreen() {
    if (screenBuffer.textContent === "Error") return;
    displayBuffer = displayBuffer.slice(0, displayBuffer.length - 1);
    screenBuffer.textContent = displayBuffer;
    if (!displayBuffer.includes(".")) keypadNumbers[10].disabled = false;
}

function operator (button) {
    if (!operatorIsSelected && operands.num1 === null) {
        selectOperator(button.target.id);

        operands.num1 = Number(displayBuffer);
        //if (displayBuffer = "") operands.num1 = 0;
        keypadNumbers[10].disabled = false;
        screenOperator.textContent = selectedOperator;
        displayBuffer = "";
        screenBuffer.textContent = displayBuffer;
    } else if (operatorIsSelected) {
        operands.num2 = Number(displayBuffer);
        operands.num1 = operate(selectedOperator, operands.num1, operands.num2);
        if (operands.num1 === "Error" || operands.num1 === NaN) {
            screenBuffer.textContent = "Error";
            keypadNumbers.forEach(button => button.disabled = true);
            keypadOperators.forEach(button => button.disabled = true);
            equalBtn.disabled = true;
            return;
        }
        operands.num2 = null;

        selectOperator(button.target.id);

        keypadNumbers[10].disabled = false;
        screenOperator.textContent = selectedOperator;
        displayBuffer = "";
        screenBuffer.textContent = operands.num1;
    } else if (!operatorIsSelected && operands.num1 !==null) {

        selectOperator(button.target.id);

        keypadNumbers[10].disabled = false;
        screenOperator.textContent = selectedOperator;
        displayBuffer = "";
        screenBuffer.textContent = operands.num1;
    }
}

function runOperation () {
    operands.num2 = Number(displayBuffer);
    if (operands.num2 !== null) {
        operands.num1 = operate(selectedOperator, operands.num1, operands.num2);

        if (operands.num1 === "Error" || operands.num1 === NaN) {
            screenBuffer.textContent = "Error";
            keypadNumbers.forEach(button => button.disabled = true);
            keypadOperators.forEach(button => button.disabled = true);
            equalBtn.disabled = true;
            return;
        }
        keypadNumbers[10].disabled = false
        operands.num2 = null;
        screenOperator.textContent = "=";
        operatorIsSelected = false;
        displayBuffer = "";
        screenBuffer.textContent = operands.num1;
    } else return;
}

function clearAll () {
    for (let key in operands) {
        operands[key] = null;
    }
    displayBuffer = "";
    screenBuffer.textContent = "";
    operatorIsSelected = false;
    screenOperator.textContent = "";
    keypadNumbers[10].disabled = false
    keypadNumbers.forEach(button => button.disabled = false);
    keypadOperators.forEach(button => button.disabled = false);
    equalBtn.disabled = false;
}

function selectOperator (button) {
    switch (button) {
        case "power":
            selectedOperator = "^";
            operatorIsSelected = true;
            break;
        case "division":
            selectedOperator = "/";
            operatorIsSelected = true;
            break;
        case "multiplication":
            selectedOperator = "*";
            operatorIsSelected = true;
            break;
        case "subtraction":
            selectedOperator = "-";
            operatorIsSelected = true;
            break;
        case "addition":
            selectedOperator = "+";
            operatorIsSelected = true;
            break;
    }
}

// EVENT LISTENERS

const operands = {
    num1: null,
    num2: null,
}

let displayBuffer = "";
let selectedOperator = "";
let operatorIsSelected = false;

const keypadNumbers = document.querySelectorAll('.number');
keypadNumbers.forEach(button => button.addEventListener('click', updateScreen));
const keypadOperators = document.querySelectorAll('.operator');
keypadOperators.forEach(button => button.addEventListener('click', operator));
const screenBuffer = document.querySelector('#buffer');
const screenOperator = document.querySelector('#operator');
const equalBtn = document.getElementById('equal');
equalBtn.addEventListener('click', runOperation);
const clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', clearAll);
const eraseBtn = document.getElementById('erase');
eraseBtn.addEventListener('click', eraseScreen)