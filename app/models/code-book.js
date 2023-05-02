const { Sequelize, Model, Op } = require("sequelize");

const { sequelize } = require("../../core/db");
const { Favor } = require("./favor");

class CodeBook extends Model {
  static async getAll() {
    const books = await CodeBook.findAll({
      order: ["index"],
    });
    const ids = books.map((book) => book.id);
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
    books.forEach((book) => {
      CodeBook._getEachBookStatus(book, favors);
    });
    return books;
  }

  static _getEachBookStatus(book, favors) {
    let count = 0;
    favors.forEach((favor) => {
      if (book.id === favor.art_id) {
        count = favor.get("count");
      }
    });
    book.setDataValue("fav_nums", count);
    return book;
  }
}

CodeBook.init(
  {
    index: Sequelize.INTEGER,
    image: Sequelize.STRING,
    author: Sequelize.STRING,
    title: Sequelize.STRING,
  },
  {
    sequelize,
    tableName: "code_book",
  }
);

module.exports = {
  CodeBook,
};
