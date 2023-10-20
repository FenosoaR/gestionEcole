module.exports = (sequelize , datatype) =>{
    return sequelize.define('Option' , {
        id:{
            primaryKey: true,
            autoIncrement :true,
            type:datatype.INTEGER
        },
        intitule:{
            type:datatype.STRING,
            allowNull:true
        }
    })
}