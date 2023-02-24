const { PrismaClient } = require('@prisma/client')
const config = require("../config/auth.config");
const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn'],
    }
)

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// signup body :{
//     "username": "Tests",
//     "password": "123456789",
// }


exports.signup = (req, res) => {
    // check if username already exist
    prisma.user.findFirst({
        where: {
            username: req.body.username
        },
    }).then((user) => {
        if (user) {
            res.status(400).send({
                status: false,
                message: "Username already exist"
            })
        } else {
            var password = bcrypt.hashSync(req.body.password, 12);
            prisma.user.create({
                data: {
                    username: req.body.username,
                    email: req.body.email,
                    password: password,
                }
            }).then((user) => {
                resuser = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                }
                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 604800, // 7 days
                });

                res.send({ user: resuser, status: true, message: "User created successfully", token: token })
            })
        }
    })
}


// signin body :{
//     "username": "Tests",
//     "password" : "123456789"
// }
exports.signin = (req, res) => {
    // check if username already exist
    prisma.user.findFirst({
        where: {
            username: req.body.username
        },
    }).then((user) => {
        if (!user) {
            return res.status(200).send({ status: false, message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(200).send({
                status: false,
                message: "Invalid Password!",
            });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 604800, // 7 days
        });

        resuser = {
            id: user.id,
            username: user.username,
            email: user.email,
        }


        res.status(200).send({
            status: true,
            message: "Login Success",
            token: token,
            user: resuser
        });
    })
}


