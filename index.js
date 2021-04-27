const Joi = require('joi');     // To validate objects        // return class
const express = require('express');     // return a function
const app = express();                  // return an object
const bodyParser = require('body-parser');
var path = require('path');

app.use(express.json());//enable parsing json object in body
app.use(express.static(__dirname)); // for html purpose
app.use(bodyParser.urlencoded({extended : false})); //get post req from html


const courses = [];
const students = [];

                            ///////////////////// read operation ///////////////////////////////

// To respond to http get request (home page)
app.get('/', (req, res) => {
    //route handler
    res.send('Welcome to LMS');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('The course with the given ID was not found.');
        return;
    }
    res.send(course);
});

app.get('/api/students', (req, res) => {
    res.send(students);
});

app.get('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('The student with the given ID was not found.');
        return;
    }
    res.send(student);
});

app.get('/web/student/create',(req , res) =>{

    const b = path.join(__dirname,'/student.html')
    res.sendFile(b);
});

app.get('/web/course/create',(req , res) =>{

    const b = path.join(__dirname,'/course.html')
    res.sendFile(b);
});

                           ////////////////////// Create operation //////////////////////
app.post('/api/students',(req , res) => {

    const { error } = validateStudent(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
}

    const student = {
        Name: req.body.Name,
        Code: req.body.Code ,
        id: students.length +1       
    };
    console.log('adding student');
    students.push(student);
    res.send(student);  
});
app.post('/api/courses',(req , res) => {

    const { error } = validateCourse(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        Name: req.body.Name,
        Code : req.body.Code,
        id: courses.length +1,
        Description : req.body.Description
        
    };
    console.log('adding course');
    courses.push(course);
    res.send(course);  
});



                            ///////////////////// html forms for createe //////////////
app.post('/web/student/create',(req , res) => {
    console.log("create a new student...")

    // const result= validateStudent({"Name" : req.body.create_name,"Code" : req.body.create_code}); // result.error
    // if (result.error) return res.status(400).send(result.error);
    
    const student = {
        Name: req.body.create_name,
        Code: req.body.create_code ,
        id: students.length +1       
    };


    console.log('Student added succesfully');
    students.push(student);

    //res.send(student);
    res.redirect('/web/student/create')
    res.end()
});

app.post('/web/course/create',(req , res) => {
    console.log("create a new course...")

    // const result= validateCourse({"Name" : req.body.create_name,"Code" : req.body.create_code,
    //  "Description" :req.body.create_description}); // result.error
   
    //  if (result.error) return res.status(400).send(result.error);
    
    const course = {
        Name: req.body.create_name,
        Code: req.body.create_code ,
        id: courses.length +1,
        Description : req.body.create_description   
    };

    console.log('Course added succesfully');
    courses.push(course);
    res.redirect('/web/course/create')
    //res.send(course);
    res.end();

});
                            /////////////////// UPDATE operation /////////////////////
app.put('/api/courses/:id', (req , res )=>{
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.'); // error 404 object not found
        
    // validate 
    // If not valid, return 400 bad request
    const result= validateCourse(req.body); // result.error
    if (result.error) return res.status(400).send(result.error.details[0].message);
        

    // Update the course 
    // Return the updated course
    course.Name = req.body.Name;
    course.Code =  req.body.Code;
    course.Description  = req.body.Description;

    res.send(course);

});
app.put('/api/students/:id', (req , res )=>{
    // Look up the student 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('The student with the given ID was not found.'); // error 404 object not found
        
    // validate 
    // If not valid, return 400 bad request
    const result= validateStudent(req.body); // result.error
    if (result.error) return res.status(400).send(result.error);
        

    // Update the student 
    // Return the updated student
 

    student.Name = student.Name  ;
    student.Code = student.Code ;

    res.send(student);

});


                            /////////////////// DELETE operation ////////////////////////////////

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.'); // error 404 object not found
 

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});
app.delete('/api/students/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('The student with the given ID was not found.'); // error 404 object not found
 

    // Delete
    const index = students.indexOf(student);
    students.splice(index, 1);

    // Return the same student
    res.send(student);
});



// Environment variable
const port = process.env.PORT || 3000;
app.listen(port /*PortNumber*/, () => console.log(`Listening on port ${port}...`) /* optionally a function that called when the app starts listening to the given port */);

function validateCourse(course) {
    const schema = {
        Name: Joi.string().min(5).required() ,
        Code: Joi.string().regex(RegExp(/^[a-zA-Z]{3}[0-9]{3}$/)).required() ,
        Description: Joi.string().max(200).optional().allow("")
       };
    return Joi.validate(course, schema);
}

function validateStudent(student) {
    const schema ={

        Name: Joi.string().required().regex(/^[a-zA-Z'-]+$/),
        Code: Joi.string().min(7).max(7).required()
    }
     ;
    return Joi.validate(student, schema);
}
