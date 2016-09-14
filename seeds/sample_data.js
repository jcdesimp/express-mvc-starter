// created using `knex seed:make sample_data`

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('people').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('people').insert({id: 1, make: 'rowValue1'}),
        knex('people').insert({id: 2, make: 'rowValue2'}),
        knex('people').insert({id: 3, make: 'rowValue3'})
      ]);
    });
};
