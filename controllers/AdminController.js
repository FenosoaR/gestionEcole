const {Filieres , Etudiants ,Semestre , Ue , Ec , Profs , ProfEc, EtudiantEc , Edt,Salle , Users , Option} =require('../models')
const path = require('path')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const {getDate} = require('../libs/getDate')

Option.hasOne(Etudiants)
Etudiants.belongsTo(Option)

Filieres.hasOne(Etudiants)
Etudiants.belongsTo(Filieres)
Semestre.hasOne(Etudiants)
Etudiants.belongsTo(Semestre)

Option.hasOne(Profs)
Profs.belongsTo(Option)

Filieres.hasOne(Profs)
Profs.belongsTo(Filieres)
Semestre.hasOne(Profs)
Profs.belongsTo(Semestre)

Filieres.hasOne(Ue)
Ue.belongsTo(Filieres)
Semestre.hasOne(Ue)
Ue.belongsTo(Semestre)
Option.hasOne(Ue)
Ue.belongsTo(Option)

Ue.hasOne(Ec)
Ec.belongsTo(Ue)

Profs.hasOne(ProfEc)
ProfEc.belongsTo(Profs)

Ec.hasOne(ProfEc)
ProfEc.belongsTo(Ec)

Ec.hasOne(EtudiantEc)
EtudiantEc.belongsTo(Ec)

Ue.hasOne(EtudiantEc)
EtudiantEc.belongsTo(Ue)

Etudiants.hasOne(EtudiantEc)
EtudiantEc.belongsTo(Etudiants)

Profs.hasOne(Edt)
Edt.belongsTo(Profs)

Ec.hasOne(Edt)
Edt.belongsTo(Ec)

Salle.hasOne(Edt)
Edt.belongsTo(Salle)

const home = async(req, res) =>{

    const filieres = await Filieres.findAll()
    
    res.render('admin/home' , {filieres})
}

const choisirOption = async(req, res) =>{

    const FiliereId = req.params.FiliereId

    const options = await Option.findAll({where : {FiliereId}})

    return res.render('admin/choisirOption' , {options , FiliereId})
}

const nav = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId

    const option = await Option.findOne({where : {id : OptionId}})
    const filiere = await Filieres.findOne({where : {id : FiliereId}})

    return res.render('admin/nav' , {FiliereId , OptionId ,option, filiere})
}


const dashboard = async(req, res) =>{
    
    const filieres = await Filieres.findAll()

    res.render('admin/dashboard' , {filieres})
}

const addEtudiants = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId

    const option = await Option.findOne({where : {id : OptionId}})
    const filiere = await Filieres.findOne({where : {id : FiliereId}})

  
    return res.render('admin/addEtudiants' , {SemestreId , FiliereId ,OptionId, user:req.user, filiere , option})
}

const postaddEtudiants = async(req , res)=>{
    
       
        const {nom , prenom, dateNaissance, contact, email, adresse, sexe,semestres, filieres, options} = req.body
        // const pdp = req.files ? req.files.pdp : null verifiena si req.files existe

        let pdp = null
        if (req.files && req.files.pdp) {
            pdp = req.files.pdp;
        }

        if(pdp){

            let ext = path.extname(pdp.name)
                let newFilename = `FILE-${Date.now()}${ext}`

                pdp.mv(`public/upload/${newFilename}` , (error)  =>{
                    if(error){
                        console.log(error);
                    }
                })

             data = {
                    nom,
                    prenom,
                    dateNaissance,
                    contact,
                    email,
                    adresse,
                    sexe,
                    pdp:newFilename,
                    FiliereId:filieres,
                    SemestreId: semestres,
                    OptionId: options,
                }

        }else{
            
            data = {
                nom,
                prenom,
                dateNaissance,
                contact,
                email,
                adresse,
                sexe,
                pdp:null,
                FiliereId:filieres,
                SemestreId: semestres,
                OptionId: options,
            }
        }
            

        const newEtudiants = Etudiants.build(data)

        let date = new Date()

        let mdp = `${nom}${date.getMilliseconds()}`
        
        console.log(mdp);

        const hashedPassword = bcrypt.hashSync(mdp , 12)

        const newUser = Users.build({
            nom,
            prenom,
            email,
            password : hashedPassword,
            badge:'Etudiants'
        })
        


        await newEtudiants.save()
        await newUser.save()

    
        return res.redirect(`/admin/chercherEtudiants/${filieres}/${options}/${semestres}`)
    }

const allEtudiants = async(req, res) =>{
    
    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const OptionId = req.params.OptionId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})
    

    const semestres =  await Semestre.findAll()

    const etudiants = await Etudiants.findAll({where : {FiliereId , OptionId}})
    

    return res.render(`admin/allEtudiants` , {etudiants , FiliereId , semestres , SemestreId , OptionId, user:req.user, filiere, option})
}

const deleteEtudiants = async (req, res)  =>{

    const id = req.params.id
    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId

    await Etudiants.destroy({where : {id}})

    return res.redirect(`/admin/chercherEtudiants/${FiliereId}/${OptionId}/${SemestreId}`)
}

const chercherEtudiants = async(req, res)  =>{

    const SemestreId = req.params.SemestreId
    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const etudiant = await Etudiants.findAll({where : {FiliereId , SemestreId , OptionId}})

    return res.render('admin/chercherEtudiants' , {etudiant , SemestreId , FiliereId , OptionId , user:req.user, filiere, option, getDate})
}

const updateEtudiants = async (req, res) =>{

    const id = req.params.id
    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})
    
    const etudiant = await Etudiants.findOne({where : {id}})

    return res.render('admin/updateEtudiants' , {etudiant , FiliereId ,OptionId, SemestreId ,user:req.user, filiere, option})
}

const postUpdateEtudiants = async(req, res) =>{

    try {

    const {id,nom,prenom,dateNaissance,sexe,pdp,contact,email,adresse,semestres ,filieres ,options} = req.body

    const etudiant = {nom,prenom,dateNaissance,sexe,pdp,contact,email,adresse,semestres}

    await Etudiants.update(etudiant , {where : {id}})

    return res.redirect(`/admin/allEtudiants/${filieres}/${options}`)

    } catch (error) {

        console.log(error);
    }

    
}

const voirEtudiants = async(req, res) =>{

    const id = req.params.id
    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const etudiant = await Etudiants.findOne({where:{id}})
    const semestres =  await Semestre.findAll()


    return res.render('admin/voirEtudiants' , {etudiant , FiliereId , OptionId,SemestreId,user:req.user, filiere, option, getDate, semestres})
}

const selectDelegue = async(req, res) =>{

    const id = req.params.id
    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId

    const listeEtudiant = await Etudiants.findAll({where : {delegue : false,FiliereId ,OptionId,SemestreId}}) 

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    return res.render('admin/selectDelegue' ,{user:req.user,FiliereId,SemestreId,OptionId,filiere,option,listeEtudiant})
}

const postSelectDelegue = async(req, res)=>{

    const {etudiant, filiere, semestre, option} = req.body

    const OneEtudiant =  await Etudiants.findOne({where : {id : etudiant}})

    let data = {
        nom:OneEtudiant.nom,
        prenom:OneEtudiant.prenom,
        email:OneEtudiant.email,
        contact:OneEtudiant.contact,
        dateNaissance : OneEtudiant.dateNaissance,
        adresse : OneEtudiant.adresse,
        pdp :OneEtudiant.pdp,
        sexe : OneEtudiant.sexe,
        OptionId:OneEtudiant.OptionId,
        FiliereId:OneEtudiant.FiliereId,
        SemestreId : OneEtudiant.SemestreId,
        delegue : true
    }

    await Etudiants.update(data , {where : {id : etudiant}})

    return res.redirect(`/admin/chercherEtudiants/${filiere}/${option}/${semestre}`)
}
const postaddUe = async(req, res)=>{

    const {nom , filieres , semestres , options} = req.body

    const newUe = Ue.build({
        nom,
        FiliereId:filieres,
        SemestreId:semestres,
        OptionId : options
    })

    await newUe.save()

    return res.redirect(`/admin/oneUe/${filieres}/${options}/${semestres}`)
}

const allUe = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const OptionId = req.params.OptionId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const ues = await Ue.findAll()
    const semestres = await Semestre.findAll()

    return res.render('admin/allUe' , {ues , FiliereId ,OptionId, semestres , SemestreId ,user:req.user, filiere, option})

}

const OneUe = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const OptionId = req.params.OptionId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const ues = await Ue.findAll({where : {FiliereId , SemestreId , OptionId}})

    return res.render('admin/OneUe' , {ues , FiliereId ,SemestreId, OptionId ,user:req.user, filiere, option})
}

const deleteUe = async(req, res)=>{

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const id = req.params.id

    await Ec.destroy({where : {UeId : id }})
    await Ue.destroy({where : {id}}) 
    

    return res.redirect(`/admin/oneUe/${FiliereId}/${SemestreId}`)

}

const allEc =  async(req, res)=>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId
    const UeId = req.params.UeId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})
    const ue =  await Ue.findOne({where : {id : UeId}})

    const ecs = await Ec.findAll({where : {UeId}})
    

    return res.render('admin/allEc' , {ecs ,ue, FiliereId , UeId ,OptionId, SemestreId , user:req.user, filiere, option})
}

const postaddEc = async(req, res) =>{

    const {ue , nom , filieres ,semestres ,options,vh} = req.body

    const newEc = Ec.build({
        nom,
        VH:vh,
        UeId:ue
    })

    await newEc.save()

    return res.redirect(`/admin/allEc/${filieres}/${options}/${semestres}/${ue}`)
}

const deleteEc = async(req, res)=>{


    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const OptionId = req.params.OptionId
    const UeId = req.params.UeId
    const id = req.params.id

    await Ec.destroy({where : { id }})
    
    
    return res.redirect(`/admin/allEc/${FiliereId}/${OptionId}/${SemestreId}/${UeId}`)
}

const listeProf = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const profs = await Profs.findAll({where : {FiliereId , SemestreId , OptionId}})

    for(prof of profs){
            const ecs =  await ProfEc.findAll({where : {ProfId : prof.id} , include : Ec})
            
            for(item of ecs){
                prof.ec = item.Ec.nom
            }
    }
    // console.log(profs);
    const valeurExclu = []

    const profEc = await ProfEc.findAll()

    profEc.map((value , index) =>{
        valeurExclu.push(value.EcId)
    })

    const ecs = await Ec.findAll({
         where:{
            id:{
                [Op.notIn]: valeurExclu
            },
    }, include : Ue})
   
    return res.render('admin/listeProfs' , {FiliereId ,OptionId, profs ,user:req.user, filiere, option, SemestreId, ecs})
}

const postaddProf = async(req, res) =>{

    let date = new Date()

    const {nom , prenom , contact , filieres ,options, email, ecs, semestres} = req.body


    let password = `${nom}${date.getMilliseconds()}`

    console.log(password);

    const hashedPassword = bcrypt.hashSync(password , 12)

    let data = {
        nom,
        prenom,
        contact,
        email,
        FiliereId:filieres,
        OptionId:options,
        SemestreId:semestres,
        password : hashedPassword
    }

    const newProf = Profs.build(data)

    const previousData = await newProf.save()
    
    const newEc = ProfEc.build({
        ProfId:previousData.id,
        EcId:ecs
    })
       
    await newEc.save()


    const newUser = Users.build({
        nom,
        prenom,
        email,
        password : hashedPassword,
        badge:'Profs'
    })
 
    await newUser.save()

    return res.redirect(`/admin/listeProfs/${filieres}/${options}/${semestres}`)
}

const allProf = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const semestres =  await Semestre.findAll()
    

    const profs = await Profs.findAll()
   
    return res.render('admin/allProfs' , {FiliereId ,OptionId,  profs ,user:req.user, filiere, option, semestres})
}



const matiereProf = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const id = req.params.id

    const matiere = await ProfEc.findAll({include : Ec , where : {ProfId : id }})

    console.log(matiere);

    return res.render('admin/matiereProf' , {matiere , FiliereId , user:req.user})

}

const note = async(req, res)  =>{

    const FiliereId = req.params.FiliereId
    const OptionId =  req.params.OptionId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})


    const semestres = await Semestre.findAll()

    return res.render('admin/note', {FiliereId ,OptionId, semestres ,user:req.user, option})
}

const noteEtudiants = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId

    const etudiant = await Etudiants.findAll({where : {FiliereId  ,SemestreId}})

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    return res.render('admin/noteEtudiants' , {FiliereId ,OptionId, SemestreId, etudiant,option,user:req.user})

}

const addNotes = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const OptionId = req.params.OptionId
    const id = req.params.id

    let error = []

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const etudiant = await Etudiants.findOne({where : {id}})

    const ues = await Ue.findAll({where : {FiliereId , SemestreId, OptionId}})

    let matieres = []
   
    for(item of ues){
        ecs =  await Ec.findAll({where : {UeId : item.id}, include :Ue})
        matieres.push(ecs)
    }
   
    return res.render('admin/addNote' , {FiliereId , SemestreId ,OptionId, etudiant,ues , id ,user:req.user, option,matieres, error})
      
}
const postAddNote = async(req, res)=>{ 

    let error = []

    const {notes , EcId ,UeId,id, FiliereId,SemestreId, OptionId,EtudiantId } = req.body

    if(notes != ''){

         existingNotes = await EtudiantEc.findOne({
            where: {
              EtudiantId: EtudiantId,
              EcId: EcId,
              UeId: UeId,
              note : notes
            },
        });
    }

    if(existingNotes){
        error.push('Vous avez deja enter sa note')
    }

    if(error.length == 0){

        EcId.map(async(value , index) => {
    
            const newNote = EtudiantEc.build({
                        EtudiantId : id ,
                        EcId: value ,
                        UeId: UeId[index],
                        note : notes[index],
            })
            
            await newNote.save()
        })
      
    }

  
    return res.redirect(`/admin/noteEtudiants/${FiliereId}/${OptionId}/${SemestreId}`)

}
const releveNote = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId
    const id = req.params.id

    const etudiant = await Etudiants.findOne({ where : {id}})
    const semestre =  await Semestre.findOne({where : {id : SemestreId}})
 
    
    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

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

    for(ue of ues){
        if(ue.moyenneParUe > 9 && MoyenneGeneral  > 9 ){

            let date =  new Date()

            let data = {

                nom : etudiant.nom,
                prenom:etudiant.prenom,
                dateNaissance:etudiant.dateNaissance,
                adresse : etudiant.adresse,
                contact : etudiant.contact,
                pdp:etudiant.pdp,
                email:etudiant.email,
                sexe:etudiant.sexe,
                OptionId:etudiant.OptionId,
                FiliereId:etudiant.FiliereId,
                SemestreId : semestre.nom + 1,
                createdAt : date

            }

            await Etudiants.update(data , {where :{FiliereId:etudiant.FiliereId, OptionId:etudiant.OptionId , id : etudiant.id}})

        }
    }
   
    return res.render('admin/releveNote' ,{FiliereId , SemestreId,OptionId,notes,option,etudiant,user:req.user, ues, MoyenneGeneral,SommeGeneral})     
   
}
const addNoteRepechage = async(req, res) =>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId
    const id = req.params.id

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const etudiant = await Etudiants.findOne({where : {id}})

    const notes =  await EtudiantEc.findAll({where : {EtudiantId : id} , include :[Ec, Ue]})

    return res.render('admin/addNoteRepechage' , {notes, option, etudiant,user:req.user, FiliereId, OptionId, SemestreId, notes,id})

}
const postNoteRepechage = async(req, res) =>{

    const {notes , EcId ,UeId,id, FiliereId,SemestreId, OptionId,EtudiantId } = req.body


    EcId.map(async(value , index) =>{

        const noteEtudiant = await EtudiantEc.findAll({where : {EtudiantId : EtudiantId , EcId : value }})

            let data =  {
                EtudiantId :noteEtudiant.EtudiantId,
                EcId: value ,
                UeId: UeId[index],
                note : notes[index],
           }
    
           await EtudiantEc.update(data , {where : {EtudiantId : EtudiantId , EcId : value }})
        
        })
   
  
    return res.redirect(`/admin/noteEtudiants/${FiliereId}/${OptionId}/${SemestreId}`)

}

const edt = async(req, res)  =>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const semestres = await Semestre.findAll()

    return res.render('admin/edt' , {FiliereId ,OptionId, semestres , user:req.user, option, filiere})
}

const edtSemestre = async(req, res)=>{

    const FiliereId = req.params.FiliereId
    const OptionId =req.params.OptionId
    const SemestreId = req.params.SemestreId

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

    return res.render('admin/edtSemestre', {FiliereId , SemestreId ,OptionId, user:req.user, option, edtParJours,filiere, getJours, dateDebutSemaine,dateFinSemaine, getDate})
}

const addEdt = async(req, res)  =>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId
    const SemestreId = req.params.SemestreId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const profec = await ProfEc.findAll({include : [Profs , Ec]}) 

    
    const salleExist = []

    const edt = await Edt.findAll({where : {FiliereId,OptionId, SemestreId}})

    edt.map((value , index) =>{
        salleExist.push(value.SalleId)
    })

    const salles = await Salle.findAll({
         where:{
            id:{
                [Op.notIn]: salleExist
            },
    }})
 
    return res.render('admin/addEdt' , {FiliereId , SemestreId ,OptionId, profec, user:req.user, option, salles})
}

const postaddEdt = async(req, res)   =>{

    let error = []
    const {profec,heureDebut,heureFin,date, filieres, options, semestres, salle} = req.body

    const profEc =  await ProfEc.findOne({where : {id : profec} , include :[Profs , Ec]})

   let edt

    if(heureDebut  != '' && heureFin != '' && date != ''){

         edt = await Edt.findOne({where :{ heure_debut : heureDebut , heure_fin : heureFin , date : new Date(date)}})
    }
    
    if(edt){

        error.push('Cette date  plus disponible')
    }
      
    if(error.length == 0){

    const newEdt = Edt.build({
            ProfId : profEc.Prof.id,
             EcId : profEc.Ec.id,
             heure_debut : heureDebut,
             heure_fin : heureFin,
             date:date,
             FiliereId : filieres,
             OptionId : options,
             SemestreId : semestres,
             SalleId : salle
         })
     
     await newEdt.save()

       
     return res.redirect(`/admin/edtSemestre/${filieres}/${options}/${semestres}`)

    }else{

        const FiliereId = req.params.FiliereId
        const OptionId = req.params.OptionId
        const SemestreId = req.params.SemestreId

        const filiere =  await Filieres.findOne({where : {id : FiliereId}})
        const option = await Option.findOne({where : {id : OptionId}})

        const profec = await ProfEc.findAll({include : [Profs , Ec]}) 
 
        return res.render('admin/addEdt' , {FiliereId , SemestreId ,OptionId, profec, user:req.user, option, error})
    }
   
    
        
}

const search =  async (req, res)=>{

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const {search} = req.query

    const etudiant =  await Etudiants.findAll({
        where :{ FiliereId, OptionId,
        [Op.or] : [
            {
                nom : {[Op.like] : `%${search}%`} 
            },
            {
                prenom : {[Op.like] : `%${search}%`} 
            }
        ]
    }})

    
    return res.render('admin/searchEtudiants', {FiliereId, OptionId,user:req.user, etudiant, option, filiere})  

   
}
const salles = async(req, res) => {

    const FiliereId = req.params.FiliereId
    const OptionId = req.params.OptionId

    const filiere =  await Filieres.findOne({where : {id : FiliereId}})
    const option = await Option.findOne({where : {id : OptionId}})

    const salles =  await Salle.findAll()

    return res.render('admin/salles' ,{user :req.user , option, FiliereId, OptionId, salles})
}





module.exports = {
    home,
    choisirOption,
    dashboard, 
    addEtudiants , 
    postaddEtudiants , 
    allEtudiants ,
    nav , 
    deleteEtudiants , 
    chercherEtudiants , 
    updateEtudiants,
    postUpdateEtudiants ,
    voirEtudiants ,
    selectDelegue,
    postSelectDelegue,
    note,
    noteEtudiants,
    addNotes,
    releveNote,
    postAddNote,
    addNoteRepechage,
    postNoteRepechage,
    postaddUe,
    allUe,
    OneUe,
    deleteUe,
    allEc,
    postaddEc,
    deleteEc,
    postaddProf,
    allProf,
    listeProf,
    matiereProf,
    edt,
    addEdt,
    postaddEdt,
    edtSemestre,
    search,
    salles
}