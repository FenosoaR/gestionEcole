module.exports = (sequelize, datatype) =>{
    return sequelize.define('Filieres'  ,{
        id:{
            primaryKey:true,
            autoIncrement:true,
            type:datatype.INTEGER
        },
        nom:{
            allowNull:false,
            type:datatype.STRING
        },
    })
}