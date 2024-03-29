const Router = require("koa-router");
const router = new Router({
  prefix: "/v1/book",
});

const { HotBook } = require("../../models/hot-book");
const { LiteraryBook } = require("../../models/literary-book");
const { CodeBook } = require("../../models/code-book");
const { Book } = require("../../models/book");
const { Favor } = require("../../models/favor");
const { Comment } = require("../../models/book-comment");
const {
  PositiveIntegerValidator,
  SearchValidator,
  AddShortCommentValidator,
} = require("../../validators/validator");
const { Auth } = require("../../../middlewares/auth");
const { success } = require("../../lib/helper");

router.get("/hot_list", async (ctx, next) => {
  const books = await HotBook.getAll();
  ctx.body = books;
});
//获取文学类图书
router.get("/literarybook_list", async (ctx, next) => {
  const books = await LiteraryBook.getAll();
  ctx.body = books;
});
//获取编程类图书
router.get("/codebook_list", async (ctx, next) => {
  const books = await CodeBook.getAll();
  ctx.body = books;
});

router.get("/:id/detail", async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx);
  console.log("ddd", v.get("path.id"));
  const book = new Book();
  ctx.body = await book.detail(v.get("path.id"));
});

router.get("/search", async (ctx) => {
  const v = await new SearchValidator().validate(ctx);
  console.log(
    "aaaaa",
    v.get("query.q"),
    v.get("query.start"),
    v.get("query.count")
  );
  const result = await Book.searchFromYuShu(
    v.get("query.q"),
    v.get("query.start"),
    v.get("query.count")
  );
  ctx.body = result;
});

router.get("/favor/count", new Auth().m, async (ctx) => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid);
  ctx.body = { count };
});

router.get("/:book_id/favor", new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: "book_id",
  });
  const favor = await Favor.getBookFavor(ctx.auth.uid, v.get("path.book_id"));
  ctx.body = favor;
});

router.post("/add/short_comment", new Auth().m, async (ctx) => {
  const v = await new AddShortCommentValidator().validate(ctx, {
    id: "book_id",
  });
  Comment.addComment(v.get("body.book_id"), v.get("body.content"));
  success();
});


router.get("/:book_id/short_comment", new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: "book_id",
  });
  const book_id = v.get("path.book_id");
  const comments = await Comment.getComments(v.get("path.book_id"));
  ctx.body = {
    comments,
    book_id,
  };
});

router.get("/my_like_book",  new Auth().m, async ctx => {
  const uid = ctx.auth.uid
  ctx.body = await Favor.getMyBookFavors(uid)
});

router.get("/hot_keyword", async (ctx) => {
  ctx.body = {
    hot: [
      "Python",
      "哈利·波特",
      "村上春树",
      "东野圭吾",
      "白夜行",
      "韩寒",
      "金庸",
      "王小波",
    ],
  };
  // 搜索次数最多
  // 一部分参考算法，人工编辑
  // Lin-CMS，编辑热门关键字的功能
});

module.exports = router;
