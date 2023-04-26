const { Sequelize, Model } = require("sequelize");
const axios = require("axios");
const util = require("util");

const { sequelize } = require("../../core/db");
const { detailUrl, keywordUrl } = require("../../config/config").yushu;
const { Favor } = require("./favor");

class Book extends Model {
  // constructor(id) {
  //   super()
  //   this.id = id
  // }

  async detail(id) {
    const url = util.format(detailUrl, id);
    console.log("eeeee", url);
    const detail = await axios.get(url);
    return detail.data;
  }

  static async getMyFavorBookCount(uid) {
    const count = await Favor.count({
      where: {
        type: 400,
        uid,
      },
    });
    return count;
  }

  static async searchFromYuShu(q, start, count, summary = 1) {
    console.log("bbb", q, start, count, summary);
    const url = util.format(keywordUrl, encodeURI(q), count, start, summary);
    console.log("ccc", url);
    const result = await axios.get(url);
    return result.data;
  }
}

Book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    fav_nums: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "book",
  }
);

module.exports = {
  Book,
};
