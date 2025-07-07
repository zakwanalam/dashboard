import express from 'express'
import sequelize from './db.js'
import Manager from './manager.js'
import cors from 'cors'
import Department from './department.js'
import Employee from './employee.js'
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
app.get('/api/managers', async (req, res) => {
  try {
    const managers = await Manager.findAll()
    res.json(managers)
  } catch (err) {
    console.error("Error fetching managers:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})
Department.belongsTo(Manager, { foreignKey: 'manager_id', as: 'manager' });
Manager.hasMany(Department, { foreignKey: "manager_id" });

app.get('/api/getDepartments', async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: {
        model: Manager,
        as: 'manager', // alias used
        attributes: ['name'],
      },
    });

    const formatted = departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      description: dept.description,
      manager_id: dept.manager_id,
      manager_name: dept.manager?.name || "", 
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
});


Employee.belongsTo(Department, { foreignKey: 'department_id' })

app.get('/api/getEmployees', async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: {
        model: Department,
        attributes: ['name'],
        include: {
          model: Manager,
          as: 'manager',
          attributes: ['id', 'name', 'email']
        }
      }
    });

    const formattedEmployees = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department_id: emp.department_id ?? null,
      department_name: emp.Department?.name ?? null,
      manager_name: emp.Department?.manager?.name ?? null,
      manager_email: emp.Department?.manager?.email ?? null,
    }));
    res.status(200).json(formattedEmployees);
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

app.get("/api/getManagers", async (req, res) => {
  const departmentWithManagers = await Department.findAll({
    include: {
      model: Manager,
      as: 'manager',
      attributes: ['id', 'name', 'email'],
    },
  });
  const uniqueManagers = new Map();
  departmentWithManagers.forEach(dept => {
    const mgr = dept.manager;
    if (mgr && !uniqueManagers.has(mgr.email)) {
      uniqueManagers.set(mgr.email, {
        id: mgr.id,
        name: mgr.name,
        email: mgr.email,
        isManager: true,
      });
    }
  });

  const formattedManagers = Array.from(uniqueManagers.values());

  res.status(200).json(formattedManagers);
});


app.post("/api/saveEmployee", async (req, res) => {
  const form = req.body
  const { name, email, department_id, role } = form
  try {
    if (role === null) {
      //Manager
      const newManager = await Manager.create(
        {
          name,
          email,
          department_id
        }
      )
      res.status(201).send(newManager)

    }
    else {
      //Employee
      const newEmployee = await Employee.create(
        {
          name, email, department_id, role
        }
      )
      res.status(201).send(newEmployee)
    }
  } catch (error) {
    res.status(400).send({ message: "Failed to create new employee or manager" })
  }
  console.log(form)
})
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
