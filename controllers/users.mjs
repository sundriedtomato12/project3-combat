import { request, response } from 'express';
import jsSHA from 'jssha';

export default function initUsersController(db) {
  const getPlayer = async (req, res) => {
    if (req.cookies.userId !== undefined) {
      try {
        const player = await db.User.findOne({
          where: {
            id: req.cookies.userId,
          },
        });
        const playerInfo = {
          id: player.id,
          username: player.username,
          game_state: player.game_state,
          loggedIn: req.cookies.loggedIn,
        };
        console.log('player info');
        console.log(playerInfo);
        res.json(playerInfo);
      }
      catch (error) {
        console.log(error);
      }
    } else {
      res.json(
        {
          loggedIn: 'false',
        },
      );
    }
  };

  const root = async (req, res) => {
    let loggedIn;
    if (req.cookies.loggedIn === true) {
      loggedIn = true;
    } else {
      loggedIn = false;
    }
    res.render('main', { loggedIn });
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

      if (playerInfo === null) {
        res.send('<h1>There was an error! Please try logging in again.<br><a href="/login">Login Page</a></h1>');
      } else if (playerInfo != null) {
        if (req.body.loginpassword === playerInfo.password) {
          res.cookie('loggedIn', true);
          res.cookie('userId', playerInfo.id);
          res.redirect('/');
        } else {
          res.send('<h1>There was an error! Please try logging in again.<br><a href="/login">Login Page</a></h1>');
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const signup = async (req, res) => {
    console.log(req.body);
    try {
      const [user, created] = await db.User.findOrCreate({
        where: {
          username: req.body.username,
        },
        defaults: {
          password: req.body.password,
          game_state: {
            status: 'inactive', currentOpponent: null, level: { player: 1, opponent: 1 }, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
          },
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      if (created) {
        console.log('new user', user);
        res.json({ newUser: true });
      } else if (user) {
        console.log('existing user', user);
        res.json({ existingUser: true });
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

  const battle = async (req, res) => {
    try {
      const player = await db.User.findOne({
        where: {
          id: req.cookies.userId,
        },
      });

      const updatedPlayer = await player.update({
        game_state: {
          status: 'active', currentOpponent: null, level: { player: player.game_state.level.player, opponent: player.game_state.level.opponent }, health: { player: player.game_state.level.player * 100, opponent: player.game_state.level.opponent * 100 }, gameStats: { played: player.game_state.gameStats.played, won: player.game_state.gameStats.won, lost: player.game_state.gameStats.lost },
        },
        updated_at: new Date(),
      });

      const playerInfo = {
        id: updatedPlayer.id,
        username: updatedPlayer.username,
        game_state: updatedPlayer.game_state,
        loggedIn: req.cookies.loggedIn,
      };

      res.json(playerInfo);
    }
    catch (error) {
      console.log(error);
    }
  };

  const damage = (healthPoints) => Math.floor(Math.random() * healthPoints) + 1;

  const attack = async (req, res) => {
    try {
      const player = await db.User.findOne({
        where: {
          id: req.cookies.userId,
        },
      });

      const damageDone = damage(player.game_state.health.opponent);
      let newHealth;
      if (damageDone >= player.game_state.health.opponent) {
        newHealth = null;
      } else {
        newHealth = player.game_state.health.opponent - damageDone;
      }

      const updatedPlayer = await player.update({
        game_state: {
          status: 'active', currentOpponent: player.game_state.currentOpponent, level: { player: player.game_state.level.player, opponent: player.game_state.level.opponent }, health: { player: player.game_state.health.player, opponent: newHealth }, gameStats: { played: player.game_state.gameStats.played, won: player.game_state.gameStats.won, lost: player.game_state.gameStats.lost },
        },
        updated_at: new Date(),
      });

      const playerInfo = {
        id: updatedPlayer.id,
        username: updatedPlayer.username,
        game_state: updatedPlayer.game_state,
        damage: damageDone,
        loggedIn: req.cookies.loggedIn,
      };

      res.json(playerInfo);
    }
    catch (error) {
      console.log(error);
    }
  };

  return {
    root, loginpage, login, signup, logout, getPlayer, battle, attack,
  };
}
