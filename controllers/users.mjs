import express from 'express';
import jsSHA from 'jssha';
import { resolve } from 'path';

const SALT = 'ILOVECHICKEN';

export const generateHash = (string) => {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const unhashedCookieString = `${string}-${SALT}`;
  shaObj.update(unhashedCookieString);
  const hashedCookieString = shaObj.getHash('HEX');
  return hashedCookieString;
};

// compare value between two hasesh, return true/false
export const verifyHash = (input, hashExpected) => {
  const hashedInput = generateHash(input);
  return hashedInput === hashExpected;
};

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
          level: player.level,
          game_state: player.game_state,
          loggedIn: 'true',
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
    if (req.cookies.loggedIn !== undefined) {
      loggedIn = 'true';
    } else {
      loggedIn = 'false';
    }
    res.sendFile(resolve('dist', 'main.html'));
    // res.render('main', { loggedIn });
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
        if (verifyHash(req.body.loginpassword, playerInfo.password)) {
          res.cookie('loggedIn', 'true');
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
          password: generateHash(req.body.password),
          level: 1,
          game_state: {
            status: 'inactive', currentOpponent: null, currentTurn: null, opponentLevel: 1, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
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

      const opponents = await db.User.findAll({
        attributes: ['username'],
        where: { level: player.level },
      });

      const opponentArray = [];

      for (let i = 0; i < opponents.length; i += 1) {
        if (opponents[i].username !== player.username) {
          opponentArray.push(opponents[i].username);
        }
      }

      console.log('opponent array:');
      console.log(opponentArray);

      const opponentName = opponentArray[Math.floor(Math.random() * opponentArray.length)];
      console.log('opponent name:');
      console.log(opponentName);

      const opponentInfo = await db.User.findOne({
        where: { username: opponentName },
      });

      const updatedPlayer = await player.update({
        game_state: {
          status: 'active', currentOpponent: opponentName, currentTurn: 'player', opponentLevel: opponentInfo.level, health: { player: player.level * 100, opponent: opponentInfo.level * 100 }, gameStats: { played: player.game_state.gameStats.played, won: player.game_state.gameStats.won, lost: player.game_state.gameStats.lost },
        },
        updated_at: new Date(),
      });

      res.json(updatedPlayer);
    }
    catch (error) {
      console.log(error);
    }
  };

  const endBattle = async (req, res) => {
    try {
      const player = await db.User.findOne({
        where: {
          id: req.cookies.userId,
        },
      });

      const updatedPlayer = await player.update({
        game_state: {
          status: 'inactive', currentOpponent: null, currentTurn: null, opponentLevel: null, health: { player: null, opponent: null }, gameStats: { played: player.game_state.gameStats.played, won: player.game_state.gameStats.won, lost: player.game_state.gameStats.lost },
        },
        updated_at: new Date(),
      });

      res.json(updatedPlayer);
    }
    catch (error) {
      console.log(error);
    }
  };

  const damage = (healthPoints) => {
    const damageDone = Math.floor(Math.random() * (healthPoints * 0.75)) + 10;
    return damageDone;
  };

  const attack = async (req, res) => {
    try {
      const player = await db.User.findOne({
        where: {
          id: req.cookies.userId,
        },
      });

      const damageDone = damage(player.game_state.health.opponent);
      console.log('damage:');
      console.log(damageDone);
      let newHealth = 0;
      if (damageDone >= player.game_state.health.opponent) {
        newHealth = null;
      } else {
        newHealth = player.game_state.health.opponent - damageDone;
      }

      if (newHealth !== null) {
        const updatedPlayer = await player.update({
          game_state: {
            status: 'active', currentOpponent: player.game_state.currentOpponent, currentTurn: 'opponent', opponentLevel: player.game_state.opponentLevel, health: { player: player.game_state.health.player, opponent: newHealth }, gameStats: { played: player.game_state.gameStats.played, won: player.game_state.gameStats.won, lost: player.game_state.gameStats.lost },
          },
          updated_at: new Date(),
        });

        const playerInfo = {
          id: updatedPlayer.id,
          username: updatedPlayer.username,
          game_state: updatedPlayer.game_state,
          damage: damageDone,
          game: 'ongoing',
          loggedIn: req.cookies.loggedIn,
        };

        res.json(playerInfo);
      } else if (newHealth === null && player.level !== 4) {
        const updatedPlayer = await player.update({
          level: player.level + 1,
          game_state: {
            status: 'inactive', currentOpponent: player.game_state.currentOpponent, currentTurn: null, opponentLevel: player.game_state.opponentLevel, health: { player: 0, opponent: 0 }, gameStats: { played: player.game_state.gameStats.played + 1, won: player.game_state.gameStats.won + 1, lost: player.game_state.gameStats.lost },
          },
          updated_at: new Date(),
        });

        const playerInfo = {
          id: updatedPlayer.id,
          username: updatedPlayer.username,
          game_state: updatedPlayer.game_state,
          damage: damageDone,
          game: 'won',
          loggedIn: req.cookies.loggedIn,
        };

        res.json(playerInfo);
      } else if (newHealth === null && player.level === 4) {
        const updatedPlayer = await player.update({
          level: 1,
          game_state: {
            status: 'inactive', currentOpponent: player.game_state.currentOpponent, currentTurn: null, opponentLevel: player.game_state.opponentLevel, health: { player: 0, opponent: 0 }, gameStats: { played: player.game_state.gameStats.played + 1, won: player.game_state.gameStats.won + 1, lost: player.game_state.gameStats.lost },
          },
          updated_at: new Date(),
        });

        const playerInfo = {
          id: updatedPlayer.id,
          username: updatedPlayer.username,
          game_state: updatedPlayer.game_state,
          damage: damageDone,
          game: 'reborn',
          loggedIn: req.cookies.loggedIn,
        };

        res.json(playerInfo);
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const defend = async (req, res) => {
    try {
      const player = await db.User.findOne({
        where: {
          id: req.cookies.userId,
        },
      });

      const damageDone = damage(player.game_state.health.player);
      console.log('damage:');
      console.log(damageDone);
      let newHealth = 0;

      if (damageDone >= player.game_state.health.player) {
        newHealth = null;
      } else {
        newHealth = player.game_state.health.player - damageDone;
      }

      if (newHealth !== null) {
        const updatedPlayer = await player.update({
          game_state: {
            status: 'active', currentOpponent: player.game_state.currentOpponent, currentTurn: 'player', opponentLevel: player.game_state.opponentLevel, health: { player: newHealth, opponent: player.game_state.health.opponent }, gameStats: { played: player.game_state.gameStats.played, won: player.game_state.gameStats.won, lost: player.game_state.gameStats.lost },
          },
          updated_at: new Date(),
        });

        const playerInfo = {
          id: updatedPlayer.id,
          level: updatedPlayer.level,
          username: updatedPlayer.username,
          game_state: updatedPlayer.game_state,
          damage: damageDone,
          game: 'ongoing',
          loggedIn: req.cookies.loggedIn,
        };

        res.json(playerInfo);
      } else {
        const updatedPlayer = await player.update({
          game_state: {
            status: 'inactive', currentOpponent: player.game_state.currentOpponent, currentTurn: null, opponentLevel: player.game_state.opponentLevel, health: { player: 0, opponent: 0 }, gameStats: { played: player.game_state.gameStats.played + 1, won: player.game_state.gameStats.won, lost: player.game_state.gameStats.lost + 1 },
          },
          updated_at: new Date(),
        });

        const playerInfo = {
          id: updatedPlayer.id,
          username: updatedPlayer.username,
          level: updatedPlayer.level,
          game_state: updatedPlayer.game_state,
          damage: damageDone,
          game: 'lost',
          loggedIn: req.cookies.loggedIn,
        };

        res.json(playerInfo);
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  return {
    root, loginpage, login, signup, logout, getPlayer, battle, attack, endBattle, defend,
  };
}
