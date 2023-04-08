'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-04-03T17:01:17.194Z',
    '2023-04-04T23:36:17.929Z',
    '2023-04-06T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

/* const account3 = {
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
}; */

// const accounts = [account1, account2, account3, account4];
const accounts = [account1, account2];

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
const info = document.querySelector('.info');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
/////////////////////////////////////////////////
const movements__row = document.querySelectorAll('movements__row');

// # To update date & time just below current balance

/* Here, we are using internationalization api for date and time formatting and this comes prebuild in JS
and it name is 'intl' and it has a method that takes the language and location and makes a formatter on the
basis of that particular location and language and on that formatter we can call a format method and in which
we can pass on dates and then the dates will be formatted in that particular format. */
const currDate = new Date();
const locale = navigator.language; //to get a person language from his brower
console.log(locale); //en-GB
const options = {
  //give numeric value to get numeric(4) value and long(august) to get full value. See, intl doc for more options when needed
  minute: 'numeric',
  hour: 'numeric',
  day: 'numeric',
  month: 'long',
  year: '2-digit',
  weekday: 'short',
};
//we can also provide an object as the second argument in the DateTimeFormat method here to get more values on the basis of that object.
// labelDate.textContent = `${Intl.DateTimeFormat('en-US').format(currDate)}`; //accord US
console.log(`${Intl.DateTimeFormat(locale, options).format(currDate)}`);
labelDate.textContent = `${Intl.DateTimeFormat('en-IN', options).format(
  currDate
)}`; //Accord India

let displayDate;
let trying;
const formatMovementDate = function (acc, index) {
  const now = new Date(acc.movementsDates[index]);
  const calcDayPassed = (day1, day2 = new Date()) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  const calcDayPassedd = calcDayPassed(now);
  if (calcDayPassedd === 0) displayDate = `Today`;
  else if (calcDayPassedd === 1) displayDate = 'Yesterday';
  else if (calcDayPassedd <= 7) displayDate = `${calcDayPassedd} days ago`;
  else {
    /*     const day = `${now.getDate()}`.padStart(2, 0); //see padStart method
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    displayDate = `${day}/${month}/${year}`; */
    //using intl api instead for date/time formatting
    const options2 = {
      day: 'numeric',
      year: 'numeric',
      month: 'numeric',
    };
    displayDate = `${Intl.DateTimeFormat(acc.locale, options2).format(now)}`;
    console.log(displayDate);
  }
  // console.log(calcDayPassed(now));
};
const formatCur = function (value, locale, currency) {
  //using intl api to format Number(movements money) and adding a currency after it.
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
  /* Note: You'll notice that the currency for JD 2222 is comming at the end of the number but for JS 1111 is coming at the 
  front that is because of their locale. On the bais of their locale the format of the number is decided(whether the
  currency will come at front or back) and then wev've added currency and the type of currency(eur, $) that is added 
   depends upon the currency we've chosen to add from the object.currency key present in each account. */
};

const displayMovements = function (acc, sorted = false) {
  containerMovements.innerHTML = '';
  const movs = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, index) {
    formatMovementDate(acc, index);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const formattedCurrency = formatCur(mov, acc.locale, acc.currency);
    const html = `<div class="movements__row">    
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div> 
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedCurrency}</div> 
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html); //insertAdjacentHTML is used to inert html paramters(position we want to add html text at and then the html we want to add)
  });
};

//Adding all the money in the account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, value, index, array) => accumulator + value,
    0
  );
  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

//This function show the total of deposits and withdrawl.
const calcDisplaySummary = function (acc) {
  //Calculating all the deposits
  const deposit = acc.movements
    .filter((val) => val > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = formatCur(deposit, acc.locale, acc.currency);

  //Calculating all the withdrawls
  const withdrawls = acc.movements
    .filter((val) => val < 0)
    .reduce((accumulator, val) => accumulator + val, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(withdrawls),
    acc.locale,
    acc.currency
  );

  //Calculating the interest. interest rate = 1.2% of deposited amount.
  const interest = acc.movements
    .filter((val) => val > 0)
    .map((val) => (val * acc.interestRate) / 100) //Here, bank introduced a new rule that the interest in only paid if the interest is atleast 1
    .filter((interest) => interest >= 1)
    .reduce((acc, val, i, arr) => acc + val, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//Computing user name for the Accounts.
const createUserName = function (accs) {
  accs.forEach(function (value, index, arr) {
    value.userName = value.owner
      .toLowerCase()
      .split(' ')
      .map((value) => value[0]) //map(function(value,index,arr){})
      .join('');
  });
};

//Accounts arr on line = 36
createUserName(accounts);
//Printing all the username from the accounts
accounts.forEach(function (acc) {
  console.log(acc.userName);
});

const updateUI = function (currentAccount) {
  //Display movements
  displayMovements(currentAccount);
  //Displaying Balance
  calcDisplayBalance(currentAccount);
  //Display Summary
  calcDisplaySummary(currentAccount);
};
let currentAccount;

//Adding Event listers
btnLogin.addEventListener('click', function (event) {
  //Note: the default bahaviour of a button in a form elements is to reload the page after clicking it.
  //And here this method would prevent form from submitting after clicking submit button.
  event.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Clear input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //So that we don't see the cursor blinking in input pin field.
    //Display UI and Welcome Message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '100';
    containerApp.style.display = 'grid';
    info.style.display = 'none';

    updateUI(currentAccount);
  } else {
    containerApp.style.opacity = '0';
    containerApp.style.display = 'none';
    info.style.display = 'grid';
    labelWelcome.textContent = 'Log in to get started';
  }
});

//Function for transfering money
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAccount = accounts.find(
    (accounts, index, arr) => inputTransferTo.value === accounts.userName
  );

  //Clearing the input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  if (
    currentAccount.balance >= amount &&
    amount > 0 &&
    recieverAccount?.userName !== currentAccount.userName
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    //Adding money recieving date
    recieverAccount.movementsDates.push(new Date().toISOString());

    //Adding transfer Date
    currentAccount.movementsDates.push(new Date().toISOString()); //JS will automatically convert this date into nicely formated string

    //Updating UI
    updateUI(currentAccount);
  } else alert(`Their is some mistake you are doing while transferring the money. Either, the amount or person you're sending`);
});

//Code for taking lone
//The rule of our bank to give loan is that the account should have atleast one deposit which is equal to the 10% of the requested loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requestLoanAmount = Math.floor(inputLoanAmount.value);
  if (
    requestLoanAmount > 0 &&
    currentAccount.movements.some((value) => value >= requestLoanAmount * 0.1)
  ) {
    currentAccount.movements.push(requestLoanAmount);
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  } else console.log(`You should have ${requestLoanAmount * 0.1} as deposit for loan`);
  inputLoanAmount.value = '';
});

//Writing the functinality for the close accounts part of the UI
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (val, index, arr) => val.userName === currentAccount.userName
    );
    //Delete User
    accounts.splice(index, 1); //remove 1 element at index .splice(index, elem to remove, elem to add). this statement says remove 1 element at index and add 0 element at that index.So, basically this would only remove 1 element at index because adding 0 element doesn't make sense.

    //Hide UI
    containerApp.style.opacity = '0';
  }
  //Clearing the input fields
  inputClosePin.value = inputCloseUsername.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
});

//Calculating total amount in the accounts.
const accountMovements = accounts.map((value) => value.movements);
const allMovements = accountMovements.flat();
const overAllBalance = allMovements.reduce(
  (acc, value, i, arr) => (acc = value + acc),
  0
);
console.log(overAllBalance);

//Doing the same thing Via channing
console.log(
  accountMovements.flat().reduce((acc, value, i, arr) => (acc = value + acc), 0)
);
let sorted = false;
//Applying sorting button functinality.
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//Lecture + = 164
//Converting nodeList into array.
/* labelBalance.addEventListener('click', function () {
  //We can direclty pass out nodeList into from method and make an array. `document.querySelectorAll('.movements__value') as this would give an nodeList`
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
  console.log(movementsUI);
  console.log(movementsUI.map((el) => el.textContent.replace('€', ''))); //taking out text content from all the html elements inside of movementsUI
}); */
// --------------------we can also do this.------------------labelBalance.addEventListener('click', function () {
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    (value, index) => +value.textContent.replace('€', '') //this here is mapping callback function as described in the 164 files and in notes on udemy. you can also do mdn
  );
  console.log(movementsUI);
});

//You can also convert nodeList into array by spreading it. Like
const movementsUI2 = [...document.querySelectorAll('.movements__value')];
//but here we have to perfom maping function seperately over it to get the textContent from inside of it.

//We can't right this without an eventHandler because if we did then this code will get executed as soon as we starts our application and
//then will be over written as soon as we login with the deposits of the current user.

//giving rows background color on clicking over the balance on the basis of their index using remainder operator
labelBalance.addEventListener('click', changeFunUI);
function changeFunUI() {
  Array.from(document.querySelectorAll('.movements__row')).forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'skyblue';
  });
}
