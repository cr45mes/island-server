const Router = require("koa-router");
const { ActionMovie } = require("../../models/movie/action-movie");
const { ComedyMovie } = require("../../models/movie/comedy-movie");
const { ScifiMovie } = require("../../models/movie/scifi-movie");
const { DramaMovie } = require("../../models/movie/drama-movie");
const {  MovieDetail } = require("../../models/movie/movie-detail");
const { success } = require("../../lib/helper");
const {
  PositiveIntegerValidator
} = require("../../validators/validator");
const { Auth } = require("../../../middlewares/auth");
const router = new Router({
  prefix: "/v1/movie", // 该路由下的前缀
});
//添加电影到数据库
router.post("/add/movie", new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id:'id'
  });
  console.log(v.get("body.image"))
  MovieDetail.addMovie(v.get("body.id"), v.get("body.image"),v.get("body.title"),v.get("body.comments_count"),v.get("body.wish_count"),v.get("body.stars"),v.get("body.summary"),v.get("body.directors"),v.get("body.casts"),v.get("body.year"),v.get("body.genres"),v.get("body.rating"));
  success();
});
//获取电影详情
router.get("/:id/detail", new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: "id",
  });
  const moviedetail = await MovieDetail.getMovieDetail(v.get("path.id"));
  ctx.body = moviedetail;
});



//获取动作电影
router.get("/actionmovie_list", async (ctx, next) => {
  const movies = await ActionMovie.getAll();
  ctx.body = movies;
});
//获取喜剧电影
router.get("/comedymovie_list", async (ctx, next) => {
  const movies = await ComedyMovie.getAll();
  ctx.body = movies;
});
//获取科幻电影
router.get("/scifimovie_list", async (ctx, next) => {
  const movies = await ScifiMovie.getAll();
  ctx.body = movies;
});
//获取剧情电影
router.get("/dramamovie_list", async (ctx, next) => {
  const movies = await DramaMovie.getAll();
  ctx.body = movies;
});

module.exports = router;
