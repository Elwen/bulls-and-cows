var getNum = function () {
  number  = [];

  while (number.length < 4) {
    let newNum = Math.floor(Math.random() * 10);
    if (number.indexOf(newNum) < 0) {
      number.push(newNum);
    }
  }

  return number;
};

var goal = getNum();

const playerInput = document.querySelector('#player');

playerInput.addEventListener('keyup', function(e) {
  e.preventDefault();
  if (e.keyCode === 13 || e.which === 13) {
    document.querySelector('#guess-btn').click();
  }
});

var guess = function () {
  let playerNum = playerInput.value;
  let arr = [];

  if(playerNum.length !== 4) {
    document.querySelector('.form').classList.add('has-error');
  } else {
    document.querySelector('.form').classList.remove('has-error');
    for (let i = 0; i < 4; i++) {
      let newUserArrElement = parseInt(playerNum.substr(i, 1));
      arr.push(newUserArrElement);
    }
    check(arr);
  }
};

var check = function (par) {
  let bulls = 0;
  let cows = 0;
  let turns = parseInt(document.querySelector('.turns').innerHTML);

  for (let i = 0; i < 4; i++) {
    if (par[i] === goal[i]) {
      bulls++;
    } else if (goal.indexOf(par[i]) >= 0) {
      cows++;
    };
  };

  turns--;
  document.querySelector('.turns').innerHTML = turns;

  if (turns === 0 || bulls === 4) {
    let status = 'проиграли';
    let resultClass = 'bg-dark';
    if (bulls === 4) {
      status = 'выиграли';
      resultClass = 'bg-success';
    }
    endGame(par, turns, status, resultClass);
  };
  writeTurn(par, bulls, cows);
};

var writeTurn = function (par, bulls, cows) {
  let table = document.querySelector('#turnsList');
  let tableLine = table.children.length;
  let  newLine = document.createElement('tr');
  newLine.innerHTML = `<td>${tableLine}</td><td>${par.join('')}</td><td>${bulls}</td><td>${cows}</td>`;
  table.insertBefore(newLine, table.children[1]);

};

var endGame = function (par, turns, status, resultClass) {
  document.querySelector('.result').innerHTML = `
    <div class="card-header ${resultClass}">
      <button class="btn btn-sm btn-link float-right" onclick="restartGame()"><i class="icon icon-refresh text-light"></i></button>
      <span class="h4">Вы ${status}</span><br>
      <span class="h5">Загаданное число: ${goal.join('')}</span>
    </div>
  `;

  document.querySelector('#guess-btn').disabled = true;
};

var restartGame = function() {
  location.reload();
};

console.log('🐮🐮🐮🐮');