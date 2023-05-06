const { Sequelize, Model, Op } = require("sequelize");

const { sequelize } = require("../../../core/db");

class MovieDetail extends Model {
  static async addMovie(id,image,title,comments_count,wish_count,stars,summary,directors,casts,year,genres,rating) {
    return await MovieDetail.create({
      id,image,title,comments_count,wish_count,stars,summary,directors,casts,year,genres,rating
    })
  }
  static async getMovieDetail(id) {
    const moviedetail = await MovieDetail.findOne({
      where: {
        id
      },
    });
    return {
      moviedetail
    };
  }

  
}

MovieDetail.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    image: Sequelize.STRING,
    title: Sequelize.STRING,
    comments_count: Sequelize.STRING,
    wish_count: Sequelize.STRING,
    fav_nums: Sequelize.STRING,
    summary: Sequelize.STRING,
    directors: Sequelize.STRING,
    casts: Sequelize.STRING,
    year: Sequelize.STRING,
    genres: Sequelize.STRING,
    rating: Sequelize.STRING,
    
  },
  {
    sequelize,
    tableName: "movie_detail",
  }
);

module.exports = {
  MovieDetail,
};
