exports.up = (knex) =>
  knex.schema.createTable("favorite_plates", (table) => {
    table.increments("id");
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id");
    table.integer("plate_id").unsigned().notNullable();
    table.foreign("plate_id").references("plates.id");
    table.timestamp("created_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("favorite_plates");
