module.exports = {
  up: async (queryInterface) => {
    const usersList = [
      {
        username: 'chickfila',
        password: 'sh7!f9jH0hJD2#9F)_jshDsj',
        level: 1,
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, currentTurn: null, opponentLevel: null, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'spicynugz',
        password: '2dD2dFt4@9J8ngF8n)8c',
        level: 2,
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, currentTurn: null, opponentLevel: null, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'mcspicy',
        password: '7d)h@hd7fNmfK35Jsk%',
        level: 3,
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, currentTurn: null, opponentLevel: null, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'springchickz',
        password: 'pk(jd)2JS9jf*fgeJf*ng)2',
        level: 4,
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, currentTurn: null, opponentLevel: null, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Insert categories before items because items reference categories
    const users = await queryInterface.bulkInsert(
      'users',
      usersList,
      { returning: true },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
