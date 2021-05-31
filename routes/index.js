var express = require('express');

var router = express.Router();
var mysql=require("mysql")
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'H123456',
  database : 'huang',
  multipleStatements: true
});
connection.connect()
/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query("select * from airticle",(err,data)=>{
    res.render("table-basic",{data:data})
  })
});
router.get("/pages-profile",(req,res)=>{
  var judge;
  if(req.session.username==undefined){judge=0}else{judge=1}
  res.render("pages-profile",{judge:judge,username:req.session.username})
})
router.get("/login",(req,res)=>{
  connection.query("select * from user where username=? and password=?",[req.query.username,req.query.password],(err,data)=>{
    if(data.length>0){req.session.username=req.query.username;res.json({data:"登录成功"})}else{res.json({data:"登录失败"})}
  })
})
router.get("/register",(req,res)=>{
  res.render("register")
})
router.post("/register",(req,res)=>{
  connection.query("insert user values(?,?)",[req.body.username,req.body.password],(err,data)=>{
    if(err){res.json({data:"注册失败"})}else{req.session.username=req.query.username;res.json({data:"注册成功"})}
  })
})
router.get("/add",(req,res)=>{
  res.render("add")
})
router.get("/addd",(req,res)=>{
  if(req.session.username!=undefined){
  connection.query("insert airticle values(?,?,?,now())",[req.query.subject,req.query.content,req.session.username],(err,data)=>{
    if(err){res.json({data:"添加失败"})}else{req.session.username=req.query.username;res.json({data:"添加成功"})}
  })}else{res.json({data:"未登录"})}
  
})
router.get("/:title",(req,res)=>{

  connection.query("select * from airticle where subject=?;select comment.username,comment.content from airticle inner join comment on comment.airticle=airticle.subject where airticle.subject=?",[req.params.title,req.params.title],(err,data)=>{

    res.render("airticle",{data:data})
  })
})
router.post("/delete",(req,res)=>{
  var subject=req.body.subject.split("_")[0]
  var username=req.body.subject.split("_")[1]
  console.log(req.body.subject);
  if(req.session.username==undefined){res.json({data:"未登录"})}else{
    if(req.session.username==username){
      connection.query("delete from airticle where subject=?",[subject],(err,data)=>{
        if(err){res.json({data:"删除失败"})}else{res.json({data:"删除成功"})}
      })
    }else{res.json({data:"仅限作者删除"})}
  }
})
router.post("/comment",(req,res)=>{
  if(req.session.username){
    console.log(req.body.subject);
    console.log(req.body.comment);
    connection.query("insert comment values(?,?,?)",[req.body.subject,req.session.username,req.body.comment],(err,data)=>{
      console.log(req.session.username);
      
      if(err){console.log(err);res.json({data:"评论失败"})}else{res.json({data:"评论成功"})}
    })
  }else{res.json({data:"未登录"})}
})
module.exports = router;
