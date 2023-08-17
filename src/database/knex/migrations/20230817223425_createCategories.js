exports.up = function (knex) {
  return knex.schema
    .createTable("categories", function (table) {
      table.increments("id").primary();
      table.text("name").notNullable().unique();
    })
    .then(function () {
      return knex.raw(`
      INSERT INTO categories (name)
      VALUES
        ("refeicao"),
        ("sobremesa"),
        ("doces"),
        ("bebidas")
    `);
    });
};

exports.down = (knex) => knex.schema.dropTableIfExists("categories");
