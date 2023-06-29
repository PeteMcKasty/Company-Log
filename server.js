const fs = require('fs');
const mysql = require('mysql');
const inquirer = require('inquirer');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'company_db',
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
  executeSchemaSQL();
});

// Execute the schema.sql file
function executeSchemaSQL() {
  const schemaPath = './db/schema.sql'; // Path to the schema.sql file

  // Read the schema.sql file
  fs.readFile(schemaPath, 'utf8', (err, data) => {
    if (err) throw err;

    // Execute the SQL queries in the schema.sql file
    connection.query(data, (err) => {
      if (err) throw err;
      console.log('Schema SQL executed successfully.');

      // Start the application after executing the schema.sql
      startApp();
    });
  });
}

  // Function to start the application
function startApp() {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'View all departments':
            viewAllDepartments();
            break;
          case 'View all roles':
            viewAllRoles();
            break;
          case 'View all employees':
            viewAllEmployees();
            break;
          case 'Add a department':
            addDepartment();
            break;
          case 'Add a role':
            addRole();
            break;
          case 'Add an employee':
            addEmployee();
            break;
          case 'Update an employee role':
            updateEmployeeRole();
            break;
          case 'Exit':
            console.log('Goodbye!');
            connection.end();
            break;
          default:
            console.log('Invalid action.');
            startApp();
            break;
        }
      });
  }

  // Function to view all departments
function viewAllDepartments() {
    const query = 'SELECT * FROM departments';
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    });
  }

  // Function to view all roles
function viewAllRoles() {
    const query = `
      SELECT
        roles.role_id,
        roles.title,
        departments.department_name,
        roles.salary
      FROM roles
      INNER JOIN departments ON roles.department_id = departments.department_id
    `;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    });
  }

  // Function to view all employees
function viewAllEmployees() {
  const query = `
    SELECT
      employees.employee_id,
      employees.first_name,
      employees.last_name,
      roles.title,
      departments.department_name,
      roles.salary,
      CONCAT(managers.first_name, ' ', managers.last_name) AS manager
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.role_id
    INNER JOIN departments ON roles.department_id = departments.department_id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.employee_id
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: 'departmentName',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      const query = 'INSERT INTO departments SET ?';
      connection.query(query, { department_name: answer.departmentName }, (err) => {
        if (err) throw err;
        console.log('Department added successfully.');
        startApp();
      });
    });
}

// Function to add a role
function addRole() {
  // Retrieve the list of departments from the database to present as choices
  const query = 'SELECT * FROM departments';
  connection.query(query, (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Enter the title of the role:',
        },
        {
          name: 'salary',
          type: 'number',
          message: 'Enter the salary for the role:',
        },
        {
          name: 'departmentId',
          type: 'list',
          message: 'Select the department for the role:',
          choices: departments.map((department) => ({
            name: department.department_name,
            value: department.department_id,
          })),
        },
      ])
      .then((answers) => {
        const query = 'INSERT INTO roles SET ?';
        connection.query(
          query,
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.departmentId,
          },
          (err) => {
            if (err) throw err;
            console.log('Role added successfully.');
            startApp();
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee() {
  // Retrieve the list of roles from the database to present as choices
  const query = 'SELECT * FROM roles';
  connection.query(query, (err, roles) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'firstName',
          type: 'input',
          message: "Enter the employee's first name:",
        },
        {
          name: 'lastName',
          type: 'input',
          message: "Enter the employee's last name:",
        },
        {
          name: 'roleId',
          type: 'list',
          message: "Select the employee's role:",
          choices: roles.map((role) => ({
            name: role.title,
            value: role.role_id,
          })),
        },
        {
          name: 'managerId',
          type: 'number',
          message: "Enter the employee's manager ID (if applicable):",
        },
      ])
      .then((answers) => {
        const query = 'INSERT INTO employees SET ?';
        connection.query(
          query,
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: answers.roleId,
            manager_id: answers.managerId || null,
          },
          (err) => {
            if (err) throw err;
            console.log('Employee added successfully.');
            startApp();
          }
        );
      });
  });
}

// Function to update an employee role
function updateEmployeeRole() {
  // Retrieve the list of employees from the database to present as choices
  const employeeQuery = 'SELECT * FROM employees';
  connection.query(employeeQuery, (err, employees) => {
    if (err) throw err;

    // Retrieve the list of roles from the database to present as choices
    const roleQuery = 'SELECT * FROM roles';
    connection.query(roleQuery, (err, roles) => {
      if (err) throw err;

      inquirer.prompt([
        {
          name: 'employeeId',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.employee_id,
          })),
        },
        {
          name: 'newRoleId',
          type: 'list',
          message: 'Select the new role for the employee:',
          choices: roles.map((role) => ({
            name: role.title,
            value: role.role_id,
          })),
        },
      ])
      .then((answers) => {
        const query = 'UPDATE employees SET role_id = ? WHERE employee_id = ?';
        connection.query(
          query,
          [answers.newRoleId, answers.employeeId],
          (err) => {
            if (err) throw err;
            console.log('Employee role updated successfully.');
            startApp();
          }
        );
      });
  });
  })
}