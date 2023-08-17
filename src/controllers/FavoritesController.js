const knex = require('../database/knex')

class FavoritesController {
  async create(request, response) {
    const user_id = request.user.id
    const { plate_id } = request.params

    const plate = await knex('plates').where({ id: plate_id }).first()
    if (!plate) {
      return response
        .status(404)
        .json({ error: 'Prato não encontrado' })
    }

    const [existingFavorite] = await knex('favorite_plates')
      .where({ user_id, plate_id })
      .count('* as count')

    if (existingFavorite.count > 0) {
      return response
        .status(400)
        .json({ error: 'Prato já marcado como favorito' })
    }

    await knex('favorite_plates').insert({ user_id, plate_id })

    return response.status(201).json({ message: 'Prato marcado como favorito' })
  }

  async show(request, response) {
    const user_id = request.user.id
    const { plate_id } = request.params

    const favoritePlate = await knex('favorite_plates')
      .where({ user_id, plate_id })
      .select('plate_id')
      .first()

    if (!favoritePlate) {
      return response
        .status(404)
        .json({ error: 'Prato favoritado, não encontrado' })
    }

    const plate = await knex('plates').where('id', plate_id).select('*').first()

    return response.json(plate)
  }

  async index(request, response) {
    const user_id = request.user.id

    const favoritePlates = await knex('favorite_plates')
      .select('plate_id')
      .where('favorite_plates.user_id', user_id)

    const plateIds = favoritePlates.map(favorite => favorite.plate_id)

    const plates = await knex('plates').whereIn('id', plateIds).select('*')

    return response.json(plates)
  }

  async delete(request, response) {
    const user_id = request.user.id
    const plate_id = request.params.plate_id
    const [existingFavorite] = await knex('favorite_plates')
      .where({ user_id, plate_id: plate_id })
      .count('* as count')

    if (existingFavorite.count === 0) {
      return response
        .status(400)
        .json({ error: 'Prato não está marcado como favorito' })
    }

    await knex('favorite_plates').where({ user_id, plate_id }).del()

    return response
      .status(200)
      .json({ message: 'Prato removido dos favoritos' })
  }
}

module.exports = FavoritesController
