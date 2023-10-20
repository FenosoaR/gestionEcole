module.exports = (sequelize , datatype) =>{
    return sequelize.define('CahierTexte' , {
        ProfEcId:{
            type:datatype.INTEGER,
             allowNull:false
        },
        heureDebut:{
            type:datatype.INTEGER,
            allowNull:false
        },
        heureFin:{
            type:datatype.INTEGER,
            allowNull:false
        },
        resteVh : {
            type:datatype.INTEGER,
            allowNull:false
        },
        FiliereId : {
            type:datatype.INTEGER,
        },
        OptionId : {
            type:datatype.INTEGER,
        },
        SemestreId : {
            type:datatype.INTEGER,
        }
    })
}