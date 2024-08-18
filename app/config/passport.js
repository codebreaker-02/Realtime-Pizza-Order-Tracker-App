const LocalStategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

function init(passport){
    passport.use(new LocalStategy({usernameField: 'email'}, async (email, password, done) => {
        //Login logic
        const user = await User.findOne({email: email});
        if(!user){
            return done(null, false, {message: 'No user with this email!'})
        }
        bcrypt.compare(password, user.password).then(match => {
            if(match){
                return done(null, user, {message: 'Logged in successfully'});
            }
            return done(null, false, {message: 'Wrong username or password'});
        }).catch(err => {
            return done(null, false, {message: 'Something went wrong'});
        });
    }))

    //This method is used to store something in sessions
    //Here we are storing user.id in session, so that we can access it later 
    passport.serializeUser((user, done) => {
        done(null, user._id);    
    })

    //Here is an important question regarding serialize and deserialize
    //Q. Why do we need to use deserilizeUser method? Can't we just store the user object in session? Let's assume we cannot store the user object in session, then why can't we just use the user._id to fetch the user object from the database?
    //=> First of all we cannot store the user object directly because it is too large and it will take a lot of space in the session also it is not secure to store the user object in session.
    //Then coming onto the the fetching part, we can use the user._id to fetch the user object from the database but it will be a lot of work to fetch the user object from the database everytime the user makes a request. So, we use the deserializeUser method to store the user object in session and fetch it from there.

    //Q. But my question is deserialize is also retrieving the user object from the database, so how is it different from fetching the user object from the database everytime?
    //=> Yes, you are right that deserialize is also retrieving the user object from the database but the difference is that it is only retrieving the user object from the database only once and storing it in the session. So, when the user makes a request, it will not have to fetch the user object from the database everytime, it will just fetch the user object from the session.
    //But the user object will be accessible to user and it is not good i think? And if we have the user object 
    //=> Oh I got it, that the user will be only able to see the user object in the session if he has access to the session and if he has access to the session then he is already logged in and he can see his own data. So, it is not a security issue.

    //This method is used to retrieve the data from session
    passport.deserializeUser((id, done)=>{
        User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
    })
}

module.exports = init;