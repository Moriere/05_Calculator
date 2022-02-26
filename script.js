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

function factorial(num1) {
    if (num1 === 0) return 1;
    if (num1 < 0) return "Error";

    for (let i = num1; i > 0; i--) {
        num1 *= i; 
    }
    return num1;
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
        case "!":
            return factorial(num1);
    }
}

// UI FUNCTIONS

function updateScreen(number) {
    if (displayBuffer.length < 13) {
        number.target.classList.add('clicked');
        if (number.target.id === 'decimal') {
            displayBuffer += ".";
            number.target.disabled = true;
        } else {
            displayBuffer += number.target.id;
        }
        screenBuffer.textContent = displayBuffer;
    }
}

function eraseScreen(event) {
    event.target.classList.add('clicked');
    if (screenBuffer.textContent === "Error") return;
    displayBuffer = displayBuffer.slice(0, displayBuffer.length - 1);
    screenBuffer.textContent = displayBuffer;
    if (!displayBuffer.includes(".")) keypadNumbers[10].disabled = false;
}

function operator (button) {
    button.target.classList.add('clicked');
    if (!operatorIsSelected && operands.num1 === null) {
        selectOperator(button.target.id);

        operands.num1 = Number(displayBuffer);
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

function runOperation (event) {
    event.target.classList.add('clicked');
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
        if (operands.num1 < 10 ** 13) screenBuffer.textContent = operands.num1;
        else screenBuffer.textContent = "Num is too long"
    } else return;
}

function clearAll (event) {
    event.target.classList.add('clicked');
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

function selectOperator (operator) {
    switch (operator) {
        case "power":
            selectedOperator = "^";
            break;
        case "division":
            selectedOperator = "/";
            break;
        case "multiplication":
            selectedOperator = "*";
            break;
        case "subtraction":
            selectedOperator = "-";
            break;
        case "addition":
            selectedOperator = "+";
            break;
        case "factorial":
            selectedOperator = "!";
            break;
    }
    operatorIsSelected = true;
}

const operands = {
    num1: null,
    num2: null,
}

let displayBuffer = "";
let selectedOperator = "";
let operatorIsSelected = false;

// EVENT LISTENERS

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
eraseBtn.addEventListener('click', eraseScreen);

// KEYBOARD IMPLEMENTATION

function keyboardImplementation(key) {
    const keypadNumbersArray = Array.from(keypadNumbers);
    keypadNumbersArray.sort( (a, b) => (a.id > b.id) ? 1 : -1);

    if (key.key >= 0 && key.key <= 9) keypadNumbersArray[key.key].click();
    if (key.key === ".") keypadNumbersArray[10].click();
    if (key.key === "/" || key.key === "*" || key.key === "-" || key.key === "+" || key.key === "!") {
        const operator = document.querySelector(`[data-key="${key.key}"]`);
        operator.click();
    }
    if (key.getModifierState("AltGraph") && key.code === "Quote") keypadOperators[1].click();
    if (key.key === "Backspace") eraseBtn.click();
    if (key.key === "Enter") equalBtn.click();
    if (key.key === "Escape") clearBtn.click();
}

window.addEventListener('keydown', keyboardImplementation)

// BUTTON ANIMATION

const buttons = document.querySelectorAll('button');
buttons.forEach(button => button.addEventListener('transitionend', removeTransition));

function removeTransition(button) {
    if (button.propertyName === "transform") button.target.classList.remove('clicked')
}