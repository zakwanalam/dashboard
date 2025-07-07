import { DataTypes } from "sequelize"
import sequelize from "./db.js"

const Manager = sequelize.define("Manager", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
}, {
  timestamps: false // 👈 disable createdAt and updatedAt
})

export default Manager