// 导入定义验证规则的模块
const joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1)
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿')
const author_name =  joi.string().required()
const pagenum = joi.number().integer().required()
const pagesize = joi.number().integer().required()

// 验证规则对象 - 发布文章
exports.add_article_schema = {
  body: {
    title,
    author_name,
    content,
    // state,
  },
}

exports.get_articleList_schema = {
  query: {
    pagenum,
    pagesize,
    cate_id,
    state
  }
}

exports.get_delArticle_schema = {
  query: {
    id:cate_id
  }
}