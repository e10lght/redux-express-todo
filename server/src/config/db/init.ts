import { Users, initUsersModel } from '../../models/Users';
import { Tasks, initTasksModel } from '../../models/Tasks';
import { sequelize } from './sequelize.config';

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
