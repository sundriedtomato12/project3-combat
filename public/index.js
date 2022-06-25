const headerDiv = document.createElement('div');
headerDiv.setAttribute('id', 'header-div');

const header = document.createElement('h1');
header.setAttribute('id', 'header');
header.textContent = 'Combat Chicks';

const gameDiv = document.createElement('div');
gameDiv.setAttribute('id', 'game-div');

const gameStats = document.createElement('p');
gameStats.setAttribute('id', 'game-stats');

const battleDiv = document.createElement('div');
battleDiv.setAttribute('id', 'battle-div');

const playerBox = document.createElement('span');
playerBox.setAttribute('id', 'player-box');

const playerInfo = document.createElement('p');
playerInfo.setAttribute('id', 'player-info');

const opponentBox = document.createElement('span');
opponentBox.setAttribute('id', 'opponent-box');

const opponentInfo = document.createElement('p');
opponentInfo.setAttribute('id', 'opponent-info');

const gameButtons = document.createElement('div');
gameButtons.setAttribute('id', 'game-buttons');

const loginOrLogout = document.createElement('button');
loginOrLogout.setAttribute('id', 'login-or-logout');

const battleButton = document.createElement('button');
battleButton.setAttribute('id', 'battle-button');

const endBattleButton = document.createElement('button');
endBattleButton.setAttribute('id', 'end-battle-button');

const attackButton = document.createElement('button');
attackButton.setAttribute('id', 'attack-button');

const defendButton = document.createElement('button');
defendButton.setAttribute('id', 'defend-button');

const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');

if (window.location.pathname === '/') {
  document.body.appendChild(headerDiv);
  headerDiv.appendChild(header);
  document.body.appendChild(gameDiv);
  gameDiv.appendChild(gameStats);
  document.body.appendChild(battleDiv);
  document.body.appendChild(gameButtons);
  axios.get('/playerInfo').then((response) => {
    console.log('response data!!');
    console.log(response.data);
    gameButtons.appendChild(loginOrLogout);
    if (response.data.loggedIn === 'false') {
      gameStats.innerHTML = 'Welcome! Please log in to play!';
      loginOrLogout.innerHTML = 'Login';
      loginOrLogout.addEventListener('click', () => {
        window.location.pathname = '/login';
      });
    } else if (response.data.loggedIn === 'true') {
      loginOrLogout.innerHTML = 'Logout';
      loginOrLogout.addEventListener('click', () => {
        window.location.pathname = '/logout';
        axios.get('/logout').catch((error) => console.log(error)); });
      if (response.data.game_state.status === 'inactive') {
        gameStats.innerHTML = `Welcome, ${response.data.username}!<br>You are currently level ${response.data.level}<br>You have played ${response.data.game_state.gameStats.played} games in total and won ${response.data.game_state.gameStats.won} games so far`;

        battleButton.innerHTML = 'Battle!';
        battleButton.onclick = () => {
          axios.put('/battle').then(() => {
            window.location.reload();
          }).catch((error) => console.log(error));
        };
        gameButtons.appendChild(battleButton);
      } else if (response.data.game_state.status === 'active') {
        console.log('battle active');
        gameStats.innerHTML = 'Battle-in-progress!';
        battleDiv.appendChild(playerBox);
        battleDiv.appendChild(opponentBox);
        playerBox.appendChild(playerInfo);
        opponentBox.appendChild(opponentInfo);
        gameButtons.appendChild(attackButton);
        gameButtons.appendChild(defendButton);
        gameButtons.appendChild(endBattleButton);
        playerInfo.innerHTML = `${response.data.username}<br>Level ${response.data.level}<br>${response.data.game_state.health.player} HP`;
        opponentInfo.innerHTML = `${response.data.game_state.currentOpponent}<br>Level ${response.data.game_state.opponentLevel}<br>${response.data.game_state.health.opponent} HP`;

        attackButton.innerHTML = 'Attack!';
        attackButton.onclick = () => {
          axios.put('/attack').then((res) => {
            if (res.data.game === 'won') {
              alert(`You did ${res.data.damage} damage! You won the battle and levelled up!`);
              window.location.reload();
            } else if (res.data.game === 'reborn') {
              alert(`You did ${res.data.damage} damage! You won the battle and you are reborn as a chick! Back to level 1 :P`);
              window.location.reload();
            } else {
              alert(`You did ${res.data.damage} damage!`);
              window.location.reload();
            }
          }).catch((error) => console.log(error));
        };

        defendButton.innerHTML = 'Defend!';
        defendButton.onclick = () => {
          axios.put('/defend').then((res) => {
            if (res.data.game === 'lost') {
              alert(`Opponent did ${res.data.damage} damage! You're outta HP, man, you lost!`);
              window.location.reload();
            } else {
              alert(`Opponent did ${res.data.damage} damage!`);
              window.location.reload();
            }
          }).catch((error) => console.log(error));
        };

        endBattleButton.innerHTML = 'Flee and End Battle!';
        endBattleButton.onclick = () => {
          axios.put('/endBattle').then(() => {
            window.location.reload();
          }).catch((error) => console.log(error));
        };

        if (response.data.game_state.currentTurn === 'player') {
          document.getElementById('defend-button').disabled = true;
        } else if (response.data.game_state.currentTurn === 'opponent') {
          document.getElementById('attack-button').disabled = true;
        }
      }
    } }).catch((error) => console.log(error));
}

if (window.location.pathname === '/login') {
  loginButton.addEventListener('click', () => {
    axios.post('/login', {
      username: document.querySelector('#loginusername').value,
      password: document.querySelector('#loginpassword').value,
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => console.log(error));
  });

  signupButton.addEventListener('click', (event) => {
    event.preventDefault();
    const username = document.querySelector('#signupusername').value;
    const password = document.querySelector('#signuppassword').value;

    if (username === '') {
      alert('Please type in a username!');
    }

    if (password === '') {
      alert('Please type in a password!');
    }

    if (username !== '' && password !== '') {
      axios.post('/signup', {
        username,
        password,
      }).then((response) => {
        console.log(response.data);
        if (response.data.existingUser === true) {
          alert('Username exists! Please pick another username :)');
        }
        if (response.data.newUser === true) {
          alert('Signup successful! Please login to play! :)');
          window.location = '/login';
        }
      }).catch((error) => console.log(error));
    }
  });
}

// class Player {
//   constructor() {
//     this.hitPoints = 10
//   }

//   takeDamage(damage) {
//     if (this.hitPoints <= 0) {
//       return false;
//     }

//     return true;
//   }
// }

// class Game {
//   constructor() {
//     this.opponents = []
//     this.opponent = undefinedthis.player = new Player()
//   }
// }
