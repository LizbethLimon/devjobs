const  mongoose  = require('mongoose');
const Vacante=require('../models/Vacantes');

exports.mostrarTrabajos=async(req,res)=>{

    const vacantes=await Vacante.find().lean();

    if(!vacantes)return next();

    res.render('home',{
        nombrePagina: 'devJobs',
        tagline:'Encuentra y publica trabajos para Desarrolladores Web',
        barra:true,
        boton:true,
        vacantes
    });
}