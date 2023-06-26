-- Query to view all departments with department names and department ids
SELECT * FROM departments;

-- Query to view all roles with job title, role id, department name, and salary
SELECT roles.role_id, roles.title, departments.department_name, roles.salary
FROM roles
INNER JOIN departments ON roles.department_id = departments.department_id;

-- Query to view all employees with employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers they report to
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
LEFT JOIN employees AS managers ON employees.manager_id = managers.employee_id;