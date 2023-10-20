module.exports = (sequelize , datatype)  =>{
    return sequelize.define('Edt' , {
        id:{
            type:datatype.INTEGER,
            autoIncrement:true,
            primaryKey : true,
        },
        ProfId:{
            type : datatype.INTEGER
        },
        EcId:{
            type:datatype.INTEGER
        },
        heure_debut : {
            type:datatype.INTEGER
        },
        heure_fin : {
            type:datatype.INTEGER
        },
        date:{
            type:datatype.DATE
        },
        FiliereId:{
            type:datatype.INTEGER
        },
        OptionId:{
            type:datatype.INTEGER
        },
        SemestreId:{
            type:datatype.INTEGER
        }, 
        SalleId :{
            type: datatype.INTEGER
        }
    })
}