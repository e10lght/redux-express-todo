import { Sequelize } from 'sequelize';
import { Users, initUsersModel } from '../../models/Users';
import { Tasks, initTasksModel } from '../../models/Tasks';

export const sequelize = new Sequelize('postgres', 'postgres', 'passw0rd', {
  host: '127.0.0.1',
  port: 5436,
  dialect: 'postgres',
  logging: false
});

const setupAssociations = () => {
  Users.hasMany(Tasks, { foreignKey: 'user_id' });
  Tasks.belongsTo(Users, { foreignKey: 'user_id' });
};

initUsersModel(sequelize);
initTasksModel(sequelize);
setupAssociations();

// const recreateForceTable = () => {
//   Tasks.sync({ force: true })
//     .then(() => {
//       console.log('Student table has been successfully recreated.');
//     })
//     .catch(error => {
//       console.error('Error recreating Student table:', error);
//     });
// };
// recreateForceTable();