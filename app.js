
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const port =  3000;




const homeStartingContent = "";
const aboutContent = "Mi diario es un espacio digital diseñado para que los usuarios puedan escribir, organizar y compartir sus pensamientos, experiencias y reflexiones de manera privada. Este tipo de sitio web ofrece un entorno seguro y personalizado donde los usuarios pueden registrar y mantener un registro íntimo de sus vivencias, metas, emociones y cualquier otro aspecto relevante de sus vidas.";
const contactContent = "Anonimo :)";

const app = express();

//to storage the posts
const posts = [];

//day
const day = getDay();

//conection DB
const uri = "mongodb://127.0.0.1:27017/blogMongo";
mongoose.connect(uri, {useNewUrlParser: true});

//Create a new Schema
const postSchema = {
  autor: String,
  title: String,
  content: String,
  date: String
}

//Create a new model for Schema
const Post = new mongoose.model("Post", postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{

  //query to bd
  async function getPosts(){
    const result = await Post.find();
    return result;
  }

  getPosts().then(function(foundPosts){
    console.log(foundPosts);
    res.render("home", {homeContent: homeStartingContent, postsPublished: foundPosts});
  })

 
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


  //create new post
  const post = new Post({
    autor: req.body.postAutor,
    title: req.body.postTitle,
    content: req.body.postText,
    date: req.body.date
  });

  //Save post
  post.save();


  //posts.push(post);
  res.redirect("/");
  console.log(posts);
});


app.get("/posts/:postId", (req, res)=>{



  const identifierPost = req.params.postId;
  Post.findOne({_id: identifierPost}).then(function (result){
    if(!result){//si no hay resultados
      console.log("Data not found!");
    }else{
      res.render("post",{postTitle: result.title, postBody: result.content, postAutor: result.autor, postDate: result.date});
    }
  })



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