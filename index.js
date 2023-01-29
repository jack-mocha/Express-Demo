const Joi = require('joi'); //joi returns a class
const express = require('express');
const app = express();

//middleware
app.use(express.json()); //enable parsing of json object in the body of the request.

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//single parameter
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)
        res.status(404).send('Not Found');

    res.send(course);
});

//multiple parameters
//access query
app.get('/api/posts/:year/:month', (req, res) => {
    // res.send(req.params);
    res.send(req.query);
});

app.post('/api/courses', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const result = schema.validate(req.body);
    if(result.error) {
        res.status(400).send(result.error);
        return; //remember to return; otherwise, the code will keep going.
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)
        res.status(404).send('Not Found');

    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const result = schema.validate(req.body);
    if(result.error) {
        res.status(400).send(result.error);
        return; //remember to return; otherwise, the code will keep going.
    }        

    course.name = req.body.name;
    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));