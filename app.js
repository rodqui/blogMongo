
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const port =  process.env.PORT || 3000;

const homeStartingContent = "";
const aboutContent = "Mi diario es un espacio digital diseñado para que los usuarios puedan escribir, organizar y compartir sus pensamientos, experiencias y reflexiones de manera privada. Este tipo de sitio web ofrece un entorno seguro y personalizado donde los usuarios pueden registrar y mantener un registro íntimo de sus vivencias, metas, emociones y cualquier otro aspecto relevante de sus vidas.";
const contactContent = "Anonimo :)";

const app = express();

//to storage the posts
const posts = [];

//day
const day = getDay();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{
  res.render("home", {homeContent: homeStartingContent, postsPublished: posts});
});

app.get("/about", (req, res)=>{
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", (req, res)=>{
  res.render("contact",{contactContent: contactContent});
});

app.get("/compose", (req, res)=>{
  
  res.render("compose", {date: day});
});

app.post("/compose", (req, res)=>{

  
  const post = {
    title: req.body.postTitle,
    body: req.body.postText,
    date: req.body.date,
    autor: req.body.postAutor
  }

  posts.push(post);

  res.redirect("/");
  console.log(posts);
});


app.get("/posts/:postName", (req, res)=>{

  posts.forEach(function(post){
    if(lodash.lowerCase(post.title)===lodash.lowerCase(req.params.postName)){
      console.log("Match Found!");
      console.log(post.title);
      console.log(post.body);
      res.render("post",{postTitle: post.title, postBody: post.body, postAutor: post.autor, postDate: post.date});
      
    }
  });


});


app.listen(port, function() {
  console.log("Server started on port " + port);
});



function getDay(){
    
  const today = new Date();
  const options = {
      weekday: "long",
      day: "numeric",
      month: "long"
  };

  
  return today.toLocaleDateString("es-ES", options);
};