module.exports=(sequelize , datatype) => {
    return sequelize.define('Ue' , {
        id:{
            type:datatype.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        nom:{
            type:datatype.STRING,
            allowNull:true
        }
    })
}