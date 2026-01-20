import { roundFiveDigits } from "./helpers.js"

const firstSelect = document.querySelector('[data-first-select]')
const secondSelect = document.querySelector('[data-second-select]')

const swapBtn = document.querySelector('[data-swap-btn]')
const comparisonInfo = document.querySelector('[data-comparison-info]')

const firstInput = document.querySelector('[data-first-input]')
const secondInput = document.querySelector('[data-second-input]')

const BASE_URL = 'https://open.er-api.com/v6/latest/'
const FIRST_DEFAULT_CURRENCY = "USD"
const SECOND_DEFAULT_CURRENCY = "RUB"

let rates = {}

// обработчик событий для инпута
firstInput.addEventListener("input", () => {
    secondInput.value = roundFiveDigits(firstInput.value * rates[secondSelect.value])
})
secondInput.addEventListener('input', () => {
    firstInput.value = roundFiveDigits(secondInput.value / rates[secondSelect.value])
})

// обработчик событий для кнопки
swapBtn.addEventListener("click", () => {
    let now = firstSelect.value
    firstSelect.value = secondSelect.value
    secondSelect.value = now
    
    updateExchangeRates()
})

// обработчик событий для опций
firstSelect.addEventListener("change", () => updateExchangeRates())
secondSelect.addEventListener('change', () => renderInfo())

// обновление курса
const updateExchangeRates = async () => {
    try {
        const response = await fetch(`${BASE_URL}/${firstSelect.value}`)
        const data = await response.json()
        
        rates = data.rates
        renderInfo()
    } catch (error) {
        console.error(error.message)
    }
}

// отрисовка
const renderInfo = () => {
    comparisonInfo.textContent = `1 ${firstSelect.value} = ${rates[secondSelect.value]} ${secondSelect.value}`

    firstInput.value = rates[firstSelect.value]
    secondInput.value = rates[secondSelect.value]
}

// заполнение селектов
const populateSelects = () => {
    firstSelect.innerHTML = ""
    secondSelect.innerHTML = ''
    for (const cur of Object.keys(rates)) {
        firstSelect.innerHTML += `
            <option value="${cur}" ${cur === FIRST_DEFAULT_CURRENCY ? "selected" : ""}>${cur}</option>
        `
        secondSelect.innerHTML += `
            <option value="${cur}" ${cur === SECOND_DEFAULT_CURRENCY ? "selected" : ""}>${cur}</option>
        `
    }
}



// запрос - получение курсов валют
const getInitialRates = async () => {
    try {
        const response = await fetch(`${BASE_URL}/${FIRST_DEFAULT_CURRENCY}`)
        const data = await response.json()
        
        rates = data.rates
        populateSelects()
        renderInfo()
    } catch (error) {
        console.error(error.message)
    }
}

getInitialRates()