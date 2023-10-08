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
        try {
            const {name, email, password} = req.body

            if(!isValidEmail(email)) {
                return next(ApiError.badRequest('Invalid email'));
            }

            if(password.length < 1 || password.length > 20) {
                return next(ApiError.badRequest('Password must be between 1 and 20 characters'));
            }

            const candidate = await User.findOne({where: {email}})
            if(candidate) {
                return next(ApiError.badRequest(`User with email ${email} already exists`))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({name, email, password: hashPassword})
            const token = generateJwt(user.id, email)
            
            return res.json({token})
        } catch (e) {
            return next(ApiError.internal('Server error'))
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({where: {email}})
            if(!user) {
                return next(ApiError.internal('User not found'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if(!comparePassword) {
                return next(ApiError.internal('Invalid password specified'))
            }
    
            if(user.status === 'block'){
                return next(ApiError.badRequest('User blocked'))
            }
            
            await User.update({signIn: Date.now()}, {where: {email}})
    
            const token = generateJwt(user.id, user.email)
            return res.json({token,
                            user: {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                signUp: user.signUp,
                                signIn: user.signIn,
                                status: user.status,
            }})            
        } catch (e) {
            return next(ApiError.internal('Server error'))
        }

        
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email)
        return res.json({token})
    }
}

module.exports = new UserController()