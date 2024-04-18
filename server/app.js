const express = require('express');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const projectRouter = require('./routes/projectRouter');
const taskRouter = require('./routes/taskRouter');

const app = express();

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
    // Créer la base de données "kanban" si elle n'existe pas
    mongoose.connection.db.listCollections({name: 'kanban'}).next(function(err, collinfo) {
        if (!collinfo) {
            mongoose.connection.db.createCollection('kanban');
            console.log("Database 'kanban' created");
        }
    });
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);
app.use('/api/task', taskRouter);

// Ajoutez un écouteur d'événement pour le démarrage du serveur
const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${server.address().port}`);
});

module.exports = app;
