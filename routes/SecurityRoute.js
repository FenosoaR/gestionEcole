const express = require('express')
const { ensureNonAuthenticated, ensureAuthenticated } = require('../config/security')
const { register, login, postregister, postlogin, redirect, changerMdp, postChangerMdp, } = require('../controllers/SecurityController')
const router = express.Router()

router.get('/register' , ensureNonAuthenticated,register)
router.post('/register' , ensureNonAuthenticated,postregister)
router.get('/' , ensureNonAuthenticated, login)
router.post('/' , ensureNonAuthenticated,postlogin)
router.get('/redirect' , ensureAuthenticated, redirect)

router.get('/logout', ensureAuthenticated,(req,res)=>{
    //mamafa info ao anaty req http
    req.logout((error) =>{
        if(error){
            console.log(error);
        }else{
            req.flash('success' ,'you\'re logged out')
            return res.redirect('/')
        }
    })
})
router.get('/changerMdp/:id', changerMdp)
router.post('/changerMdp/:id', postChangerMdp)

module.exports = router