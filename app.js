"use strict"

/* КОНСТАНТЫ */
const maths = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
}

const state = { result: 0, preResult: 0, preStats: '', }

const operators = Object.keys(maths) // ['+', '-', '*', '/']

/* ФУНКЦИИ */
function calculator(expression, acc = 0) {
    const [left, right, operator] = parse(expression)
    const leftOrAcc = Number.isNaN(left) ? acc : left;

    state.result = calculating(leftOrAcc, right, operator)

    return state.result

}

function calculating(left, right, operator) {
    if (operators.includes(operator)) {
        return maths[operator](left, right)
    }
}

function parse(expression){ //3-3
    // Удаляем пробелы в строке
    const clearExpression = expression.replace(/\s/g, '');

    // Функции нахождения оператора
    const hasOperator = (operator) => clearExpression.includes(operator); 
    const [currentOperator] = operators.filter(hasOperator);

    // Функция нахождения операнда 
    const operands = clearExpression.split(currentOperator);

    operands.forEach(item => item == '' ? NaN : item)


    const [left, right] = operands;

    return [parseFloat(left), parseFloat(right), currentOperator]
}


/*ПОЛУЧАЕМ ЭЛЕМЕНТЫ*/
let input = document.querySelector('.input')
let buttons = document.querySelector('.buttons')

buttons.addEventListener('click', handler)

let left = '';
let right = '';
let operator = '';
let pre = document.querySelector('.preResult')


function handler(event) {
    const pattern = event.target

    // Если результат уже есть (и он выведен), то при новом наборе цифр он стирается из строки 
    input.value = input.value == state.preResult ? '' : input.value


    if (pattern.classList.contains('number')) {
        if(pre){
            pre.innerText = ''
        }

        input.value += pattern.innerText

        left = operator == '' ? left += pattern.innerText : left
        right = operator == '' ? right : right += pattern.innerText
    }

    if (pattern.classList.contains('special')) {

        operator = operator == '' ? pattern.innerText : operator
        if(!left){
            left = state.preResult
            input.value += operator == '' ? left + pattern.innerText : left
        }
        
        if(!right){
            input.value = !input.value.indexOf(operator) ? operator : left + operator
        }
        
        
    }

    if (pattern.classList.contains('special__c')) {
        input.value = '';
        left = '';
        right = '';
        operator = ''

        if(pre){
            pre.innerText = ''
        }
    }


    if (pattern.classList.contains('special__eq')) {
        left = left == '' ? state.preResult : parseFloat(left)
        right = parseFloat(right)
        
        if(right){
            state.preStats = `${left} ${operator} ${right} =` 
        }

        state.result = calculating(left, right, operator)
        state.preResult = state.result == undefined ? state.preResult : state.result

        input.value = state.result == undefined ? state.preResult : state.result

        if (!pre) {
            pre = document.createElement('span')
            pre.classList.add('preResult')
            pre.innerText = `${left} ${operator} ${right} =`
            input.after(pre)
        }else{
            pre.innerText = state.preStats
        }
        

        left = '';
        right = '';
        operator = '';
        state.result = 0
    }


    console.log([left, right, operator])
}


