INSERT INTO departments (department_name)
VALUES
  ('Sales'),
  ('Marketing'),
  ('Finance'),
  ('Human Resources');


-- Insert sample data into the roles table
INSERT INTO roles (title, salary, department_id)
VALUES
  ('Sales Manager', 60000.00, 1),
  ('Sales Representative', 40000.00, 1),
  ('Marketing Manager', 55000.00, 2),
  ('Marketing Coordinator', 35000.00, 2),
  ('Financial Analyst', 65000.00, 3),
  ('Accountant', 45000.00, 3),
  ('HR Manager', 50000.00, 4),
  ('HR Assistant', 30000.00, 4);

  -- Insert sample data into the employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Michael', 'Johnson', 2, 1),
  ('Emily', 'Davis', 3, 1),
  ('David', 'Wilson', 4, 3),
  ('Jessica', 'Anderson', 5, 4),
  ('Daniel', 'Thompson', 5, 4),
  ('Sarah', 'Taylor', 6, 5),
  ('Olivia', 'Miller', 6, 5),
  ('Matthew', 'Thomas', 7, 6),
  ('Andrew', 'White', 7, 6);