"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////

// Functions
//   DISPLAYED IN SCROLL
const displarmovements = function (movements, sort = false) {
  const movs = sort ? movements.splice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  ,
    <div class="movements__value">  ${mov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//   Displaed total
const displaytotal = function (acc) {
  acc.totaleoro = acc.movements.reduce(function (accu, mov) {
    return accu + mov;
  });

  labelBalance.innerHTML = `${acc.totaleoro}$`;
  // console.log(acc.totaleoro);
};
// displaytotal(currentaccount);

// DISPLAYED IN AMOUNT

const displayinamount = function (movement) {
  const income = movement.movements
    .filter(function (ind) {
      return ind > 0;
    })
    .reduce(function (acc, val) {
      return acc + val;
    }, 0);
  labelSumIn.innerHTML = income;

  const out = movement.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, val) {
      return acc + val;
    }, 0);
  labelSumOut.innerHTML = Math.abs(out);
  const intereset = movement.movements
    .filter(function (move) {
      return move > 0;
    })
    .map(function (acc) {
      return (acc * movement.interestRate) / 100;
    })
    .filter((acc) => acc > 1)
    .reduce(function (acc, val) {
      return acc + val;
    });
  labelSumInterest.innerHTML = `${intereset}%`;
};

//   FIND WHICH ACCOUNT  AS A EXAMPLE
const fingding = accounts.find(function (aBcc) {
  return aBcc.owner;
});
console.log(fingding);

// DISPLAYED SHORT USERNAME

const displayusername = function (accs) {
  accs.forEach(function (acc) {
    acc.usernames = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
displayusername(accounts);
console.log(accounts);

// ALL FUNCTION

const updateUi = function (acc) {
  displaytotal(acc);
  displayinamount(acc);
  displarmovements(acc.movements);
};

// DISPLAY THE TIMER
// let time = 10;
// const displaytimer = setInterval(function () {
//   const mint = String(Math.trunc(time / 60)).padStart(2, 0);
//   const sec = String(Math.trunc(time % 60));

//   time--;
//   labelTimer.innerHTML = `${mint}:${sec}`;

//   if (time === 0) {
//     clearInterval(displaytimer);
//     containerApp.style.opacity = 0;
//   }
// }, 1000);

// FIND THE INPUT USERNAME AND PIN CODE
let currentaccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentaccount = accounts.find(function (acc) {
    // USERNAME IS FROM UPPER FUNCTION FOR SHORTER NAME OTHERWISE WE USE OWNER
    return acc.usernames === inputLoginUsername.value;
  });
  console.log(currentaccount);
  if (currentaccount?.pin === Number(inputLoginPin.value)) {
    console.log("yu are loginned");
    labelWelcome.innerHTML = `Welcome ${currentaccount.owner
      .split(" ")
      .join(" ")} `;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = " ";
    inputLoginPin.blur();

    updateUi(currentaccount);
  }
});

// EVENT ON  TRANSFER MONEY

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const trasferamount = Number(inputTransferAmount.value);

  const whichacount = accounts.find(function (acc) {
    return acc.usernames === inputTransferTo.value;
  });
  console.log(whichacount, trasferamount);

  if (
    trasferamount > 0 &&
    whichacount.usernames !== currentaccount.usernames &&
    trasferamount <= currentaccount.totaleoro
  ) {
    // console.log("you will trnasfer");

    // DOING TRNASFER

    currentaccount.movements.push(-trasferamount);
    whichacount.movements.push(trasferamount);
    updateUi(currentaccount);
  }
});

// BTN REQUESTING LONE

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    // SUM IS USED BECUASE BANK REQIREMENT IS TO GAVE LOAN TO THOSE PEAOPLE THAT HAVE DEPOSIT OF 10% OF THE AMOUNTS
    currentaccount.movements.some((mov) => mov >= amount * 1.2)
  ) {
    currentaccount.movements.push(amount);
    updateUi(currentaccount);
  }
});

// EVENT ON CLOSING ACCOUNT BTN
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const confrimuser = accounts.find(
    (acc) => acc.usernames === inputCloseUsername.value
  );
  console.log(confrimuser);
  const confirmpin = Number(inputClosePin.value);
  if (
    confrimuser.usernames === currentaccount.usernames &&
    confirmpin === currentaccount.pin
  ) {
    console.log("you want to close yur acoount");
    accounts.splice(confrimuser, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

// console.log(accounts);
// const total = accounts.flatMap((acc) => acc.movements);
// console.log(total);

// BTN SORT
let sort = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displarmovements(currentaccount.movements, !sort);
  sort = !sort;
});
