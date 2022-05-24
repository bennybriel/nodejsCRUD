require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const path = require ('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const {logger} =require('./middleware/logEvents');
const errorHandler =require('./middleware/errorHandler');
const verifyJWT= require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//connect to Mongodb
connectDB();

//custom middleware logger
app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false}));
//built-in middleare for json
app.use(express.json());
//middleware cookie
app.use(cookieParser());
//serve static files
app.use(express.static(path.join(__dirname, '/public')));
//routes
app.use('/', require('./Routes/root'));
app.use('/register', require('./Routes/register'));
app.use('/auth', require('./Routes/auth'));
app.use('/refresh', require('./Routes/refresh'));
app.use('/logout', require('./Routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./Routes/api/employees'));

app.all('*', (req,res)=>{
     res.status(404);
     if(req.accepts('html')){
          res.sendFile(path.join(__dirname, 'views','404.html'));
     }
    else if(req.accepts('json')){
          res.json({ error: "404 Not Found"});
     }else{
          res.type('txt').send('404 Not Found');
     }
    
});
 
app.use(errorHandler);
mongoose.connection.once('open', ()=>{
     console.log('Connected MongoDB');
     app.listen(PORT, function() {
               console.log(`Server running on port ${PORT}`)
           });
});

// app.listen(PORT, function() {
//      console.log(`Server running on port ${PORT}`)
// });
//app.listen = (PORT, ()=>console.log(`Server running on port ${PORT}`));
//app.listen(<port on which the server should run here>);
