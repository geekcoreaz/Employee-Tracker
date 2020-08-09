// Set variables
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const Employee = require("./lib/Employee");

// Setup connection to MySQL server.
const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "rootroot",
    database: "employee_db"
});

// Test the connection to the server.
connection.connect(err => {
    if (err) throw err;
    console.log("You are connected as id " + connection.threadId + "\n");
    startApp();
});


function startApp() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                new inquirer.Separator(),
                "View employees",
                "View departments",
                "View roles",
                new inquirer.Separator(),
                "Add employees",
                "Add departments",
                "Add roles",
                new inquirer.Separator(),
                "Update employee roles"
            ]
        })
        .then(answer => {
            // Call one of the functions to query the database
            switch (answer.action) {
                case "View employees":
                    viewEmp();
                    break;

                case "View departments":
                    viewDept();
                    break;

                case "View roles":
                    viewRole();
                    break;

                case "Add employees":
                    addEmp();
                    break;

                case "Add departments":
                    addDept();
                    break;

                case "Add roles":
                    addRoles();
                    break;

                case "Update employee roles":
                    updateRole();
                    break;
            }
        });
}
// Function to view the list of Employees.
function viewEmp() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

// Function to view the Departments an Employee is in.
function viewDept() {
    console.log("Selecting all departments info. \n");
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

// Function to view an Employee's role.
function viewRole() {
    console.log("Selecting roles info. \n");
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

// Functions to add Employee information when user is prompted to add an Employee
function insertEmployee(connection, employee) {
    const query = connection.query(
        "INSERT INTO employee SET ?", {
        first_name: employee.firstName,
        last_name: employee.lastName,
        role_id: employee.roleID,
        manager_id: employee.managerID
    },
        (err, res) => {
            if (err) throw err;
            console.log(res.affectedRows + " new employee inserted! \n");
        });
}

function addEmp() {
    console.log("Please enter the following information: \n");
    connection.query(`SELECT role.id, role.title, employee.first_name, employee.last_name, employee.manager_id FROM role JOIN employee ON role.id = employee.role_id`, (err, res) => {
        if (err) throw err;
        const resultedRows = res;
        console.table(res);
        // Inquirer Prompt to ask for Employee information.
        inquirer
            .prompt([{
                name: "name",
                type: "input",
                message: "Enter employee's first name: "
            },
            {
                name: "lastname",
                type: "input",
                message: "Enter employee's last name: "
            },
            {
                name: "role",
                type: "list",
                message: "Please select employee's role: ",
                choices: resultedRows.map(row => `${row.id} ${row.title}`)
            },
            {
                name: "manager",
                type: "list",
                message: "Please select employee's manager: ",
                choices: resultedRows.map(row => `${row.manager_id} ${row.first_name} ${row.last_name}`)
            }
            ])
            .then(answer => {
                const roleId = answer.role[0];
                const managerID = answer.manager[0];
                const employee = new Employee("", answer.name, answer.lastname, roleId, managerID);
                insertEmployee(connection, employee);
                viewEmp();
            });
    });
};

// Function to add a new department to the database.
function addDept() {
    console.log("Please enter the following information: \n");
    inquirer
        .prompt([{
            name: "name",
            type: "input",
            message: "Enter departments's name: "
        }])
        .then(answer => {
            const query = connection.query(
                "INSERT INTO department SET ?", {
                name: answer.name,
            },
                (err, res) => {
                    if (err) throw err;
                    console.log(res.affectedRows + " new department inserted!\n");
                });
            viewDept();
        });
};
// Function to add a new role to the database.
function addRoles() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const departmentRows = res;
        console.table(res);
        console.log("Please enter the following information: \n");
        inquirer
            .prompt([{
                name: "title",
                type: "input",
                message: "Enter new role's title: "
            },
            {
                name: "salary",
                type: "number",
                message: "Enter new role's salary"
            },
            {
                name: "dep",
                type: "list",
                message: "Please select the department",
                choices: departmentRows.map(row => `${row.id} ${row.name}`)
            }
            ])
            .then(answer => {
                const depId = answer.dep[0];
                connection.query(
                    "INSERT INTO role SET ?", {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: depId
                },
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " new role inserted! \n");
                    });
                viewRole();
            });
    });
};
// Function to update Employee roles
function updateRole() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const employeeRows = res;
        console.table(res);
        inquirer.prompt({
            name: "employee",
            type: "list",
            message: "Please select employee to update",
            choices: employeeRows.map(row => `${row.id} ${row.first_name} ${row.last_name}`)
        })
            .then(answers => {
                const empId = answers.employee[0];
                console.log("Selected employee ID is ", empId);

                connection.query(`SELECT employee.id, employee.First_name, employee.last_name, employee.role_id, role.title FROM employee, role`, (err, res) => {
                    if (err) throw err;
                    const roleRow = res;
                    console.table(res);
                    inquirer.prompt({
                        name: "role",
                        type: "list",
                        message: "Please enter a new role id",
                        choices: roleRow.map(row => `${row.role_id} ${row.title}`)
                    })
                        .then(answer => {
                            const roleID = answer.role[0];
                            connection.query("UPDATE employee SET ? WHERE ?",
                                [{ role_id: roleID }, { id: empId }],
                                (err, res) => {
                                    if (err) throw err;

                                    console.log(res.affectedRows + " role is updated! \n");
                                    startApp();
                                });
                        });
                });
            });
    });
};