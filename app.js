const express=require('express');
const app=express();
const mongoose =require('mongoose');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const path = require('path');
const user =require('./routes/user');
const expressValidator=require('express-validator');

mongoose.connect("mongodb+srv://parasjain111:parasjain111@cluster0.lctcj.mongodb.net/user?retryWrites=true&w=majority",{ useNewUrlParser: true,useCreateIndex:true})
.then(()=>{
    
        console.log("jdw");
    
})

app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(expressValidator());
app.use('/user',user);
app.get('/',(req,res)=>{
    res.send(`
    user/users -> To get all users registered                                                    

    user/signup -> Signup user

    user/signin -> Login user

    user/userId -> User By id

    user/update -> To update user

    user/delete -> To delete user

    `);
    res.sendFile(path.join(__dirname+'/index.html'));
})

const port=process.env.PORT || 8080;

app.listen(port);
