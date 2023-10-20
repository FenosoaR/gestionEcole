module.exports = (sequelize , datatype) =>{
    return sequelize.define('EtudiantEc' , {
        EtudiantId:{
            type:datatype.INTEGER
        },
        EcId:{
            type:datatype.INTEGER
        },
        UeId:{
            type:datatype.INTEGER
        },
        note:{
            type:datatype.INTEGER,
            allowNull:false,
        },
    })
}