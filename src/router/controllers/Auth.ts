import Schemas from "../utilities/Schemas.js"
import Storage from "../services/Storage.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

async function RegisterAccount(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        Schemas.RegisterUserSchema.parse(req.body);

        // check if existing
        const isExistingUser = await Storage.user.findUnique({
            where: {
                email: req.body.email
            }
        })
        if (isExistingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }

        // check if an admin exists
        const serverAdminExists = await Storage.user.findFirst({
            where: {
                admin: true
            }
        })

        // hash
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // create user
        const user = await Storage.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                name: req.body.name,
                admin: !serverAdminExists
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        })

        // generate signed jwt token
        const token = jwt.sign(
            { userId: user.id, email: user.email},
            process.env.JWT_KEY as string,
            { expiresIn: '48h' }
        )

        res.setHeader(
            'Set-Cookie',
            `authToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=172800`
        )

        // if there was no previous server admin before, inherit all legacy subscriptions
        // to the admin user so they aren't lost
        if (!serverAdminExists) {
            await Storage.subscription.updateMany({
                data: {
                    userId: user.id
                }
            })
        }

        return res.status(200).json({
            success: true,
            user,
            token
        })
    } catch (e) {
        next(e)
    }
} 

async function AddPasswordToUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        Schemas.AddPasswordToUserSchema.parse(req.body)

        // find user
        const findUser = await Storage.user.findFirst({
            where: {
                email: req.body.email
            }
        })

        // check if user already has password
        if (findUser && findUser.password) {
            return res.status(400).json({
                success: false,
                message: "User already has password"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // update user
        const user = await Storage.user.update({
            where: {
                email: req.body.email
            },
            data: {
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        })

        // generate signed jwt token
        const token = jwt.sign(
            { userId: user.id, email: user.email},
            process.env.JWT_KEY as string,
            { expiresIn: '48h' }
        )

        res.setHeader(
            'Set-Cookie',
            `authToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=172800`
        )

        return res.status(200).json({
            success: true,
            user,
            token
        })

    } catch (e) {
        next(e)
    }
}

async function DoesAdminExist(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const admin = await Storage.user.findFirst({
            where: {
                admin: true
            }
        })

        if (admin) {
            return res.status(200).json({
                success: true,
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "No admin exists"
            })
        }
    } catch (e) {
        next(e)
    }
}

async function LoginAccount(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        Schemas.LoginUserSchema.parse(req.body)

        // find user
        const user = await Storage.user.findUnique({
            where: {
                email: req.body.email
            }
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "That user doesn't exist"
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.password)
        if (!isValidPass) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            })
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_KEY as string,
            { expiresIn: '48h' }
        )

        res.setHeader(
            'Set-Cookie',
            `authToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=172800`
        )

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        })
    } catch (e) {
        next(e)
    }
}

async function LogoutAccount(
    req: Request,
    res: Response
) {
    res.setHeader(
        'Set-Cookie',
        'authToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
    );
    return res.redirect("/")
}

async function FetchAuthedAccount(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await Storage.user.findUnique({
            where: {
                email: req.user?.email
            },
            select: {
                id: true,
                email: true,
                admin: true,
                name: true,
                createdAt: true
            }
        })

        if (user) {
            return res.status(200).json({
                success: true,
                user
            })
        } else {
            return res.redirect('/api/auth/logout')
        }
    } catch (e) {
        next(e)
    }
}

export default {
    RegisterAccount,
    AddPasswordToUser,
    LoginAccount,
    LogoutAccount,
    FetchAuthedAccount,
    DoesAdminExist
}