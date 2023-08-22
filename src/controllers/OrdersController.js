const { validationResult } = require('express-validator')
const knex = require('../database/knex')

/**
 * Gera um código de pedido único.
 * @returns {string} - O código gerado.
 */
function getIdOrder() {
  const randomNumber = Math.floor(100000 + Math.random() * 900000)
  return randomNumber.toString()
}

/**
 * Atualiza automaticamente o status de um pedido em intervalos regulares.
 * @param {Object} knex - Instância do Knex.js para acesso ao banco de dados.
 * @param {number} orderId - O ID do pedido a ser atualizado automaticamente.
 */
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

/**
 * Controlador de pedidos que lida com a criação de novos pedidos.
 */
class OrdersController {

  /**
   * Cria um novo pedido.
   * @param {Object} req - Objeto de solicitação HTTP.
   * @param {Object} res - Objeto de resposta HTTP.
   */
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

      return res.status(201).json({ id: orderId })
    } catch (error) {
      console.error('Error creating order:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  /**
   * Mostra todo os pedidos.
   * @param {Object} req - Objeto de solicitação HTTP.
   * @param {Object} res - Objeto de resposta HTTP.
   * @returns 
   */
  async index(request, response) {
    try {
      let orders = false;
      if (request.user.isAdmin) {
        orders = await knex('orders')
          .select(
            'orders.id',
            'orders.code',
            'orders.details',
            'orders.total_value',
            'orders.created_at',
            'orders.user_id',
            'order_statuses.status',
            'orders.status_id'
          )
          .leftJoin('order_statuses', 'orders.status_id', 'order_statuses.id')
      }
      else {
        orders = await knex('orders')
          .select(
            'orders.id',
            'orders.code',
            'orders.details',
            'orders.total_value',
            'orders.created_at',
            'orders.user_id',
            'order_statuses.status',
            'orders.status_id'
          )
          .leftJoin('order_statuses', 'orders.status_id', 'order_statuses.id')
          .where('orders.user_id', request.user.id)
      }

      const ordersWithPlates = orders.map(order => {
        return { ...order }
      })

      return response.json(ordersWithPlates)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro ao listar os pedidos' })
    }
  } 
}

module.exports = OrdersController
