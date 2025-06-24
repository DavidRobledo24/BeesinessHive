const {Sequelize, DataTypes}= require('sequelize');
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST}= process.env;
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD,{
    dialect: 'mysql',
    host: DB_HOST
});


const User = sequelize.define('User',{
    idUsuario:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false 
    },
    nombreCompleto:{
        type:DataTypes.STRING,
        allowNull: false
    },
    cedula:{
        type:DataTypes.STRING,
        allowNull: false
       
    },
   
    numero:{
        type:DataTypes.STRING,
        allowNull: false,

    },
    correo:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true

    },
    contrasena:{
        type:DataTypes.STRING,
        allowNull: false,

    },
    company_name:{
        type:DataTypes.STRING,
        allowNull: false
    },
    departamento:{
        type:DataTypes.STRING,
        allowNull: false

    },
    direccion:{
        type:DataTypes.STRING,
        allowNull: false

    }
}, {});

(async()=>{
    await sequelize.sync();
})();

module.exports = {
    sequelize,
    User
  };