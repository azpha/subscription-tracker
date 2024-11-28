import Storage from './Storage.js'
import jwt from 'jsonwebtoken'
import type {
    Request,
    Response,
    NextFunction
} from 'express'

interface JWTPayload {
    userId: number
    email: string
}
declare module 'express' {
    interface Request {
        user?: JWTPayload
    }
}

async function verifyJwt(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.authToken

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: "No token provideed"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JWTPayload
        req.user = decoded
        next()
    } catch (e) {
        return res.status(401).json({
            status: 401,
            message: "Invalid token"
        })
    }
}

async function fetchUser(id: number) {
    return await Storage.user.findFirst({
        where: {
            id
        }
    })
}
async function isUserAdministrator(id: number) {
    const user = await Storage.user.findFirst({
        where: {
            id
        }
    })
    return user?.admin
}

export default {
    verifyJwt,
    fetchUser,
    isUserAdministrator
}