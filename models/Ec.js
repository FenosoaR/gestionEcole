module.exports=(sequelize , datatype) => {
    return sequelize.define('Ec' , {
        id:{
            type:datatype.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        nom:{
            type:datatype.STRING,
            allowNull:false
        }, 
        VH:{
            type:datatype.INTEGER,
            allowNull:false
        }
    })
}