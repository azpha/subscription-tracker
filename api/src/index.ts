import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// import routes
import Routes from './routers';

// express types for error handler
import type {
    NextFunction,
    Request,
    Response
} from 'express';
import { ZodError } from 'zod';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.disable('x-powered-by');

// routes
app.get('/', (req,res) => {
    return res.status(200).json({
        status: 200,
        message: "Server online"
    })
});

app.use("/items", Routes.Budget);

// global handlers
app.use("*", (req,res) => {
    return res.status(404).json({
        status: 404,
        message: "That endpoint was not found on this server"
    })
})
app.use(
    (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (!err) {
            return next();
        }

        if (err instanceof ZodError) {
            return res.status(400).json({
                status: 400,
                message: "An error occurred validating the provided schema",
                error: err.issues
            }) 
        } else {
            return res.status(500).json({
                status: 500,
                message: "An unknown internal error occurred processing your request",
                error: err.message
            })
        }
    }
)

app.listen(process.env.PORT || 3000, () => {
    console.log("[Express] Server running on port " + (process.env.PORT || 3000));
})