const headerDiv = document.createElement('div');
headerDiv.setAttribute('id', 'header-div');

const header = document.createElement('h1');
header.setAttribute('id', 'header');
header.textContent = 'Combat Chicks';

const gameDiv = document.createElement('div');
gameDiv.setAttribute('id', 'game-div');

const gameStats = document.createElement('p');
gameStats.setAttribute('id', 'game-stats');

const gameButtons = document.createElement('div');
gameButtons.setAttribute('id', 'game-buttons');

const loginOrLogout = document.createElement('a');
loginOrLogout.setAttribute('id', 'login-or-logout');

const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('login-or-logout');

if (window.location.pathname === '/') {
  document.body.appendChild(headerDiv);
  headerDiv.appendChild(header);
  document.body.appendChild(gameDiv);
  gameDiv.appendChild(gameStats);
  document.body.appendChild(gameButtons);

  axios.get('/playerInfo').then((response) => {
    console.log('response data!!');
    console.log(response.data);
    gameButtons.appendChild(loginOrLogout);
    if (response.data.loggedIn === 'false') {
      gameStats.innerHTML = 'Welcome! Please log in to play!';
      loginOrLogout.innerHTML = 'Login';
      loginOrLogout.href = '/login';
    } else {
      gameStats.innerHTML = `Welcome, ${response.data.username}!`;
      loginOrLogout.innerHTML = 'Logout';
      loginOrLogout.href = '/logout';
      logoutButton.addEventListener('click', () => {
        axios.get('/logout').catch((error) => console.log(error)); });
    }
  }).catch((error) => console.log(error));
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
