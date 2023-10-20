const express =require('express')
const { home, cahierTexte, postcahierTexte, releveNote, edt } = require('../controllers/EtudiantsController')

const router = express.Router()

router.get('/home' , home)
router.get('/cahierTexte' , cahierTexte)
router.post('/cahierTexte' ,postcahierTexte)
router.get('/releveNote/:FiliereId/:OptionId/:SemestreId/:id' , releveNote)
router.get('/edt/:FiliereId/:OptionId/:SemestreId/' , edt)

module.exports = router