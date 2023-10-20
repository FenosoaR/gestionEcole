module.exports =(sequelize , datatype) => {
    return sequelize.define('Salle' ,{
        id:{
            type:datatype.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        numero : {
            type:datatype.INTEGER,
            allowNull :false
        }
    })
}