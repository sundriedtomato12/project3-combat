import { request, response } from 'express';
import jsSHA from 'jssha';

export default function initUsersController(db) {
  const root = (req, res) => {
    res.render('main', { loggedIn: req.cookies.loggedIn });
  };

  const loginpage = (req, res) => {
    console.log(req.cookies.loggedIn);
    res.render('login');
  };

  const login = async (req, res) => {
    try {
      const playerInfo = await db.User.findOne({
        where: {
          username: req.body.loginusername,
        },
      });

      console.log('user', playerInfo);

      if (req.body.loginpassword === playerInfo.password) {
        res.cookie('loggedIn', true);
        res.cookie('userId', playerInfo.id);
        res.redirect('/');
      } else {
        res.send('<h1>There was an error! Please try logging in again.<br><a href="/login">Login Page</a></h1>');
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const signup = async (req, res) => {
    try {
      const [user, created] = await db.User.findOrCreate({
        where: {
          username: req.body.signupusername,
        },
        defaults: {
          password: req.body.signuppassword,
          game_state: JSON.stringify({
            status: 'inactive', currentOpponent: null, level: { player: 1, opponent: 1 }, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
          }),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      if (created) {
        console.log('new user', user);
        res.send('<h1>Sign up successful! Please login to play<br><a href="/login">Login Page</a></h1>');
      } else if (user) {
        console.log('existing user', user);
        res.send('<h1>Username exists! Please use another username<br><a href="/login">Login Page</a></h1>');
      }
    }

    catch (error) {
      console.log(error);
    }
  };

  const logout = async (req, res) => {
    res.clearCookie('userId');
    res.clearCookie('loggedIn');
    res.redirect('/');
  };

  return {
    root, loginpage, login, signup, logout,
  };
}
