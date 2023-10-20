module.exports = (sequelize, datatype) =>{
    return sequelize.define('ProfEc' , {
        ProfId:{
            type:datatype.INTEGER
        },
        EcId:{
            type:datatype.INTEGER
        }
    })
}