module.exports = {
  environment: "dev",
  database: {
    dbName: "lin-cms-x",
    // dbName: "island",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
  },
  security: {
    secretKey: "abcdefg", // 用无规律的随机字符串
    expiresIn: 60 * 60 * 24 * 30, // 过期时间
  }, //用于生成token
  wx: {
    appId: "",
    appSecret: "",
    lognUrl:
      "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
  },
  yushu: {
    // detailUrl: "http://t.talelin.com/v2",
    detailUrl: "http://t.talelin.com/v2/book/id/%s",
    // detailUrl: "http://t.yushu.im/v2/book/id/%s",
    // keywordUrl:'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s',
    // keywordUrl:
    //   "http://t.talelin.com/v2/book/search?q=%s&count=%s&start=%s&summary=%s",
    keywordUrl:
      "http://t.talelin.com/v2/book/search?q=%s&count=%s&start=%s&summary=%s",
  },
  host: "http://localhost:3000/",
};
