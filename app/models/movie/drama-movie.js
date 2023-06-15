const { Sequelize, Model, Op } = require("sequelize");

const { sequelize } = require("../../../core/db");
const { Favor } = require("../favor");

class DramaMovie extends Model {
  static async getAll() {
    const movies = await DramaMovie.findAll({
      order: ["index"],
    });
    const ids = movies.map((movie) => movie.id);
    const favors = await Favor.findAll({
      where: {
        art_id: {
          [Op.in]: ids,
        },
        type: 400,
      },
      group: ["art_id"],
      attributes: ["art_id", [Sequelize.fn("COUNT", "*"), "count"]],
    });
    movies.forEach((movie) => {
      DramaMovie._getEachMovieStatus(movie, favors);
    });
    return movies;
  }
  static _getEachMovieStatus(movie, favors) {
    let count = 0;
    favors.forEach((favor) => {
      if (movie.id === favor.art_id) {
        count = favor.get("count");
      }
    });
    movie.setDataValue("fav_nums", count);
    return movie;
  }
}

DramaMovie.init(
  {
    index: Sequelize.INTEGER,
    image: Sequelize.STRING,
    rating: Sequelize.STRING,
    title: Sequelize.STRING,
  },
  {
    sequelize,
    tableName: "drama_movie",
  }
);

module.exports = {
  DramaMovie,
};
