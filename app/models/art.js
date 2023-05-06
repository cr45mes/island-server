const { Op } = require("sequelize");
const { flatten } = require("lodash");
const axios = require("axios");
const util = require("util");

const { detailUrl, keywordUrl } = require("../../config/config").yushu;
const { Movie, Music, Sentence } = require("./classic");
const { MovieDetail } =require("./movie/movie-detail")
// const { Book } =require("./book")
const { NotFound } = require("../../core/http-exception");
// const { host } = require('../../config/config')

class Art {
  constructor(art_id, type) {
    this.art_id = art_id;
    this.type = type;
  }

  async getDetail(uid) {
    const { Favor } = require("./favor"); //放在里面而不是在外面引入，是因为放在外面会导致互相引入而报错
    const art = await Art.getData(this.art_id, this.type);
    if (!art) {
      throw new NotFound();
    }
    const like = await Favor.userLikeIt(this.art_id, this.type, uid);
    return {
      art,
      like_status: like,
    };
  }

  static async getList(artInfoList) {
    const artInfoObj = {
      100: [],
      101: [],
      200: [],
      300: [],
    };
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.art_id);
    }
    const arts = [];
    for (let key in artInfoObj) {
      const ids = artInfoObj[key];
      if (!ids.length) continue;
      key = parseInt(key);
      arts.push(await Art._getListByType(ids, key));
    }
    return flatten(arts);
  }

  static async getBookList(arr) {
    
    const promises = arr.map(async (item)=>{
      const url = util.format(detailUrl, item.id);
      // console.log("eeeee", url);
      const detail = await axios.get(url);
      return detail.data
      // console.log('2222222222222222',detail.data)
      // console.log('333',rarr)
    })
    const rarr = await Promise.all(promises)
    
    return rarr
  }

  static async _getListByType(ids, type) {
    let arts = [];
    const finder = {
      where: {
        id: { [Op.in]: ids },
      },
    };
    const scope = "bh";
    switch (type) {
      case 100:
        arts = await Movie.scope(scope).findAll(finder);
        break;
      case 200:
        arts = await Music.scope(scope).findAll(finder);
        break;
      case 300:
        arts = await Sentence.scope(scope).findAll(finder);
        break;
      case 400:
        break;

      default:
        break;
    }

    return arts;
  }

  static async getData(art_id, type, useScope = true) {
    let art = null;
    const finder = {
      where: {
        id: art_id,
      },
    };
    const scope = useScope ? "bh" : null;
    switch (type) {
      case 100:
        art = await Movie.scope(scope).findOne(finder);
        break;
      case 101:
        art = await MovieDetail.scope(scope).findOne(finder);
        break;  
      case 200:
        art = await Music.scope(scope).findOne(finder);
        break;
      case 300:
        art = await Sentence.scope(scope).findOne(finder);
        break;
      case 400:
        const { Book } = require("./book");
        art = await Book.scope(scope).findOne(finder);
        if (!art) {
          art = await Book.create({
            id: art_id,
          });
        }
        break;

      default:
        break;
    }
    // if (art && art.image) {
    //   let imgUrl = art.dataValues.image
    //   art.dataValues.image = host + imgUrl
    // }
    return art;
  }
}

module.exports = {
  Art,
};
