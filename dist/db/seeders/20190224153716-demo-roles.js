'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
       Example:
    */
    return queryInterface.bulkInsert('Roles', [{
      name: 'Admin'
    }, {
      name: 'Client'
    }, {
      name: 'User'
    }], {});
  },
  down: function down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
       Example:
    */
    return queryInterface.bulkDelete('Roles', null, {});
  }
};