const fs = require('fs');
const path = require('path')

const usersFilePath = path.join(__dirname, 'user.json');

//Function to read file
function readUsers() {
    if(!fs.existsSync(usersFilePath)){
        console.log('Users file not found, initializing an empty file.');
        writeUsers([]); // Initialize the file if it doesn't exist
        return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    try {
        return JSON.parse(data);
    }catch (err){
        console.error('Error parsing JSON data:', err);
        return[];
    }
}

//Function to write users to file
function writeUsers(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error writing to file:', err);
    }
}

// CRUD function

//Function to add new user
function createUser(fname, lname) {
    const users = readUsers();
    users.push({ fname, lname} );
    writeUsers(users);
    console.log(`User ${fname} ${lname} created.`);
}

//Function to read user list
function readUsersList() {
    const users = readUsers();
    console.log('Users: ');
    users.forEach( user => {
        console.log(`${user.fname} ${user.lname}`);
    });
}

//Function to update existing user
function updateUser(oldFname, oldLname,  newFname, newLname) {
    const users = readUsers();
    const user = users.find(u => u.fname === oldFname && u.lname === oldLname);
    if(user) {
        user.fname = newFname;
        user.lname = newLname;
        writeUsers(users);
        console.log(`User ${oldFname} ${oldLname} updated to ${newFname} ${newLname}.`);
    }else {
        console.log(`User ${oldFname} ${oldLname} not found.`);
    }
}   

//Functio to delete user
function deleteUser(fname, deleteAll) {
    let users = readUsers();
    if(deleteAll){
        users = users.filter(u => u.fname !== fname);
        console.log(`All users with first name ${fname} deleted.`);
    }else{
        const index = users.findIndex(u => u.fname === fname);
        if(index !== -1){
            users.splice(index, 1);
            console.log(`User ${fname} deleted.`);
        }else{
            console.log(`User ${fname} not found.`);
        }
    }
    writeUsers(users);
}

//Command lIne arguments parsing
const [,, command, ...args] = process.argv;

//Command Handling
switch(command) {
    case 'user:create':
        createUser(args[0], args[1]);
        break;
    case 'user:read':
        readUsersList();
        break;
    case 'user:update':
        updateUser(args[0], args[1], args[2], args[3]);
        break;
    case 'user:delete':
        deleteUser(args[0], args.includes('--all'));
        break;
    default:
        console.log('Unknown command');                
}