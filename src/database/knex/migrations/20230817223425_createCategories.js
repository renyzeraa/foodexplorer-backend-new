exports.up = function (knex) {
  return knex.schema
    .createTable("category", function (table) {
      table.increments("id").primary();
      table.text("name").notNullable().unique();
    })
    .then(function () {
      return knex.raw(`
      INSERT INTO category (name)
      VALUES
        ("refeicao"),
        ("sobremesa"),
        ("doces"),
        ("bebidas")
    `);
    });
};

exports.down = (knex) => knex.schema.dropTableIfExists("category");
