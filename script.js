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

const displayMovements = function (acc) {
  containerMovements.innerHTML = '';
  acc.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const euroToUsd = 1.1;
const movementsUSD = movements.map(function (mov) {
  return mov * euroToUsd;
});
// // console.log(movements);
// console.log(movementsUSD);
const movementsUSDArray = [];
for (let mov of movements) movementsUSDArray.push(mov * euroToUsd);
//console.log(movementsUSDArray);

const movmentDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

const user = 'Steven Thomas Williams';

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out)}  €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })

    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}  €`;
};
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance..
  displayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};
let currentAccount;
// Event handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Clear text boxes
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

const deposits = movements.filter(mov => mov > 0);

const balance = movements.reduce((acc, cur) => acc + cur, 0);
//console.log(balance);
let balance2 = 0;
for (const bal of movements) balance2 += bal;
//console.log(balance2);

//Maximum Value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
//console.log(max);[5, 2, 4, 1, 15, 8, 3]

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter(age => age >= 18);
  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  return average;
};

const agverage1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const agverage2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// Calculating the total price useing .forEach and .reduce method.
const items = [
  { name: 'Apple', price: 10 },
  { name: 'Orange', price: 20 },
  { name: 'Mango', price: 30 },
];

let totalPrice = 0;
items.forEach(item => {
  totalPrice += item.price;
});

const totalPrice1 = items.reduce((acc, item) => {
  return acc + item.price;
}, 0);
//console.log(totalPrice1);

// Removing duplicate using reduce.
const items1 = [
  { name: 'Apple', category: 'Fruit' },
  { name: 'Onion', category: 'Vegetable' },
  { name: 'Orange', category: 'Fruit' },
  { name: 'Lettuce', category: 'Vegetable' },
];
const groupedItems = items1.reduce((acc, item) => {
  const category = item.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(item.name);
  return acc;
}, {});
//console.log(groupedItems);

// Removing duplicate items.
const itemArray = [1, 2, 3, 1, 2, 3, 7, 8, 7];

const uniqueItems = itemArray.reduce((acc, item) => {
  if (!acc.includes(item)) {
    acc.push(item);
  }
  return acc;
}, []);
//console.log(uniqueItems);

// Magic of chaining...

const totalDepositsInUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, cur) => acc + cur);
//console.log(totalDepositsInUSD);

let arr = [3, 4, 5, 6];
for (let i = 0; i < arr.length; i++) {
  arr[i] = arr[i] * 3;
}

const modifiedArr = arr.map(function (item) {
  return item * 3;
});
// console.log(modifiedArr);
let users = [
  { firstName: 'Susan', lastName: 'Steward' },
  { firstName: 'Daniel', lastName: 'Longbottom' },
  { firstName: 'Jacob', lastName: 'Black' },
];

const fullName = users.map(function (name) {
  return `${name.firstName} ${name.lastName}`;
});
//console.log(fullName);

let arr1 = [2, 3, 5, 7];

for (let item of arr1) {
  item = item * 3;
}
let users1 = [
  { name: 'John', age: 25, occupation: 'gardener' },
  { name: 'Lenny', age: 51, occupation: 'programmer' },
  { name: 'Andrew', age: 43, occupation: 'teacher' },
  { name: 'Peter', age: 81, occupation: 'teacher' },
  { name: 'Anna', age: 47, occupation: 'programmer' },
  { name: 'Albert', age: 76, occupation: 'programmer' },
];

// let filteredUsers = [];
// for (let i = 0; i < users1.length; i++) {
//   if (users1[i].age > 40 && users1[i].occupation === 'programmer') {
//     filteredUsers = [...filteredUsers, users1[i]];
//   }
// }
// console.log(filteredUsers);

const filteredUsers = users1
  .filter(user => user.age > 40 && user.occupation === 'programmer')
  .map(user => user.name);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
