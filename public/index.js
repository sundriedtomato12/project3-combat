console.log('hello');

const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logout-button');

loginButton.addEventListener('click', () => {
  axios.post('/login', {
    username: document.querySelector('#loginusername').value,
    password: document.querySelector('#loginpassword').value,
  }).then((response) => {
    console.log(response.data);
  });
}).catch((error) => console.log(error));

signupButton.addEventListener('click', () => {
  axios.post('/signup', {
    username: document.querySelector('#signupusername').value,
    password: document.querySelector('#signuppassword').value,
  }).then((response) => {
    console.log(response.data);
  });
}).catch((error) => console.log(error));

logoutButton.addEventListener('click', () => {
  axios.get('/logout').catch((error) => console.log(error)); });
