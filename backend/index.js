import express from 'express'
import sequelize from './db.js'
import Manager from './manager.js'
import cors from 'cors'
import Department from './department.js'
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection has been established successfully.')
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error)
  }
}

testConnection()
const app = express()

app.use(cors())
app.use(express.json());
app.get('/api/managers',async(req,res)=>{
    try {
    const managers = await Manager.findAll()
    res.json(managers)
  } catch (err) {
    console.error("Error fetching managers:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})
Department.belongsTo(Manager, { foreignKey: 'manager_id' });
Manager.hasMany(Department, { foreignKey: "manager_id" });

app.get('/api/getDepartments', async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: {
        model: Manager,
        attributes: ['name'], // only get manager name
      },
    });

    // Optional: Format output (flatten the manager name)
    const formatted = departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      description: dept.description,
      manager_id: dept.manager_id,
      manager_name: dept.Manager?.name || "",
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
});

app.post("/api/saveDepartment", async (req, res) => {
  const { name, description, manager_id } = req.body;

  if (!name || !manager_id) {
    return res.status(400).json({ message: "Name and manager_id are required." });
  }

  try {
    const newDepartment = await Department.create({
      name,
      description,
      manager_id,
    });

    res.status(201).json(newDepartment);
  } catch (error) {
    console.error("Error saving department:", error);
    res.status(500).json({ message: "Failed to save department", error });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app is running on port${port}`);
});
