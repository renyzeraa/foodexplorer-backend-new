//conforme o cliente envia do front, vai add os novos no backend
exports.up = function (knex) {
  return knex.schema
    .createTable("ingredients", function (table) {
      table.increments("id").primary();
      table.text("name").notNullable().unique();
    })
    .then(function () {
      return knex.raw(`
      INSERT INTO ingredients (name)
      VALUES
        ("pão"),
        ("cheddar"),
        ("alho"),
        ("cebola"),
        ("sal"),
        ("tomate"),
        ("maionese"),
        ("pepino"),
        ("carne moida"),
        ("queijo"),
        ("picanha"),
        ("molho de tomate"),
        ("muçarela"),
        ("presunto"),
        ("calabresa"),
        ("azeitona"),
        ("orégano"),
        ("azeite de oliva"),
        ("manjericão"),
        ("requeijão"),
        ("mussarela de búfala"),
        ("tomate seco"),
        ("atum"),
        ("milho"),
        ("catupiry"),
        ("pimentão"),
        ("linguiça"),
        ("ovo"),
        ("brócolis"),
        ("palmito"),
        ("ervilha"),
        ("pimenta calabresa"),
        ("queijo gorgonzola"),
        ("azeitona preta"),
        ("rúcula"),
        ("frango"),
        ("abacaxi"),
        ("camarão"),
    `);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("ingredients");
};
