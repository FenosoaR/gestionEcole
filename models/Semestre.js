module.exports = (sequelize, datatype) =>{
    return sequelize.define('Semestre'  ,{
        id:{
            primaryKey:true,
            autoIncrement:true,
            type:datatype.INTEGER
        },
        nom:{
            type:datatype.INTEGER
        },
    })
}