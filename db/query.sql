-- Query to view all departments with department names and department ids
SELECT * FROM departments;

-- Query to view all roles with job title, role id, department name, and salary
SELECT roles.role_id, roles.title, departments.department_name, roles.salary
FROM roles
INNER JOIN departments ON roles.department_id = departments.department_id;