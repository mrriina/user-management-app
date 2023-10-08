const ApiError = require('../errors/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/user')


const generateJwt = (id, email) => {
    return jwt.sign({id, email}, 
        process.env.SECRET_KEY,
        {expiresIn: '1h'})
}


class UserController {
    async registration(req, res, next) {
        const {name, email, password} = req.body
        if(!email || !password || !name) {
            return next(ApiError.badRequest('Incorrect input'))
        }
        const candidate = await User.findOne({where: {email}})
        if(candidate) {
            return next(ApiError.badRequest(`User with email ${email} already exists`))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({name, email, password: hashPassword})
        const token = generateJwt(user.id, email)
        
        return res.json({token})
    }

    async login(req, res) {
        
    }

    async check(req, res) {
        const query = req.query
        res.json(query)
    }
}

module.exports = new UserController()