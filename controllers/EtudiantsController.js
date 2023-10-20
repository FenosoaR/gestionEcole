const{Option,Filieres , EtudiantEc,Etudiants ,Ue, Semestre, Profs, Ec, ProfEc, CahierTexte,Edt,Salle} = require('../models')
const {getDate} =require('../libs/getDate')
const {Op} =require('sequelize')

ProfEc.hasOne(CahierTexte)
CahierTexte.belongsTo(ProfEc)

const home = async(req, res)  =>{

    const etudiant = await Etudiants.findOne({where : {email : req.user.email} , include : [Filieres,Semestre, Option]})

    const semestres = await Semestre.findAll()

     return res.render('etudiants/home' , {user:req.user , etudiant,semestres ,getDate})
}
const releveNote = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId
    const id = req.params.id

    const etudiantReleve = await Etudiants.findOne({ where : {id}})

    const etudiant = await Etudiants.findOne({where : {email : req.user.email} , include : [Filieres,Semestre, Option]})

    const semestres = await Semestre.findAll()

    const ues =  await Ue.findAll({where : {FiliereId , OptionId , SemestreId}})
 
    const notes = await EtudiantEc.findAll({where : {EtudiantId : id} , include :[Ec,Ue]})

    let SommeGeneral = 0
    let MoyenneGeneral
   
    for(item of ues){

        notesParUe =  await EtudiantEc.findAll({where : {EtudiantId : id , UeId : item.id }, include :[Ec,Ue]})

        let sommeParUe = 0
    
        for(noteParUe of notesParUe){
           sommeParUe =  sommeParUe + noteParUe.note
           nomUe = noteParUe.Ue.nom
        }
        
        item.nomUe = nomUe
        item.nomEc = notesParUe
        item.sommeParUe = sommeParUe
        item.moyenneParUe = sommeParUe / notesParUe.length
        SommeGeneral = SommeGeneral + item.sommeParUe
    }
    
    MoyenneGeneral = SommeGeneral / notes.length


    return res.render('etudiants/releveNote' ,{FiliereId , SemestreId,OptionId,notes,etudiant,etudiantReleve,semestres,user:req.user, ues, MoyenneGeneral,SommeGeneral, getDate})     


}
const cahierTexte = async(req, res) =>{

    const etudiant = await Etudiants.findOne({where : {email : req.user.email} , include : [Filieres,Semestre, Option]})

    const cdt =  await CahierTexte.findAll({where : {FiliereId : etudiant.Filiere.id , OptionId : etudiant.Option.id , SemestreId : etudiant.Semestre.id},
        include : ProfEc})

    const profs = await Profs.findAll({where : {SemestreId : etudiant.Semestre.id }}) 

    for(prof of profs){

        const profEc =  await ProfEc.findAll({where : {ProfId : prof.id},include : [Profs, Ec]})

        for(item of profEc){
            
            prof.Profec = item.id
            prof.ec = item.Ec.nom

        }

    }
      
    
    const semestres = await Semestre.findAll()


    for(item of cdt){
      
       const prof =  await Profs.findOne({where : {id : item.ProfEc.ProfId}})
       
       const ec =  await Ec.findOne({where : {id : item.ProfEc.EcId}})
    
        item.prof = prof.nom
        item.ec = ec.nom

    }
  
    
    return res.render('etudiants/cahierTexte' , { profs,cdt, user:req.user, etudiant, semestres, getDate})
}

const postcahierTexte = async(req, res) =>{

    const {heureDebut , heureFin , profEc,filiere, semestre, option} = req.body

    const ecProf = await ProfEc.findOne({where : {id : profEc}})

    const ec = await Ec.findOne({where : {id : ecProf.EcId}})

    let vh = ec.VH

    let resteVh = vh - (heureFin - heureDebut) 

    let data = {
        nom : ec.nom,
        VH : resteVh,
    }

    await Ec.update(data , {where : {id : ecProf.EcId}})

    const newCahier = CahierTexte.build({
        heureDebut,
        heureFin,
        ProfEcId : profEc,
        resteVh : resteVh,
        FiliereId:filiere,
        OptionId:option,
        SemestreId:semestre
    })

    await newCahier.save()
    

    return res.redirect('/etudiants/cahierTexte')

}

const edt =  async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const OptionId =req.params.OptionId
    const SemestreId = req.params.SemestreId

    
    const etudiant = await Etudiants.findOne({where : {email : req.user.email} , include : [Filieres,Semestre, Option]})

    const semestres = await Semestre.findAll()

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    let jours = ['Lundi', 'Mardi', 'Mercredi' , 'Jeudi' , 'Vendredi']

    function getJours(day){

        let dayIndex = day.getDay()

        return `${jours[dayIndex - 1]}`
    }

    const dateDebutSemaine = new Date();
    
    dateDebutSemaine.setHours(0, 0, 0, 0); // Réglez l'heure à minuit (début de la journée)
    dateDebutSemaine.setDate(dateDebutSemaine.getDate() - dateDebutSemaine.getDay() + 1); // Détermine le premier jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)
    
    const dateFinSemaine = new Date(dateDebutSemaine);
    dateFinSemaine.setDate(dateDebutSemaine.getDate() + 5);


    const edt =  await Edt.findAll({where : {FiliereId, OptionId,SemestreId,
        date : {
            [Op.between]: [dateDebutSemaine,dateFinSemaine]
        }
    },include : [Profs, Ec,Salle]})
   
    let edtParJours = {Lundi : [], Mardi : [],Mercredi : [],Jeudi : [],Vendredi : []}

    for(item of edt){
        let jours = getJours(item.date)
        edtParJours[jours].push(item)
    }

    return res.render('etudiants/edt', {FiliereId , SemestreId ,OptionId, user:req.user, option, edtParJours,filiere, getJours, dateDebutSemaine,dateFinSemaine, getDate, etudiant,semestres,user:req.user})
}


module.exports = {home, cahierTexte, postcahierTexte, releveNote, edt}