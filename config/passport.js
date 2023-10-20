const LocalStrategy = require('passport-local').Strategy//config strategy
const {Users} = require('../models')//hakana information anle models
const bcrypt = require('bcryptjs')


module.exports = (passport) => 
{
    passport.use(
        //usernameField:parametre unique ao anaty bdd
        new LocalStrategy({usernameField:'email'} , async(email, password, done) => {

            const user = await Users.findOne({where:{email}})

            if(!user)
                return done(null ,false ,{message:'Votre email est invalide'})

            const isValid = bcrypt.compareSync(password , user.password)

            if(!isValid)
                return done(null,false,{message:'Mot de passe invalide'})
            
            return done(null,user)
        })
    )

    passport.serializeUser((user ,done) => {
        //mamafa ilay info momba user sady mamafa cookie 
        done(null , user.id)
    })

    passport.deserializeUser(async(id , done) =>{
        //mametraka info retraretra
        const user = await Users.findOne({where:{id:id}})

        done(null , user)

    })
}