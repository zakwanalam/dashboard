import { DataTypes } from "sequelize";
import sequelize from "./db.js";


const Department = sequelize.define("Department", {
  
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
}, {
  timestamps: false, // ✅ This should be outside the field definitions
});


export default Department;