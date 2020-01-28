const express = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const config = require('config');








router.get('/', auth, (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            res.json(user)
        })
        .catch(err => console.log(err.message))
})







router.post('/', [
    check('email', 'Please include a valide email!').isEmail(),
    check('password', 'Password is required!').not().isEmpty()
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    User.findOne({ email })
        .then(user => {
            if (!user) {
                // Check is user exists
                return res.status(400).json({ msg: "Please Register Before!" })
            } else {
                // Compare Password
                bcrypt.compare(String(password), String(user.password), (err, isMatch) => {
                    if (err) {
                        console.log(err.message)
                    } else if (isMatch) {
                        const payload = {
                            user: {
                                id: user.id
                            }
                        }

                        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600000 }, (err, token) => {
                            if (err) throw err
                            res.json({ token })
                        })
                    } else {
                        return res.status(400).json({ msg: "Wrong Password" })
                    }
                })
            }
        })
        .catch(err => {
            console.error(err.message)
            res.status(500).send('Server error')
        })
})


module.exports = router


