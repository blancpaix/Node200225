module.exports = (sequelize, DataTypes) => {
    return sequelize.define('schedule', {
        date : {
            type : DataTypes.DATE,
            allowNull : false
        },
        broadcastor : {
            type: DataTypes.STRING,
            allowNull : false
        },
        channel : {
            type: DataTypes.INTEGER,
            allowNull : false
        },
        time : {
            type: DataTypes.DATE,
            allowNull : true
        },
        title : {
            type: DataTypes.STRING,
            allowNull : false
        },
        limit : {
            type: DataTypes.STRING,
            allowNull : false
        },
        genre : {
            type: DataTypes.STRING,
            allowNull : false
        },
    }, {
        timestamps : false
    })
}