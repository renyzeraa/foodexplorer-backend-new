const knex = require('../database/knex')

class FavoritesController {
  async create(request, response) {
    const user_id = request.user.id;
    const { plate_id } = request.params;
  
    const plate = await this.getPlateById(plate_id);
  
    if (!plate) {
      return this.errorResponse(response, 404, 'Prato não encontrado');
    }
  
    const isAlreadyFavorite = await this.checkIfPlateIsFavorite(user_id, plate_id);
  
    if (isAlreadyFavorite) {
      return this.errorResponse(response, 400, 'Prato já marcado como favorito');
    }
  
    await this.markPlateAsFavorite(user_id, plate_id);
  
    return response.status(201).json({ message: 'Prato marcado como favorito' });
  }
  
  async getPlateById(plate_id) {
    return await knex('plates').where({ id: plate_id }).select('*').first();
  }
  
  async checkIfPlateIsFavorite(user_id, plate_id) {
    const [existingFavorite] = await knex('favorite_plates')
      .where({ user_id, plate_id })
      .count('* as count');
  
    return existingFavorite.count > 0;
  }
  
  async markPlateAsFavorite(user_id, plate_id) {
    await knex('favorite_plates').insert({ user_id, plate_id });
  }
  
  async findFavoritePlate(user_id, plate_id) {
    return await knex('favorite_plates')
    .where({ user_id, plate_id })
    .select('plate_id')
    .first();
  }
  
  async show(request, response) {
    const user_id = request.user.id;
    const { plate_id } = request.params;
    
    const favoritePlate = await this.findFavoritePlate(user_id, plate_id);
    
    if (!favoritePlate) {
      return this.errorResponse(response, 404, 'Prato favoritado, não encontrado');
    }
    
    const plate = await this.getPlateById(plate_id);
    
    return response.json(plate);
  }
  
  async index(request, response) {
    const user_id = request.user.id;
    
    const favoritePlateIds = await this.getFavoritePlateIds(user_id);
    const plates = await this.getPlatesByIds(favoritePlateIds);
    
    return response.json(plates);
  }
  
  async getFavoritePlateIds(user_id) {
    const favoritePlates = await knex('favorite_plates')
    .select('plate_id')
    .where('favorite_plates.user_id', user_id);
    
    return favoritePlates.map(favorite => favorite.plate_id);
  }
  
  async getPlatesByIds(plateIds) {
    return await knex('plates').whereIn('id', plateIds).select('*');
  }
  
  async removePlateFromFavorites(user_id, plate_id) {
    await knex('favorite_plates').where({ user_id, plate_id }).del();
  }
  
  async delete(request, response) {
    const user_id = request.user.id;
    const plate_id = request.params.plate_id;
    
    const isFavorite = await this.checkIfPlateIsFavorite(user_id, plate_id);
    
    if (!isFavorite) {
      return this.errorResponse(response, 400, 'Prato não está marcado como favorito');
    }
  
    await this.removePlateFromFavorites(user_id, plate_id);
    
    return response.status(200).json({ message: 'Prato removido dos favoritos' });
  }
  
  errorResponse(response, status, message) {
    return response.status(status).json({ error: message });
  }
}

module.exports = FavoritesController
