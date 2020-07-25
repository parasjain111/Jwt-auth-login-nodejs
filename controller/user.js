const User=require('../models/user');
const jwt=require('jsonwebtoken');
const expressjwt=require('express-jwt');
exports.signup=(req,res)=>{
    console.log(req.body);
    const user =new User(req.body);
    user.save((err,user)=>{
        if(err){
            res.status(400).json({
                err
            })
        }
        res.json({
            user:user
        })
    })
}


exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty();
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.signin = (req, res) => {
 
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            });
        }
        const token = jwt.sign({ _id: user._id }, 'KJSFNVJKLSNFLVKNDSFKNVKDSF');
         res.cookie('t', token, { expire: new Date() + 9999 });
        const { _id, name, email} = user;
        return res.json({ token, user: { _id, email, name} });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success' });
};


exports.userbyid = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    });
};

exports.update = (req, res) => {
    const { name, password } = req.body;

    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};


exports.remove=(req,res)=>{
    let userprofile=req.profile
    userprofile.remove((err,deluser)=>{
        if(err){
            res.status(400).json({
                err
            })
        }
        res.json({user:deluser})
    })

}

exports.users=(req,res)=>{
    User.find().exec((err,users)=>{
        if(err){
            res.status(400).json(err)
        }
        res.json({
            user:users
        })
    })
}
