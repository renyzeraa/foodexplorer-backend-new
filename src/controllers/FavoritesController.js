const knex = require('../database/knex')

/**
 * Controller para operações relacionadas aos pratos favoritos de um usuário.
 */
class FavoritesController {

  /**
   * Cria uma nova entrada para um prato favorito de um usuário.
   * @param {Object} request - Objeto de solicitação HTTP.
   * @param {Object} response - Objeto de resposta HTTP.
   */
  async create(request, response) {
    const user_id = request.user.id;
    const { plate_id } = request.params;
  
    // Verifica se o prato existe
    const plate = await knex("plates").where({ id: plate_id }).first();
    if (!plate) {
      return response.status(404).json({ error: 'Prato não encontrado' });
    }
  
    // Verifica se o prato já está marcado como favorito
    const [existingFavorite] = await knex('favorite_plates')
    .where({ user_id, plate_id })
    .count('* as count');
    const isAlreadyFavorite = existingFavorite.count > 0;
  
    if (isAlreadyFavorite) {
      return response.status(400).json({ error: 'Prato já marcado como favorito' });
    }
  
    await knex('favorite_plates').insert({ user_id, plate_id });
  
    return response.status(201).json({ message: 'Prato marcado como favorito' });
  }
  
    /**
   * Retorna os detalhes de um prato marcado como favorito por um usuário.
   * @param {Object} request - Objeto de solicitação HTTP.
   * @param {Object} response - Objeto de resposta HTTP.
   */
  async show(request, response) {
    const user_id = request.user.id;
    const { plate_id } = request.params;
    
    const favoritePlate = await knex('favorite_plates')
    .where({ user_id, plate_id })
    .select('plate_id')
    .first();
    
    if (!favoritePlate) {
      return response.status(404).json({ error: 'Prato favoritado, não encontrado' });
    }
    
    const plate = await knex('plates').where({ id: plate_id }).select('*').first();
    
    return response.json(plate);
  }
  
  /**
   * Retorna uma lista de pratos marcados como favoritos por um usuário.
   * @param {Object} request - Objeto de solicitação HTTP.
   * @param {Object} response - Objeto de resposta HTTP.
   */
  async index(request, response) {
    const user_id = request.user.id;
    
    const favoritePlates = await knex('favorite_plates')
    .select('plate_id')
    .where('favorite_plates.user_id', user_id);
    const favoritePlateIds = favoritePlates.map(favorite => favorite.plate_id);
    const plates = await knex('plates').whereIn('id', favoritePlateIds).select('*');
    
    return response.json(plates);
  }

  /**
   * Remove um prato da lista de favoritos de um usuário.
   * @param {Object} request - Objeto de solicitação HTTP.
   * @param {Object} response - Objeto de resposta HTTP.
   */
  async delete(request, response) {
    const user_id = request.user.id;
    const plate_id = request.params.plate_id;
    
    const [existingFavorite] = await knex('favorite_plates')
    .where({ user_id, plate_id })
    .count('* as count');
    const isFavorite = existingFavorite.count > 0;
    
    if (!isFavorite) {
      return response.status(400).json({ error: 'Prato não está marcado como favorito'});
    }
    
    // Remove o prato da lista de favoritos do usuário
    await knex('favorite_plates').where({ user_id, plate_id }).del();
    
    return response.status(200).json({ message: 'Prato removido dos favoritos' });
  }
}

module.exports = FavoritesController
