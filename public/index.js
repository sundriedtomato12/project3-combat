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
        gameStats.innerHTML = `Welcome, ${response.data.username}!<br>You are currently level ${response.data.game_state.level.player}<br>You have played ${response.data.game_state.gameStats.played} games in total and won ${response.data.game_state.gameStats.won} games so far`;

        battleButton.innerHTML = 'Battle!';
        battleButton.onclick = () => {
          axios.put('/battle').then((res) => {
            console.log(res.data);
            gameStats.innerHTML = 'Battle begins!';
            battleDiv.appendChild(playerBox);
            battleDiv.appendChild(opponentBox);
            playerBox.appendChild(playerInfo);
            opponentBox.appendChild(opponentInfo);
            playerInfo.innerHTML = response.data.username;
          });
        };
        gameButtons.appendChild(battleButton);
      } else if (response.data.game_state.status === 'active') {
        console.log('battle active');
        gameStats.innerHTML = 'Battle-in-progress!';
        battleDiv.appendChild(playerBox);
        battleDiv.appendChild(opponentBox);
        playerBox.appendChild(playerInfo);
        opponentBox.appendChild(opponentInfo);
        playerInfo.innerHTML = response.data.username;
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
