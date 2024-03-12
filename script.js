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
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
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

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
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
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} €`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}  €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })

    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}  €`;
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

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add value to movemnets
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
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
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
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
const ages = [25, 12, 18, 80, 44];
const names = ['shakir', 'aliyar', 'rayyan', 'sabeen', 'saba'];

//const result = ages.find(age => age > 25);
const result = names.splice(1, 0, 'Khan', 'Ali');

// Equality
//console.log(movements.includes(-130));

// SOME:CONDITION
const anyValue = movements.some(mov => mov > 5000);

// EVERY
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// Separate Callback
const deposit = mov => mov < 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// Flat and FlatMap methods
const arr2 = [[1, 2, 3], [4, 5, 6], 7, 8];
//console.log(arr2.flat());

const arrDeep = [[1, [2, 3]], [4, [5, [6]]], 7, 8];
//console.log(arrDeep.flat(3));

const accountMovemnets = accounts.map(acc => acc.movements);
//console.log(accountMovemnets);

const allMovemnets = accountMovemnets.flat();
//console.log(allMovemnets);

// const overallBalance = allMovemnets.reduce((acc, cur) => acc + cur, 0);
// console.log(overallBalance);

//Chaining....
const overallBalance = accounts
  .flatMap(mov => mov.movements)
  .reduce((acc, cur) => acc + cur);
//console.log(overallBalance);
const numbersArr = [3, 10, 4, 21, 5, 9, 2, 6, 5, 3, 5];
numbersArr.sort((a, b) => a - b);
//console.log('Ascending Order:', numbersArr);
numbersArr.sort((a, b) => b - a);
//console.log('Descending Order:', numbersArr);

// Programmatically create array.
const array4 = Array.from({ length: 10 }, (_, i) => i + 1);
//console.log(array4);

//1.   Calculate all the movment values in accounts object...
const bankDepositSum = accounts
  .flatMap(mov => mov.movements)
  .filter(amount => amount > 0)
  .reduce((sum, cur) => sum + cur, 0);
//console.log(bankDepositSum);

// 2. Count deposits which are greater than 1000
const numDeposits1000 = accounts
  .flatMap(mov => mov.movements)
  .filter(amount => amount >= 1000).length;
//console.log(numDeposits1000);

//3.  Calculate deposits and withdrawls
const sums1 = accounts
  .flatMap(mov => mov.movements)
  .reduce(
    (sums1, cur) => {
      cur > 0 ? (sums1.deposits += cur) : (sums1.withdrawals += cur);
      return sums1;
    },
    { deposits: 0, withdrawals: 0 }
  );
//console.log(sums1);

const { dep, withdrawals } = accounts
  .flatMap(mov => mov.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'dep' : 'withdrawals'] += cur;
      return sums;
    },
    { dep: 0, withdrawals: 0 }
  );
//console.log(dep, withdrawals);

// 4. Convert a string into title case.

const convertTitleCase = function (title) {
  const exceptions = [
    'a',
    'is',
    'an',
    'the',
    'but',
    'and',
    'or',
    'on',
    'in',
    'with',
  ];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return titleCase;
};
/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah dog is eating too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  }`
);
// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);

//console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
//console.log(ownersEatTooLittle);

// 4.

//console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
//console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
// 5.
//console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6.
const checkEatingOkay = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
//console.log(dogs.some(checkEatingOkay));

// 7.
//console.log(dogs.filter(checkEatingOkay));

// 8.
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
//console.log(dogsSorted);
