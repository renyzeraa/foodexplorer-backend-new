const knex = require('../database/knex')

class ShoppingCartController {
  async show(request, response) {
    try {
      const { id } = request.params
      const userId = request.user.id

      const orders = await knex('orders')
        .select(
          'orders.id',
          'orders.code',
          'orders.details',
          'orders.total_value',
          'orders.user_id',
          'order_statuses.status'
        )
        .leftJoin(
          'order_statuses', 
          'orders.status_id', 
          'order_statuses.id'
        )
        .where('orders.id', id)
        .andWhere('orders.user_id', userId)
        .first()

      if (!orders) {
        return response.status(404).json({
          error:
            'Este pedido é de outro cliente'
        })
      }

      const plates = await knex('order_items')
        .select(
          'plates.title',
          'plates.description',
          'plates.value',
          'order_items.amount',
          'orders.id'
        )
        .join('orders', 'orders.id', 'order_items.order_id')
        .join('plates', 'order_items.plates_id', 'plates.id')
        .where('orders.id', id)

      const orderWithPlates = {
        ...orders,
        plates
      }

      return response.json(orderWithPlates)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro ao mostrar o card' })
    }
  }
}

module.exports = ShoppingCartController
