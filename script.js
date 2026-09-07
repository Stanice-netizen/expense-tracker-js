const form = document.querySelector('#form')

const descriptionInput = document.querySelector('#description')
const amountInput = document.querySelector('#amount')

const transactionList = document.querySelector('#transaction-list')

const balanceElement = document.querySelector('#balance')
const incomeElement = document.querySelector('#income')
const expensesElement = document.querySelector('#expenses')

// Get transactions from localStorage
let transactions = loadTransactions()

// ==============================
// LOCAL STORAGE
// ==============================

function saveTransactions () {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

function loadTransactions () {
  const data = localStorage.getItem('transactions')

  return data ? JSON.parse(data) : []
}

// ==============================
// ADD TRANSACTION
// ==============================

form.addEventListener('submit', function (event) {
  event.preventDefault()

  const description = descriptionInput.value.trim()
  const amount = Number(amountInput.value)

  // Make sure the user entered valid information
  if (description === '' || amount === 0 || Number.isNaN(amount)) {
    return
  }

  const transaction = {
    id: Date.now(),
    description,
    amount
  }

  transactions.push(transaction)

  saveTransactions()

  renderTransactions()
  updateTotals()

  form.reset()
})

// ==============================
// DISPLAY TRANSACTIONS
// ==============================

function renderTransactions () {
  transactionList.innerHTML = ''

  transactions.forEach(function (transaction) {
    const listItem = document.createElement('li')

    listItem.classList.add('transaction')

    if (transaction.amount >= 0) {
      listItem.classList.add('income')
    } else {
      listItem.classList.add('expense')
    }

    const transactionInfo = document.createElement('div')
    transactionInfo.classList.add('transaction-info')

    const description = document.createElement('span')
    description.textContent = transaction.description

    const amount = document.createElement('span')
    amount.classList.add('transaction-amount')

    const sign = transaction.amount >= 0 ? '+' : '-'

    amount.textContent =
      `${sign}$${Math.abs(transaction.amount).toFixed(2)}`

    transactionInfo.appendChild(description)
    transactionInfo.appendChild(amount)

    const deleteButton = document.createElement('button')

    deleteButton.textContent = 'Delete'
    deleteButton.classList.add('delete-btn')

    deleteButton.addEventListener('click', function () {
      deleteTransaction(transaction.id)
    })

    listItem.appendChild(transactionInfo)
    listItem.appendChild(deleteButton)

    transactionList.appendChild(listItem)
  })
}

// ==============================
// DELETE TRANSACTION
// ==============================

function deleteTransaction (id) {
  transactions = transactions.filter(function (transaction) {
    return transaction.id !== id
  })

  saveTransactions()

  renderTransactions()
  updateTotals()
}

// ==============================
// CALCULATE TOTALS
// ==============================

function updateTotals () {
  let totalIncome = 0
  let totalExpenses = 0

  transactions.forEach(function (transaction) {
    if (transaction.amount > 0) {
      totalIncome += transaction.amount
    } else {
      totalExpenses += Math.abs(transaction.amount)
    }
  })

  const balance = totalIncome - totalExpenses

  balanceElement.textContent = `$${balance.toFixed(2)}`
  incomeElement.textContent = `$${totalIncome.toFixed(2)}`
  expensesElement.textContent = `$${totalExpenses.toFixed(2)}`
}

// ==============================
// INITIAL DISPLAY
// ==============================

renderTransactions()
updateTotals()
