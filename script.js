'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount;
let sorted = false;

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// DISPLAY USER-NAME IN UI
const displayMovement = (movements, sorted = false) => {
  containerMovements.innerHTML = '';

  const movs = sorted ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, idx) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type}</div>
      <div class="movements__value">${mov}$</div>
    </div>`;

    containerMovements.insertAdjacentHTML('beforeend', html);
  });
};

// CALCULATE AND DIPLAY BALANCE
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} taka`;
};

// CREATE AND ADDING --USER-NAME
(function (accs) {
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
})(accounts);

// DISPLAY CALCULATE SUMMARY
const calcDisplaySummary = acc => {
  // INCOME
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income}$`;

  // OUTCOME
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}$`;

  // INTEREST
  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}$`;
};

// UPDATE UI
const updateUI = acc => {
  // DISPLAY MOVEMENTS,
  displayMovement(acc.movements);

  // DISPLAY BALANCE,
  calcDisplayBalance(acc);

  // DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

// TRANSFER MONEY
btnTransfer.addEventListener('click', ev => {
  ev.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // TRANSACTION LOGIC
  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc.username !== currentAccount.username
  ) {
    // TRANSACTION IMPLEMENT
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    // UPDATE UI
    updateUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

///////////////
// LOG-IN
const accountValidate = () => {
  // CHECK USER-NAME
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // CHECK PASS-WORD
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // DISPLAY UI && WELCOME MESSAGE
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // CLEAR USER INPUT
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // UDATE UI
    updateUI(currentAccount);
  }
};

// LOG-IN BUTTON
btnLogin.addEventListener('click', ev => {
  ev.preventDefault();

  accountValidate();
});

// LOAN
btnLoan.addEventListener('click', ev => {
  ev.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    currentAccount.movements.push(amount);

    // UPDATE UI
    updateUI(currentAccount);
  }

  // CLEAR UI
  inputLoanAmount.value = '';
});

// CLOSE ACCOUNT
btnClose.addEventListener('click', ev => {
  ev.preventDefault();

  // CHECK CREDENTIALS
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // DELETE ACCOUNT
    accounts.splice(index, 1);

    // HIDE UI
    containerApp.style.opacity = 0;
  }

  // CLEAR USER INPUT
  inputCloseUsername.value = inputClosePin.value = '';
});

// sort
btnSort.addEventListener('click', ev => {
  displayMovement(currentAccount.movements, !sorted);

  // FLIP SORTED STATE
  sorted = !sorted;
});

// AUTO ACCOUNT INFORMATION INJECT
const autoAccount = () => {
  inputLoginUsername.value = 'js';
  inputLoginPin.value = '1111';
};

// AUTO LOG-IN WHEN PAGE LOAD
window.addEventListener('load', () => {
  autoAccount();
  accountValidate();
});
