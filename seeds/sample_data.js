// created using `knex seed:make sample_data`

exports.seed = (knex, Promise) =>
  // Deletes ALL existing entries
  knex('people').del()
    .then(() =>
      Promise.all([
        // Inserts seed entries
        knex('people').insert({ id: 1, make: 'rowValue1' }),
        knex('people').insert({ id: 2, make: 'rowValue2' }),
        knex('people').insert({ id: 3, make: 'rowValue3' }),
      ]),
    );
