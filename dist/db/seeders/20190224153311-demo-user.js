'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
       Example: 
    */
    return queryInterface.bulkInsert('Users', [{
      fullName: 'Admin PangeaMT',
      password: 'admin',
      email: 'info@pangeamt.com'
    }], {});
  },
  down: function down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
       Example: 
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};