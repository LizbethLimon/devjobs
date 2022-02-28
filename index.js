const mongoose=require('mongoose');
require('./config/db');

const express=require('express');
const exphbs=require('express-handlebars');
const handlebars=require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const path=require('path');
const router=require('./routes/index');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const bodyParser=require('body-parser');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const createError=require('http-errors');
const passport=require('./config/passport');

require('dotenv').config({path : 'variables.env'});


const app=express();

//habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//validacion de campos 
app.use(expressValidator());

//habilitar handlebars como view
app.engine('handlebars',
    exphbs.engine({
        handlebars: allowInsecurePrototypeAccess(handlebars),
        defaultLayout:'layout',
        helpers: require('./helpers/handlebars')
    })
);

app.set('view engine','handlebars');

//static files
app.use(express.static(path.join(__dirname,'/public')));

app.use(cookieParser());

app.use(session({
    secret:process.env.SECRETO,
    key:process.env.KEY,
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({mongooseConnection: mongoose.connection})

}));

//inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//Alertas y flash messages
app.use(flash());

//Crear nuestro middleware
app.use((req,res,next)=>{
    res.locals.mensajes=req.flash();
    next();
});

app.use('/',router());

//404 pagina no existente
app.use((req,res,next)=>{
    next(createError(404,'No Encontrado'));
});

//Administracion de los errores
app.use((error,req,res)=>{
    res.locals.mensaje=error.message;
    const status=error.status || 500;

    res.locals.status=status;
    res.status(status);

    res.render('error');
});

//Dejar que heroku asigne el puerto
const host = '0.0.0.0';
const port= process.env.PORT || 4000;

app.listen(port,host,()=>{
    console.log('El servidor esta funcionando');
});