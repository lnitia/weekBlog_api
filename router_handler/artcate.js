const db = require("../db")

// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    db.query('select * from ev_article_cates where is_delete=0 order by id asc', (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 2. 执行 SQL 语句成功
        res.send({
          status: 0,
          message: '获取文章分类列表成功！',
          data: results,
        })
      })
  }

  // 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    db.query(`select * from ev_article_cates where name=? or alias=?`, [req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 判断 分类名称 和 分类别名 是否被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分别判断 分类名称 和 分类别名 是否被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
      
        // 新增文章分类
        db.query('insert into ev_article_cates set ?', req.body, (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)
          
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
          
            // 新增文章分类成功
            res.cc('新增文章分类成功！', 0)
          })
      })
  }

  // 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    db.query('update ev_article_cates set is_delete=1 where id=?', req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
      
        // 删除文章分类成功
        res.cc('删除文章分类成功！', 0)
      })
   
  }

  // 根据 Id 获取文章分类的处理函数
exports.getArticleById = (req, res) => {
    db.query(`select * from ev_article_cates where id=?`, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章分类数据失败！')
      
        // 把数据响应给客户端
        res.send({
          status: 0,
          message: '获取文章分类数据成功！',
          data: results[0],
        })
      })
  }

  // 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 执行查重操作
db.query( `select * from ev_article_cates where id<>? and (name=? or alias=?)`, [req.body.id, req.body.name, req.body.alias], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
  
    // 判断 分类名称 和 分类别名 是否被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
  
    // 更新文章分类
    db.query(`update ev_article_cate set ? where id=?`, [req.body, req.body.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
      
        // 更新文章分类成功
        res.cc('更新文章分类成功！', 0)
      })
  })
    
  }