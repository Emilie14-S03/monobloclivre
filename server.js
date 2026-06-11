import express from "express"
import "dotenv/config"
import userRouter from "./router/userRouter.js"
import bookRouter from "./router/bookRouter.js"
import session from "express-session"

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(session({
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false
}))
app.use(userRouter)
app.use(bookRouter)

app.listen(process.env.PORT, (err)=>{
    if (err) {
       console.log(err);
        
    }else{
        console.log(`Connecté sur le port ${process.env.PORT}`);
    }
})