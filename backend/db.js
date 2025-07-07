// db.js
import { Sequelize } from 'sequelize'

// ✅ Choose your DB type:
const sequelize = new Sequelize('test', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // or 'mysql', 'sqlite', etc.
  logging: false,      // optional: set to true to see SQL queries
})

export default sequelize
