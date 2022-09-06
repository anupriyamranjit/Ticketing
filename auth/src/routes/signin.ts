import express, {Request, Response} from 'express';
import { BadRequestError } from '../../errors/bad-request-error';
import { User } from '../../models/user';
import { Password } from "../../services/password"
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request';
const router = express.Router();

router.post('/api/users/signin', [
    body('email')
    .isEmail()
    .withMessage("Email must be valid"),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password must be supplied')
],
    validateRequest,
async (req : Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email })
    if(!existingUser){
        throw new BadRequestError("Invalid Credential");
    }
    const match = await Password.compare(existingUser.password, password)
    if(!match){
        throw new BadRequestError("Invalid Credential");
    }
    const userJWT = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },process.env.JWT_KEY!)

    req.session = { 
        jwt: userJWT
    }
    res.status(200).send(existingUser)
})

export { router as signinRouter }