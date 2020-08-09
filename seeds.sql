use employee_db;

INSERT INTO department (name) VALUES ('Engineer');
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Marketing'); 
INSERT INTO department (name) VALUES ('Finance');
INSERT INTO department (name) VALUES ('Human Resources');


INSERT INTO role (title, salary, department_id) VALUES ('Lead Engineer', 150000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 60000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Salesperson', 40000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Coordinator', 60000, 3); 
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 80000, 4);
INSERT INTO role (title, salary, department_id) VALUES ('Human Resources Consultant', 35000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Arvid", "Sollom", 1, 1); 
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Rich", "Urban", 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dakota", "Franklin", 4, 3); 
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Justin", "Ruiz", 5, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jennifer", "Reinhart", 6, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Michael", "Hurley", 2, 5);