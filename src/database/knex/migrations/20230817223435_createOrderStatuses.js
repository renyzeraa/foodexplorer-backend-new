exports.up = async knex => {
  await knex.schema.createTable('order_statuses', table => {
    table.increments('id')
    table.string('status').notNullable()
  })

  await knex('order_statuses').insert([
    { status: 'Pendente' },
    { status: 'Preparando' },
    { status: 'Entregue' }
  ])
}

exports.down = knex => knex.schema.dropTable('order_statuses')