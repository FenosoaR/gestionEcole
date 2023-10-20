const {Users,Etudiants,Option,Semestre,Filieres,Profs} = require('../models')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const {getDate} = require('../libs/getDate')

const register = async(req, res) =>{

    return res.render('auth/register')
}

const postregister = async(req, res) =>{

    const {nom , prenom , email , password , confirmation} = req.body

    let error = []
    let data = null

    if(nom == '' || prenom =='' || email=='' || password=='' || confirmation == '')
        error.push('Veuillez remplir les champs')

    if(password.length  < 6 || password.length > 60)
        error.push('Votre mot de passe devrait etre entre 6 et 60 caractères ')

    if(confirmation!=password)
        error.push('Confirmation invalide')
        
    if(email != '')
        data = await Users.findOne({where : {email}})

    if(data)
        error.push('Votre email est invalide')

    if(error.length == 0){

        const hashedPassword = bcrypt.hashSync(password , 12)

        const newUser = Users.build({
            nom, 
            prenom, 
            email,
            password:hashedPassword,
            badge : 'admin'
        })

        await newUser.save()

         req.flash('success' ,'you can login now')

       
         return res.redirect('/')

    }else{

        return res.render('auth/register' , {error})
    }

}

const login = async(req, res) =>{
    
    return res.render('auth/login')
}

const postlogin = async(req , res , next)=>{

    passport.authenticate('local' , {
        successRedirect:'/redirect', 
        failureRedirect:'/',
        failureFlash:true
    })(req, res, next)
}

const redirect = async(req, res) =>{

    if(req.user.badge == 'admin'){

        return res.redirect('admin/home')

    }else if(req.user.badge == 'Profs'){

        return res.redirect('/profs/home')

    }else{
  
        return res.redirect('/etudiants/home')
    }
}
const changerMdp = async(req, res)  => {

    if(req.user.badge == 'Etudiants'){

    const etudiant = await Etudiants.findOne({where : {email : req.user.email} , include : [Filieres,Semestre, Option]})

    const semestres = await Semestre.findAll()

    return res.render('auth/changerMdp', {user:req.user, etudiant, semestres,getDate})

    }else if(req.user.badge == 'Profs'){

        const filieres = await Filieres.findAll()

        const prof = await Profs.findOne({where : {email :req.user.email} ,  include : [Filieres,Semestre, Option]})

        return res.render('auth/changerMdp', {user:req.user,prof,filieres})
    }

 
}

const postChangerMdp = async(req, res) => {

    let error = []

    const {ancienMotDePasse, password , confirmation, userId} = req.body

    const user = await Users.findOne({where : {id : userId}})

    const isValid = bcrypt.compareSync(ancienMotDePasse, user.password)

    if(!isValid){

        error.push('Votre ancien mot de passe est incorrecte')
    }

    if(password != confirmation){

        error.push('Mot de passe incorrecte')
            
    }

    if(error.length == 0){

        const hashedNewPassword = bcrypt.hashSync(password, 12)

        let data = {
            nom : user.nom,
            prenom : user.prenom,
            email:user.email,
            password:hashedNewPassword,
            badge : user.badge
        }

        await Users.update(data , {where : {id : userId}})

        if(user.badge == 'Etudiants'){

            return res.redirect('/etudiants/home')

        }else{

            return res.redirect('/profs/home')
        }

            

    }else{

        if(user.badge == 'Etudiants'){

            const etudiant = await Etudiants.findOne({where : {email : req.user.email} , include : [Filieres,Semestre, Option]})

            const semestres = await Semestre.findAll()

            return res.render('auth/changerMdp', {user:req.user , error,etudiant,semestres,getDate,error})

        }else if(user.badge == 'Profs'){

            const filieres = await Filieres.findAll()

            const prof = await Profs.findOne({where : {email :req.user.email}})

            return res.render('auth/changerMdp', {user:req.user,prof,filieres,error,getDate})

        }

        
    }
    
}

module.exports = {register , login , postregister , postlogin,redirect, changerMdp, postChangerMdp}