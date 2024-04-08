const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// 导入配置文件
const config = require("./config");

exports.regUser = (req, res) => {
  const userInfo = req.body;
  if (!userInfo.username || !userInfo.password) {
    return res.send({ status: 1, message: "账号或密码不合法" });
  }
  db.query(
    "select * from ev_users where username=?",
    userInfo.username,
    function (err, results) {
      if (err) {
        return res.cc(err);
      }
      if (results.length > 0) {
        // return res.send({status:1, message:"用户名重复"})
        return res.cc("用户名重复");
      }
    }
  );
  userInfo.password = bcrypt.hashSync(userInfo.password, 10);
  db.query(
    "insert into ev_users set ?",
    { username: userInfo.username, password: userInfo.password, email: userInfo.email },
    function (err, results) {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows !== 1) {
        // return res.send({status:1, message:"注册失败，请稍后尝试"})
        return res.cc("注册失败，请稍后尝试");
      }
    }
  );
  res.send({ status: 0, message: "注册成功！" });
};

exports.login = (req, res) => {
  const userInfo = req.body;
  db.query(
    "select * from ev_users where username=?",
    userInfo.username,
    function (err, results) {
      if (err) {
        console.log('wu'); 
        return res.cc(err);
      }
      if (results.length !== 1) {console.log('wu'); return  res.cc("登录失败！");}
      // 拿着用户输入的密码,和数据库中存储的密码进行对比
      const compareResult = bcrypt.compareSync(
        userInfo.password,
        results[0].password
      );
      // 如果对比的结果等于 false, 则证明用户输入的密码错误
      if (!compareResult) {
        console.log('wu');
        return res.cc("登录失败！");
      }
      const user = { ...results[0], password: ""};
      const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: "10h", // token 有效期为 10 个小时
      });
      console.log(user)
      res.send({
        status: 0,
        message: "登录成功！",
        // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
        token: "Bearer " + tokenStr,
        user
      });
    }
  );
 
};
