export default function userModel(sequelize, DataTypes) {
  return sequelize.define(
    'user',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      game_state: {
        type: DataTypes.JSON,
        defaultValue: {
          status: 'inactive', currentOpponent: null, level: { player: 1, opponent: 1 }, health: { player: null, opponent: null }, gameStats: { played: 0, won: 0, lost: 0 },
        },
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
    },
  );
}
