module.exports = {
  up: async (queryInterface) => {
    const usersList = [
      {
        username: 'chickfila',
        password: 'password123',
        level: 1,
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, currentTurn: null, opponentLevel: 1, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'spicynugz',
        password: 'password123',
        level: 2,
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, currentTurn: null, opponentLevel: 1, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'mcspicy',
        password: 'password123',
        level: 3,
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, currentTurn: null, opponentLevel: 1, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'springchickz',
        password: 'password123',
        level: 4,
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, currentTurn: null, opponentLevel: 1, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
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
