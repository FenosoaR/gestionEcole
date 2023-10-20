const express = require('express')
const { ensureAuthenticated } = require('../config/security')
const { dashboard, addEtudiants, postaddEtudiants, allEtudiants, nav, deleteEtudiants, chercherEtudiants, updateEtudiants, postUpdateEtudiants, voirEtudiants, postaddUe, allUe, allEc, postaddEc, deleteUe, allProf, postaddProf, OneUe, deleteEc, matiereProf, note, noteEtudiants, addNotes, releveNote, addEdt, edt, postaddEdt, edtSemestre, listeProf, postAddNote, addNoteRepechage, postNoteRepechage, search, salles, home, choisirOption, selectDelegue, postSelectDelegue,} = require('../controllers/AdminController')
const router = express.Router()


router.get('/home' ,ensureAuthenticated, home)
router.get('/choisirOption/:FiliereId', ensureAuthenticated ,choisirOption)

router.get('/:id' , dashboard)
router.get('/addEtudiants/:FiliereId/:OptionId/:SemestreId' , addEtudiants)
router.post('/addEtudiants/:FiliereId/:OptionId/:SemestreId' , postaddEtudiants)
router.get('/allEtudiants/:FiliereId/:OptionId' , allEtudiants)
router.get('/nav/:FiliereId' , nav)
router.get('/deleteEtudiants/:FiliereId/:OptionId/:SemestreId/:id' ,  deleteEtudiants)
router.get('/chercherEtudiants/:FiliereId/:OptionId/:SemestreId' , chercherEtudiants)
router.get('/updateEtudiants/:FiliereId/:OptionId/:SemestreId/:id' , updateEtudiants)
router.post('/updateEtudiants' , postUpdateEtudiants)
router.get('/voirEtudiants/:FiliereId/:OptionId/:SemestreId/:id' , voirEtudiants)
router.get('/selectDelegue/:FiliereId/:OptionId/:SemestreId' , selectDelegue)
router.post('/selectDelegue/:FiliereId/:OptionId/:SemestreId' , postSelectDelegue)

router.get('/allUe/:FiliereId/:OptionId' , allUe)
router.post('/addUe/:FiliereId/:OptionId/:SemestreId' , postaddUe)
router.get('/oneUe/:FiliereId/:OptionId/:SemestreId' , OneUe)
router.get('/deleteUe/:FiliereId/:OptionId/:SemestreId/:id' , deleteUe)

router.get('/allEc/:FiliereId/:OptionId/:SemestreId/:UeId' , allEc)
router.post('/addEc/:FiliereId/:OptionId/:SemestreId/:UeId' , postaddEc)
router.get('/deleteEc/:FiliereId/:OptionId/:SemestreId/:UeId/:id' , deleteEc)

router.post('/addProfs/:FiliereId/:OptionId' , postaddProf)
router.get('/allProfs/:FiliereId/:OptionId' , allProf)
router.get('/listeProfs/:FiliereId/:OptionId/:SemestreId' , listeProf)
router.get('/matiereProf/:FiliereId/:id' , matiereProf)

router.get('/note/:FiliereId/:OptionId' , note)
router.get('/noteEtudiants/:FiliereId/:OptionId/:SemestreId' , noteEtudiants)
router.get('/addNote/:FiliereId/:OptionId/:SemestreId/:id',addNotes)
router.post('/addNote/:FiliereId/:OptionId/:SemestreId/:id' , postAddNote )
router.get('/releveNote/:FiliereId/:OptionId/:SemestreId/:id' , releveNote)
router.get('/addNoteRepechage/:FiliereId/:OptionId/:SemestreId/:id' , addNoteRepechage)
router.post('/postNoteRepechage/:FiliereId/:OptionId/:SemestreId/:id' , postNoteRepechage)
router.get('/search/:FiliereId/:OptionId' , search)

router.get('/edt/:FiliereId/:OptionId', edt)
router.get('/addEdt/:FiliereId/:OptionId/:SemestreId', addEdt)
router.post('/addEdt/:FiliereId/:OptionId/:SemestreId', postaddEdt)
router.get('/edtSemestre/:FiliereId/:OptionId/:SemestreId' , edtSemestre)
router.get('/salles/:FiliereId/:OptionId', salles)



module.exports = router