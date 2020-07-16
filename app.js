const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://gregpreed:P866w0rd889!!$$@gq-course.n64xy.mongodb.net/gq-course?retryWrites=true&w=majority';

const cors = require('cors');
const port = process.env.PORT || 4000;

mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true })
mongoose.connection.once('open', ()=>{
    console.log('yeah we are connected, again!')
})

const schema = require('./schema/schema')
const app = express();

app.use(cors());
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.listen(port, () => { //localhost:4000
    console.log('Listening for requests');
})