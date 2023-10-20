module.exports = (sequelize , datatype) =>{
    return sequelize.define('Users' , {
        id:{
            primaryKey:true,
            autoIncrement : true,
            type:datatype.INTEGER
        },
        nom :{
            allowNull:false,
            type:datatype.STRING
        },
        prenom:{
            type:datatype.STRING,
            allowNull:false
        },
        email:{
            type:datatype.STRING,
            allowNull:false
        },
        password:{
            type:datatype.STRING,
            allowNull:false
        },
        badge:{
            type:datatype.STRING,
            defaultValue: 'admin'
        }
    })
}