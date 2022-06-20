module.exports = {
  up: async (queryInterface) => {
    const usersList = [
      {
        username: 'chickfila',
        password: 'password123',
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, level: { player: 1, opponent: 1 }, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'spicynugz',
        password: 'password123',
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, level: { player: 2, opponent: 2 }, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'mcspicy',
        password: 'password123',
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, level: { player: 3, opponent: 3 }, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'springchickz',
        password: 'password123',
        game_state: JSON.stringify({
          status: 'inactive', currentOpponent: null, level: { player: 4, opponent: 4 }, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
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
