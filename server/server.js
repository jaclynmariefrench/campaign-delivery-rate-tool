const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:8080',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// Load data from JSON file
let data = JSON.parse(fs.readFileSync('data.json'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/email-form', (req, res) => {
    const formData = req.body;
    console.log(formData);
    // Add form data to data object
    data.push(formData);
    // Save data object to JSON file
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.send('Form data received');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});