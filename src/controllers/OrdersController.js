const { validationResult } = require('express-validator')
const knex = require('../database/knex')

function getIdOrder() {
  const randomNumber = Math.floor(100000 + Math.random() * 900000)
  return randomNumber.toString()
}

async function updateStatusAutomatically(knex, orderId) {
  const statusIds = [1, 2, 3] 
  let currentIndex = 0

  const intervalId = setInterval(async () => {
    currentIndex = (currentIndex + 1) % statusIds.length
    const newStatusId = statusIds[currentIndex]

    try {
      await knex('orders')
        .where('id', orderId)
        .update({ status_id: newStatusId })

      if (newStatusId === 3) {
        clearInterval(intervalId)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }, 5 * 60 * 1000)
}

class OrdersController {
  async create(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      let status_id = '1'
      const { details, plates, total_value } = req.body

      if (!status_id || !plates) {
        return res.status(400).json({
          error: 'Dados incompletos'
        })
      }

      const plateIds = plates

      const code = getIdOrder()

      const order = {
        status_id,
        code,
        details,
        total_value,
        user_id: req.user.id
      }

      const [orderId] = await knex('orders').insert(order)

      updateStatusAutomatically(knex, orderId)

      const orderItems = plateIds.map(plates => ({
        order_id: orderId,
        plates_id: plates
      }))

      await knex('order_items').insert(orderItems)

      return res.status(201).json({ id: orderId })
    } catch (error) {
      console.error('Error creating order:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async index(request, response) {
    try {
      const orders = await knex('orders')
        .select(
          'orders.id',
          'orders.code',
          'orders.details',
          'orders.total_value',
          'orders.created_at',
          'orders.user_id',
          'order_statuses.status'
        )
        .leftJoin('order_statuses', 'orders.status_id', 'order_statuses.id')
        .where('orders.user_id', request.user.id)

      const orderIds = orders.map(order => order.id)

      const plates = await knex('order_items')
        .select('order_items.order_id', 'plates.*')
        .whereIn('order_items.order_id', orderIds)
        .leftJoin('plates', 'order_items.plates_id', 'plates.id')

      const ordersWithPlates = orders.map(order => {
        const orderPlates = plates.filter(plate => plate.order_id === order.id)
        return { ...order, plates: orderPlates }
      })

      return response.json(ordersWithPlates)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro ao listar os pedidos' })
    }
  } 

  async show(request, response) {
    const { id } = request.params

    try {
      const order = await knex('orders')
        .select(
          'orders.id',
          'orders.code',
          'orders.details',
          'orders.total_value',
          'orders.created_at',
          'orders.user_id',
          'order_statuses.status'
        )
        .leftJoin('order_statuses', 'orders.status_id', 'order_statuses.id')
        .where('orders.id', id)
        .first()

      if (!order) {
        return response.status(404).json({ error: 'Pedido não encontrado' })
      }

      return response.json(order)
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ error: 'Erro ao buscar os detalhes do pedido' })
    }
  }

  async update(request, response) {
    const { id } = request.params
    const { details, plates, total_value } = request.body

    try {
      const existingOrder = await knex('orders').where('id', id).first()

      if (!existingOrder) {
        return response.status(404).json({ error: 'Pedido não encontrado' })
      }

      const updatedTotalValue =
        total_value !== undefined ? total_value : existingOrder.total_value

      await knex('orders').where('id', id).update({
        details,
        total_value: updatedTotalValue
      })

      if (plates && Array.isArray(plates)) {
        await knex('order_items').where('order_id', id).delete()

        const orderItems = plates.map(plate => ({
          order_id: id,
          plates_id: plate
        }))

        await knex('order_items').insert(orderItems)
      }

      const updatedOrder = await knex('orders').where('id', id).first()

      return response.json(updatedOrder)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro ao atualizar o pedido' })
    }
  }

  async delete(request, response) {
    const { id } = request.params

    try {
      const existingOrder = await knex('orders').where('id', id).first()

      if (!existingOrder) {
        return response.status(404).json({ error: 'Pedido não encontrado' })
      }

      await knex('order_items').where('order_id', id).del()

      await knex('orders').where('id', id).del()

      return response.status(204).end()
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro ao excluir o pedido' })
    }
  }
}

module.exports = OrdersController
