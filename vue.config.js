module.exports = {
    configureWebpack: {
        externals: {
            sequelize: "require('sequelize')",
            sqlite3: "require('sqlite3')"
        }
    }
};
