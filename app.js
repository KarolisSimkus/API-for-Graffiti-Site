const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const {graphqlHttp} = require('graphql-http/lib/use/express');
const graphql = require('express-graphiql-explorer');

const app = express();

const graffRoutes = require('./api/routes/graffs');
const blogRoutes = require('./api/routes/blogs');
const userRoutes = require('./api/routes/user');

const graphqlSchema = require('./api/graphql/schema');
const graphqlResolver = require('./api/graphql/resolvers');

mongoose.connect(
    'mongodb+srv://bite:' +
     process.env.MongoPass +
     '@nodejs.76jcfgg.mongodb.net/?retryWrites=true&w=majority&appName=nodejs'
)
;


app.use(morgan('dev'));
// \/---- it's bad cause it's public to everyone, but idc my head hurts:)
app.use('/uploads', express.static('uploads'));
//app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'Options'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
});

app.use(
    '/graphql',
    graphql({
        schema: graphqlSchema,
        rootValue: graphqlResolver
    })
);

// app.all('/graphql', (req, res) =>
//     grapqlHttp.createHandler({
//         schema: graphqlSchema,
//         rootValue: graphqlResolver,
//         context: { req, res },
//     })(req, res)
// );

app.use('/graffs', graffRoutes);
app.use('/blogs', blogRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) =>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500)
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports = app;