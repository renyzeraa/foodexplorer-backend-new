exports.up = (knex) =>
  knex.schema.createTable("plates", (table) => {
    table.increments("id");
    table.text("title").notNullable();
    table.text("description");
    table.text("ingredients");
    table.varchar("picture").default(null);
    table.float("value");
    table.integer("user_id").unsigned().notNullable();
    table.integer("category_id").unsigned();
    table.foreign("user_id").references("users.id");
    table
      .foreign("category_id")
      .references("category.id")
      .onDelete("CASCADE");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTableIfExists("plates");
