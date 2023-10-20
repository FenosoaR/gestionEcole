//authentification>yarn add express ejs express-ejs-layouts express-session connect-flash bcryptjs passport passport-local

const express = require('express')
const layout = require('express-ejs-layouts')
const fileUpload = require('express-fileupload')
const database = require('./models')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

const AdminRoute = require('./routes/AdminRoute')
const SecurityRoute = require('./routes/SecurityRoute')
const ProfRoute = require('./routes/ProfRoute')
const EtudiantsRoute = require('./routes/EtudiantsRoute')

const { ensureAuthenticated, ensureNonAuthenticated } = require('./config/security')

require('./config/passport')(passport)

const app = express()

app.use(fileUpload())
app.use(layout)
app.set('view engine' ,'ejs')
app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:false}))

app.use(session({
    resave:true,
    secret:'test test',
    saveUninitialized:true
}))

app.use(flash())

app.use((req,res, next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()

})

app.use(passport.initialize())
app.use(passport.session())



app.use('/admin' ,ensureAuthenticated, AdminRoute)
app.use('/' , SecurityRoute)
app.use('/profs' , ProfRoute)
app.use('/etudiants' , EtudiantsRoute)

database.sequelize.sync({force:false})
.then(() => {
    app.listen(5000 , () =>{
        console.log('server started on http://localhost:5000/');
    })    
})
.catch( error => console.log(error))