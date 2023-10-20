const {Filieres,Profs, ProfEc, Ec, CahierTexte,Option,Semestre,Edt,Salle} = require('../models')
const {Op}=require('sequelize')
const {getDate} =require('../libs/getDate')

const homeProf = async(req , res) =>{

    const filieres = await Filieres.findAll()

    const prof = await Profs.findOne({where : {email :req.user.email} ,include : [Filieres,Option,Semestre]})

    return res.render('profs/home' , {filieres, prof, user:req.user,getDate})
}
const cdt = async(req, res) =>{

    const filieres = await Filieres.findAll()

    const prof = await Profs.findOne({where : {email :req.user.email} , include : [Filieres , Option,Semestre]})

     const profec =  await ProfEc.findAll({where : {ProfId : prof.id} , include : [Profs , Ec]})

    let cdt

    for(item of profec){

       cdt =  await CahierTexte.findAll({where : {ProfEcId : item.id}})

      for(cd of cdt){

        cd.ec = item.Ec.nom

        const ec = await Ec.findOne({where : {id : item.Ec.id}})

        cd.vh = ec.VH 

        cd.salaire = (cd.heureFin - cd.heureDebut) * 40000
    }
     
    }

    return res.render('profs/cahierTexte' ,{user :req.user,prof,filieres,cdt})
}

const edt =  async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const OptionId =req.params.OptionId
    const SemestreId = req.params.SemestreId

    
    const prof = await Profs.findOne({where : {email :req.user.email} ,include : [Filieres,Option,Semestre]})

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

    return res.render('profs/edt', {FiliereId , SemestreId ,OptionId, user:req.user, option, edtParJours,filiere, getJours, dateDebutSemaine,dateFinSemaine, getDate, prof,semestres})
}



module.exports = {homeProf,cdt,edt}