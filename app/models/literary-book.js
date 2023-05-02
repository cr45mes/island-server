const { Sequelize, Model, Op } = require("sequelize");

const { sequelize } = require("../../core/db");
const { Favor } = require("./favor");

class LiteraryBook extends Model {
  static async getAll() {
    const books = await LiteraryBook.findAll({
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
      LiteraryBook._getEachBookStatus(book, favors);
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

LiteraryBook.init(
  {
    index: Sequelize.INTEGER,
    image: Sequelize.STRING,
    author: Sequelize.STRING,
    title: Sequelize.STRING,
  },
  {
    sequelize,
    tableName: "literary_book",
  }
);

module.exports = {
  LiteraryBook,
};
