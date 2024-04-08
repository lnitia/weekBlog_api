const db = require("../db");
const fs = require("fs");
// 导入处理路径的核心模块
const path = require("path");

// 发布新文章的处理函数

exports.addArticle = (req, res) => {
  console.log(req.body); // 文本类型的数据
  console.log("--------分割线----------");
  // console.log(req.file) // 文件类型的数据

  //  // 手动判断是否上传了文章封面
  //  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

  db.query(
    `insert into ev_articles set ?`,
    {
      // 标题、内容、状态、所属的分类Id
      title: req.body.title,
      content: req.body.content,
      // 文章封面在服务器端的存放路径
      // cover_img: path.join('/uploads', req.file.filename),
      // 文章发布时间
      pub_date: new Date(),
      // 文章作者的Id
      author_id: req.user.id,
      author_name: req.body.author_name,
    },
    (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err);

      // 执行 SQL 语句成功，但是影响行数不等于 1
      if (results.affectedRows !== 1) return res.cc("发布文章失败！");

      // 发布文章成功
      res.cc("发布文章成功", 0);
    }
  );
};

exports.getArticleList = (req, res) => {
  db.query("select count(*) as total from ev_articles ", function (err, rows) {
    if (err) return res.cc(err);

    if (rows.length !== 1) return res.cc("获取文章列表失败！");

    // console.log(rows[0].total)
    // return rows[0].total
    // 当前页的第一个索引值
    const pageIndex = (req.query.pagenum - 1) * req.query.pagesize;

    db.query(
      'SELECT arl.id, arl.title, arl.pub_date, arl.state, arc.name,(SELECT COUNT(*) FROM ev_articles) AS total FROM ev_articles AS arl,ev_article_cates AS arc  WHERE arl.cate_id = arc.id and cate_id like "%' +
        req.query.cate_id +
        '%" and state like "%' +
        req.query.state +
        '%" LIMIT ?, ?',
      [pageIndex, req.query.pagesize],
      function (err, rows) {
        if (err) return res.cc(err);

        var total = 0;
        if (rows.length === 0) {
          total = 0;
        } else {
          total = rows[0].total;
        }
        return res.send({
          code: 0,
          message: "获取文章列表成功！",
          total: total,
          data: rows,
        });
      }
    );
  });
};

exports.getArticleListByTime = (req, res) => {
  db.query(
    "select count(*) as total from ev_articles where is_delete=0 ",
    function (err, rows) {
      if (err) return res.cc(err);

      if (rows.length !== 1) return res.cc("获取文章列表失败！");

      db.query(
        "SELECT * FROM ev_articles where is_delete=0 and DATE_SUB(date(?), INTERVAL 7 DAY) <= date(pub_date)",
        [req.query.time, req.query.time],
        function (err, rows) {
          if (err) return res.cc(err);
          return res.send({
            code: 0,
            message: "获取文章列表成功！",
            data: rows,
          });
        }
      );
    }
  );
};

exports.getArticleListByUid = (req, res) => {
  db.query(
    "select count(*) as total from ev_articles where is_delete=0",
    function (err, rows) {
      if (err) return res.cc(err);

      if (rows.length !== 1) return res.cc("获取文章列表失败！");

      db.query(
        "SELECT * FROM ev_articles where author_id=? and is_delete=0 ",
        [req.query.uid],
        function (err, rows) {
          if (err) return res.cc(err);
          return res.send({
            code: 0,
            message: "获取某人文章列表成功！",
            data: rows,
          });
        }
      );
    }
  );
};

exports.getArticleDetail = (req, res) => {
  db.query(
    "SELECT arl.id, arl.title, arl.content, arl.cover_img, arl.pub_date, arl.state, arl.cate_id, arl.author_id, ev_users.username, ev_users.nickname FROM ev_articles AS arl, ev_users WHERE arl.author_id = ev_users.id and arl.id = ?",
    [req.query.id],
    function (err, rows) {
      if (err) return res.cc(err);

      if (rows.length !== 1) return res.cc("没有查到对应的数据！");

      return res.send({
        code: 0,
        message: "获取文章成功！",
        data: rows[0],
      });
    }
  );
};

exports.delArticle = (req, res) => {
  db.query(
    "update ev_articles set is_delete=1 where id=?",
    [req.query.id],
    function (err, rows) {
      if (err) return res.cc(err);

      if (rows.affectedRows !== 1) return res.cc("您要删除的文章不存在！");

      return res.cc("删除成功！", 0);
    }
  );
};

exports.updateArticle = (req, res) => {
  db.query(
    "update ev_articles set title=?,content=? where id=?",
    [req.body.title, req.body.content, req.body.id],
    function (err, rows) {
      if (err) return res.cc(err);

      return res.cc("更新成功！", 0);
    }
  );
};

exports.addPic = (req, res) => {
  var base64Data = req.body.base64Data;
  var picname = req.body.picname;

  var base64Data = base64Data.replace(/^data:image\/\w+;base64,/, "");
  var binaryData = Buffer.from(base64Data, "base64").toString("binary");
  //console.log(binaryData);
  fs.writeFile(
    __dirname + "../../public/images/" + picname,
    binaryData,
    "binary",
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  res.send({picname,base64Data});
};
