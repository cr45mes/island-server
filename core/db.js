const { Sequelize, Model } = require("sequelize");
const { unset, clone, isArray } = require("lodash");

const { database, host } = require("../config/config");
const { dbName, port, user, password } = database;

// 四个参数 dbName user pwd {...}
const sequelize = new Sequelize(dbName, user, password, {
  dialect: "mysql", // 数据库类型
  host: database.host,
  port,
  logging: true, // 操作数据库时，会把原始sql打印在终端
  timezone: "+08:00", // 时区
  define: {
    timestamps: true, // createdAt & updatedAt
    paranoid: true, // deletedAt
    // createdAt: 'created_at',
    // updatedAt: 'updated_at',
    // deletedAt: 'deleted_at',
    underscored: true, // 驼峰命名 -> 下划线
    scopes: {
      bh: {
        //bh：自定义规则的名字，这个规则可以在查询到数据中去除updatedAt", "deletedAt", "createdAt这三个字段
        attributes: {
          exclude: ["updatedAt", "deletedAt", "createdAt"],
        },
      },
    },
  },
});

sequelize.sync({
  force: false, // true 会把表删掉
});

Model.prototype.toJSON = function () {
  let data = clone(this.dataValues);
  unset(data, "updatedAt");
  unset(data, "createdAt");
  unset(data, "deletedAt");

  for (key in data) {
    if (key === "image") {
      if (!data[key].startsWith("http")) {
        data[key] = host + data[key];
      }
    }
  }

  if (isArray(this.exclude)) {
    this.exclude.forEach((value) => {
      unset(data, value);
    });
  }

  return data;
};

module.exports = {
  // db: sequelize, 导出重命名
  sequelize,
};
