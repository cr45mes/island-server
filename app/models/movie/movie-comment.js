const { Sequelize, Model } = require('sequelize')

const { sequelize } = require('../../../core/db')

class MovieComment extends Model {
  static async addComment(movieID, content) {
    const moviecomment = await MovieComment.findOne({
      where: {
        movie_id: movieID,
        content,
      }
    })
    if (!moviecomment) {
      return await MovieComment.create({
        movie_id: movieID,
        content,
        nums: 1,
      })
    } else {
      return await moviecomment.increment('nums', {
        by: 1,
      })
    }
  }

  static async getComments(id) {
    console.log('--------------f------------',id)
    const comments = await MovieComment.findAll({
      where: {
        movie_id:id
      },
    });
    // const comments = MovieComment.findAll({
    //   where: {
    //     movie_id: bookID,
    //   }
    // })
    return comments
  }

  // toJSON(){
  //   return {
  //     content:this.getDataValue('content'),
  //     nums:this.getDataValue('nums'),
  //   }
  // }

}

// MovieComment.prototype.exclude = ['movie_id','id']

MovieComment.init({
  content: Sequelize.STRING(12),
  nums: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  movie_id: Sequelize.INTEGER,
}, {
  sequelize,
  tableName: 'moviecomment',
})

module.exports = {
  MovieComment,
}