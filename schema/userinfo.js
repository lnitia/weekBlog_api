const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1)
const username = joi.string()
const email = joi.string().email()

// 注册和登录表单的验证规则对象
exports.update_userinfo_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    id,
    username,
    email,
  },
}