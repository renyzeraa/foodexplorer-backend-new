//conforme o cliente envia do front, vai add os novos no backend
exports.up = function (knex) {
  return knex.schema
    .createTable("ingredients", function (table) {
      table.increments("id").primary();
      table.text("name").notNullable().unique();
    })
    .then(function () {
      //inserir alguns valores inicias, porém sera adicionado mais conforme o usuário informe novos.
      return knex.raw(`
      INSERT INTO ingredients (name)
      VALUES
        ("alho"),
        ("cebola"),
        ("sal"),
        ("tomate"),
        ("maionese"),
        ("pepino"),
        ("queijo"),
        ("molho de tomate"),
        ("muçarela"),
        ("presunto"),
        ("calabresa"),
        ("azeitona"),
        ("orégano"),
        ("azeite de oliva"),
        ("requeijão"),
        ("milho"),
        ("linguiça"),
        ("ovo"),
        ("brócolis"),
        ("palmito"),
        ("ervilha"),
        ("frango"),
        ("abacaxi")
    `);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("ingredients");
};
