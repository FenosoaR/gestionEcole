const express = require('express')
const { ensureAuthenticated } = require('../config/security')
const { homeProf, cdt, edt } = require('../controllers/ProfController')
const router = express.Router()

router.get('/home' , ensureAuthenticated, homeProf)
router.get('/cahierTexte' , cdt)
router.get('/edt/:FiliereId/:OptionId/:SemestreId/' , edt)

module.exports = router