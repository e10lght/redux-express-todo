import { Sequelize } from 'sequelize';
import { Users, initUsersModel } from '../../models/Users';
import { Tasks, initTasksModel } from '../../models/Tasks';
import { DB_CONFIG } from '../config';

export const sequelize = new Sequelize(
  DB_CONFIG.name,
  DB_CONFIG.userName,
  DB_CONFIG.pass,
  {
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    dialect: DB_CONFIG.dialect,
    logging: DB_CONFIG.logging,
    dialectOptions: {
      useUTC: false
    },
    timezone: '+09:00'
  }
);

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
