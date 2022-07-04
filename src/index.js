import './styles.css';

const headerDiv = document.createElement('div');
headerDiv.setAttribute('id', 'header-div');

const header = document.createElement('h1');
header.setAttribute('id', 'header');
header.textContent = 'Combat Chicks';

const gameDiv = document.createElement('div');
gameDiv.setAttribute('id', 'game-div');

const gameStatus = document.createElement('p');
gameStatus.setAttribute('id', 'game-status');

const mainImage = document.createElement('img');
mainImage.setAttribute('id', 'main-image');

const battleDiv = document.createElement('div');
battleDiv.setAttribute('id', 'battle-div');

const playerBox = document.createElement('span');
playerBox.setAttribute('id', 'player-box');

const playerInfo = document.createElement('p');
playerInfo.setAttribute('id', 'player-info');

const playerHealthBar = document.createElement('progress');
playerHealthBar.setAttribute('id', 'player-health-bar');

const playerCanvas = document.createElement('CANVAS');
playerCanvas.setAttribute('id', 'player-canvas');
const playerContext = playerCanvas.getContext('2d');

const opponentBox = document.createElement('span');
opponentBox.setAttribute('id', 'opponent-box');

const opponentInfo = document.createElement('p');
opponentInfo.setAttribute('id', 'opponent-info');

const opponentHealthBar = document.createElement('progress');
opponentHealthBar.setAttribute('id', 'opponent-health-bar');

const opponentCanvas = document.createElement('CANVAS');
opponentCanvas.setAttribute('id', 'opponent-canvas');
const opponentContext = opponentCanvas.getContext('2d');

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

const spriteAnimations = {
  eggAttack: {
    loc: [
      { x: 820, y: 410 },
      { x: 1230, y: 410 },
    ],
  },
  eggDefend: {
    loc: [
      { x: 0, y: 410 },
      { x: 410, y: 410 },
    ],
  },
  eggIdle: {
    loc: [
      { x: 0, y: 405 },
      { x: 0, y: 415 },
    ],
  },
  eggChickAttack: {
    loc: [
      { x: 820, y: 820 },
      { x: 1230, y: 820 },
    ],
  },
  eggChickDefend: {
    loc: [
      { x: 0, y: 820 },
      { x: 410, y: 820 },
    ],
  },
  eggChickIdle: {
    loc: [
      { x: 0, y: 815 },
      { x: 0, y: 825 },
    ],
  },
  chickAttack: {
    loc: [
      { x: 820, y: 0 },
      { x: 1230, y: 0 },
    ],
  },
  chickDefend: {
    loc: [
      { x: 0, y: 0 },
      { x: 410, y: 0 },
    ],
  },
  chickIdle: {
    loc: [
      { x: 0, y: 5 },
      { x: 0, y: 0 },
    ],
  },
  roosterAttack: {
    loc: [
      { x: 820, y: 1230 },
      { x: 1230, y: 1230 },
    ],
  },
  roosterDefend: {
    loc: [
      { x: 0, y: 1230 },
      { x: 410, y: 1230 },
    ],
  },
  roosterIdle: {
    loc: [
      { x: 0, y: 1225 },
      { x: 0, y: 1235 },
    ],
  },
};

const playerImage = new Image();
playerImage.src = 'combatchicks-spritesheet.png';
const opponentImage = new Image();
opponentImage.src = 'combatchicks-spritesheet.png';

const width = playerCanvas.width = opponentCanvas.width = 205;
const height = playerCanvas.height = opponentCanvas.height = 205;
const frameWidth = 410;
const frameHeight = 410;
const xPos = 0;
const yPos = 0;
const scale = 0.5;
let playerCharacter = '';
let opponentCharacter = '';
let playerX = 0;
let playerY = 0;
let opponentX = 0;
let opponentY = 0;
let playerFrameCount = 0;
let opponentFrameCount = 0;
let playerCount = 0;
let opponentCount = 0;
let playerReqAnimaFrame;
let opponentReqAnimaFrame;

if (window.location.pathname === '/') {
  headerDiv.appendChild(header);
  document.body.appendChild(headerDiv);
  document.body.appendChild(gameDiv);
  document.body.appendChild(battleDiv);
  document.body.appendChild(gameButtons);
  axios.get('/playerInfo').then((response) => {
    gameButtons.appendChild(loginOrLogout);
    if (response.data.loggedIn === 'false') {
      mainImage.src = 'mainchick.png';
      gameDiv.appendChild(mainImage);
      gameDiv.appendChild(gameStatus);
      gameStatus.innerHTML = 'Welcome! Please log in or sign up to play!';
      loginOrLogout.innerHTML = 'Log in / Sign up';
      loginOrLogout.addEventListener('click', () => {
        window.location.pathname = '/login';
      });
    } else if (response.data.loggedIn === 'true') {
      gameButtons.removeChild(loginOrLogout);
      gameDiv.appendChild(gameStatus);
      gameDiv.appendChild(playerCanvas);
      loginOrLogout.innerHTML = 'Logout';
      loginOrLogout.addEventListener('click', () => {
        window.location.pathname = '/logout';
        axios.get('/logout').catch((error) => console.log(error)); });
      if (response.data.level === 1) {
        playerCharacter = 'eggIdle';
      } else if (response.data.level === 2) {
        playerCharacter = 'eggChickIdle';
      } else if (response.data.level === 3) {
        playerCharacter = 'chickIdle';
      } else if (response.data.level === 4) {
        playerCharacter = 'roosterIdle';
      }
      playerX = spriteAnimations[playerCharacter].loc[0].x;
      playerY = spriteAnimations[playerCharacter].loc[0].y;
      const animatePlayer = () => {
        playerContext.clearRect(0, 0, width, height);
        playerContext.drawImage(playerImage, playerX, playerY, frameWidth, frameHeight, xPos, yPos, frameWidth * scale, frameHeight * scale);
        playerCount += 1;
        if (playerCount > 30) {
          playerX = spriteAnimations[playerCharacter].loc[playerFrameCount].x;
          playerY = spriteAnimations[playerCharacter].loc[playerFrameCount].y;
          playerFrameCount += 1;
          playerCount = 0;
          console.log(playerCount, 'playercount!!!');
        }
        if (playerFrameCount > 1) {
          playerFrameCount = 0;
        }
        playerReqAnimaFrame = requestAnimationFrame(animatePlayer);
        console.log('bounce animation');
      };
      if (response.data.game_state.status === 'inactive') {
        gameStatus.innerHTML = `Welcome, ${response.data.username}!<br>You are currently level ${response.data.level}<br>You have played ${response.data.game_state.gameStats.played} games in total, won ${response.data.game_state.gameStats.won} games and lost ${response.data.game_state.gameStats.lost} games so far`;
        animatePlayer();
        battleButton.innerHTML = 'Battle!';
        battleButton.onclick = () => {
          axios.put('/battle').then(() => {
            window.location.reload();
          }).catch((error) => console.log(error));
        };
        gameButtons.appendChild(battleButton);
        gameButtons.appendChild(loginOrLogout);
      } else if (response.data.game_state.status === 'active') {
        console.log('battle active');
        gameStatus.innerHTML = 'Battle-in-progress!';
        battleDiv.appendChild(playerBox);
        battleDiv.appendChild(opponentBox);
        playerBox.appendChild(playerInfo);
        playerBox.appendChild(playerHealthBar);
        playerBox.appendChild(playerCanvas);
        opponentBox.appendChild(opponentInfo);
        opponentBox.appendChild(opponentHealthBar);
        opponentBox.appendChild(opponentCanvas);
        gameButtons.appendChild(attackButton);
        gameButtons.appendChild(defendButton);
        gameButtons.appendChild(endBattleButton);
        gameButtons.appendChild(loginOrLogout);
        playerInfo.innerHTML = `${response.data.username}<br>Level ${response.data.level}<br>${response.data.game_state.health.player} HP`;
        playerHealthBar.value = response.data.game_state.health.player;
        playerHealthBar.max = response.data.game_state.health.player;
        opponentInfo.innerHTML = `${response.data.game_state.currentOpponent}<br>Level ${response.data.game_state.opponentLevel}<br>${response.data.game_state.health.opponent} HP`;
        opponentHealthBar.value = response.data.game_state.health.opponent;
        opponentHealthBar.max = response.data.game_state.health.opponent;
        if (response.data.game_state.opponentLevel === 1) {
          opponentCharacter = 'eggIdle';
        } else if (response.data.game_state.opponentLevel === 2) {
          opponentCharacter = 'eggChickIdle';
        } else if (response.data.game_state.opponentLevel === 3) {
          opponentCharacter = 'chickIdle';
        } else if (response.data.game_state.opponentLevel === 4) {
          opponentCharacter = 'roosterIdle';
        }

        opponentX = spriteAnimations[opponentCharacter].loc[0].x;
        opponentY = spriteAnimations[opponentCharacter].loc[0].y;
        const animateOpponent = () => {
          opponentContext.clearRect(0, 0, width, height);
          opponentContext.drawImage(opponentImage, opponentX, opponentY, frameWidth, frameHeight, xPos, yPos, frameWidth * scale, frameHeight * scale);
          opponentCount++;
          if (opponentCount > 30) {
            opponentX = spriteAnimations[opponentCharacter].loc[opponentFrameCount].x;
            opponentY = spriteAnimations[opponentCharacter].loc[opponentFrameCount].y;
            opponentFrameCount += 1;
            opponentCount = 0;
          }
          if (opponentFrameCount > 1) {
            opponentFrameCount = 0;
          }
          opponentReqAnimaFrame = requestAnimationFrame(animateOpponent);
        };
        animateOpponent();
        animatePlayer();
        attackButton.innerHTML = 'Attack!';
        attackButton.onclick = () => {
          document.getElementById('attack-button').disabled = true;
          document.getElementById('defend-button').disabled = false;
          axios.put('/attack').then((res) => {
            cancelAnimationFrame(playerReqAnimaFrame);
            cancelAnimationFrame(opponentReqAnimaFrame);
            playerCharacter = playerCharacter.replace('Idle', 'Attack');
            opponentCharacter = opponentCharacter.replace('Idle', 'Defend');
            animatePlayer();
            animateOpponent();
            let message = '';
            if (res.data.game === 'won') {
              message = `You did ${res.data.damage} damage!<br>You won the battle and levelled up!`;
              opponentInfo.innerHTML = `${res.data.game_state.currentOpponent}<br>Level ${res.data.game_state.opponentLevel}<br>0 HP`;
              opponentHealthBar.value = 0;
              setTimeout(() => { window.location.reload(); }, 5000);
            } else if (res.data.game === 'reborn') {
              message = `You did ${res.data.damage} damage!<br>You won the battle and you are reborn as an egg!<br>Back to level 1 :P`;
              opponentInfo.innerHTML = `${res.data.game_state.currentOpponent}<br>Level ${res.data.game_state.opponentLevel}<br>0 HP`;
              opponentHealthBar.value = 0;
              setTimeout(() => { window.location.reload(); }, 5000);
            } else {
              message = `You did ${res.data.damage} damage!`;
              opponentInfo.innerHTML = `${res.data.game_state.currentOpponent}<br>Level ${res.data.game_state.opponentLevel}<br>${res.data.game_state.health.opponent} HP`;
              opponentHealthBar.value = res.data.game_state.health.opponent;
            }
            gameStatus.innerHTML = message;

            setTimeout(() => {
              cancelAnimationFrame(playerReqAnimaFrame);
              cancelAnimationFrame(opponentReqAnimaFrame);
              playerCharacter = playerCharacter.replace('Attack', 'Idle');
              opponentCharacter = opponentCharacter.replace('Defend', 'Idle');
              animatePlayer();
              animateOpponent();
            }, 2000);
          }).catch((error) => console.log(error));
        };

        defendButton.innerHTML = 'Defend!';
        defendButton.onclick = () => {
          document.getElementById('attack-button').disabled = false;
          document.getElementById('defend-button').disabled = true;
          axios.put('/defend').then((res) => {
            cancelAnimationFrame(playerReqAnimaFrame);
            cancelAnimationFrame(opponentReqAnimaFrame);
            playerCharacter = playerCharacter.replace('Idle', 'Defend');
            opponentCharacter = opponentCharacter.replace('Idle', 'Attack');
            animatePlayer();
            animateOpponent();
            let message = '';
            if (res.data.game === 'lost') {
              message = `Opponent did ${res.data.damage} damage!<br>You\'re outta HP!<br>You lost!`;
              playerInfo.innerHTML = `${res.data.username}<br>Level ${res.data.level}<br>0 HP`;
              playerHealthBar.value = 0;
              setTimeout(() => { window.location.reload(); }, 5000);
            } else {
              message = `Opponent did ${res.data.damage} damage!`;
              playerInfo.innerHTML = `${res.data.username}<br>Level ${res.data.level}<br>${res.data.game_state.health.player} HP`;
              playerHealthBar.value = res.data.game_state.health.player;
            }
            gameStatus.innerHTML = message;
            setTimeout(() => {
              cancelAnimationFrame(playerReqAnimaFrame);
              cancelAnimationFrame(opponentReqAnimaFrame);
              playerCharacter = playerCharacter.replace('Defend', 'Idle');
              opponentCharacter = opponentCharacter.replace('Attack', 'Idle');
              animatePlayer();
              animateOpponent();
            }, 2000);
          }).catch((error) => console.log(error));
        };

        endBattleButton.innerHTML = 'Flee and End Battle!';
        endBattleButton.onclick = () => {
          if (Math.floor(Math.random() * 2) === 0) {
            gameStatus.innerHTML = 'Yikes!<br> Opponent refused to let you leave!';
          } else {
            axios.put('/endBattle').then(() => {
              gameStatus.innerHTML = 'You managed to escape the battle!';
              setTimeout(() => { window.location.reload(); }, 2000);
            }).catch((error) => console.log(error));
          }
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
