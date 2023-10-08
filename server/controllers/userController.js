const ApiError = require('../errors/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/user')
const emailValidator = require('deep-email-validator')


const generateJwt = (id, email) => {
    return jwt.sign({id, email}, 
        process.env.SECRET_KEY,
        {expiresIn: '1h'})
}


class UserController {
    async registration(req, res, next) {
        try {
            const {name, email, password} = req.body

            const {valid} = await emailValidator.validate(email)

            // if(!valid) {
            //     return next(ApiError.badRequest(`Incorrect email`));
            // }

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
            return next(ApiError.internal(`Server error: ${e.message}`))
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
                            }
            })            
        } catch (e) {
            return next(ApiError.internal('Server error'))
        }
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email)
        return res.json({token})
    }


    async getUsers(req, res, next) {
        try {
            const users = await User.findAll()
            if(!users) {
                return next(ApiError.internal('Users not found'))
            }
            return res.json({users})
        } catch (e) {
            return next(ApiError.internal('Server error'))
        }
    }


    async getUserById(req, res, next) {
        try {
            const _id = req.params.id;
            const user = await User.findOne({where: {id: _id}})
            if(!user) {
                return next(ApiError.internal('User with this id not found'))
            }
            return res.json({user})
        } catch (e) {
            return next(ApiError.internal('Server error'))
        }
    }


    async deleteUsers(req, res, next) {
        try {
            await User.truncate()
            
            return res.json({message: 'All users have been successfully deleted'})
        } catch (e) {
            return next(ApiError.internal('Server error'))
        }
    }


    async deleteUserById(req, res, next) {
        try {
            const _id = req.params.id
            const user = await User.findOne({where: {id: _id}})
            if(!user) {
                return next(ApiError.internal('User with this id not found'))
            }
            await User.destroy({where: {id: _id}})
            return res.json({message: 'The user has been successfully deleted'})
        } catch (e) {
            return next(ApiError.internal('Server error'))
        }
    }


    async updateUsers(req, res, next) {
        try {
            const {status} = req.body
            await User.update({status: status}, {where: {}})
            
            return res.json({message: 'All users have been successfully updated'})
        } catch (e) {
            return next(ApiError.internal(`Server error, e= ${e.message}`))
        }
    }


    async updateUserById(req, res, next) {
        try {
            const {status} = req.body
            const _id = req.params.id
            const user = User.findOne({where: {id: _id}})

            if(!user) {
                return next(ApiError.internal('User with this id not found'))
            }
            await User.update({status: status}, {where: {id: _id}})
            
            return res.json({message: 'User has been successfully updated'})
        } catch (e) {
            return next(ApiError.internal(`Server error: ${e.message}`))
        }
    }
}

module.exports = new UserController()