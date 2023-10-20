module.exports = (sequelize, datatype) =>{
    return sequelize.define('Etudiants'  ,{
        id:{
            primaryKey:true,
            autoIncrement:true,
            type:datatype.INTEGER
        },
        nom:{
            allowNull:false,
            type:datatype.STRING
        },
        prenom:{
            type:datatype.STRING,
            allowNull:false
        },
        dateNaissance:{
            type:datatype.DATE,
            allowNull:false
        },
        adresse:{
            type:datatype.STRING,
            allowNull:false
        },
        contact:{
            type:datatype.STRING,
            allowNull:false
        },
        email:{
            type:datatype.STRING,
            allowNull:false
        },
        sexe:{
            type:datatype.STRING,
            allowNull:false
        },
        pdp:{
            type:datatype.STRING,
            allowNull:true
        },
        delegue:{
            type:datatype.BOOLEAN,
            defaultValue : false
        }
    })
}