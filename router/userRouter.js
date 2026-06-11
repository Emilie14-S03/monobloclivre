import { Router } from "express"
import { prisma } from "../db.js"
import { hash, compare } from "bcrypt"
import { authGuard } from "../middleware/authGuard.js"


const userRouter = Router()

userRouter.get("/subscribe", (req, res) => {
    res.render("pages/subscribe.twig", {
        title: "Inscription",
    })
})

userRouter.post("/subscribe", async (req,res)=>{
    try {
        const hashPassword = await hash(req.body.password, parseInt(process.env.SALT))
        const user = await prisma.user.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashPassword
            }
        })
        res.redirect("/login")
    } catch (error) {
        res.send("pas ok")
        console.log(error);
        
    }
})

userRouter.get("/login", (req,res)=>{
    res.render("pages/login.twig")
})

userRouter.post("/login", async(req,res)=>{
    try {
        const user = await prisma.user.findUnique({
            where : {
                email: req.body.email
            }
        })
        if (!user) {
            throw new Error("identifiants invalides")
        }
        if (!await compare(req.body.password, user.password)) {
            throw new Error("Mot de passe incorrect");
        }
        req.session.userId = user.id
        res.redirect("/dashboard")
        
    } catch (error) {
         res.render("pages/login.twig", {
            error: error.message
         })
    }
})

userRouter.get('/dashboard', authGuard, async(req,res)=>{
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(req.session.userId)
        },
        include: {
            books:true
        }
    })
    res.render('pages/dashboard.twig', {
        userLogged: req.userLogged,
        user: user
    })
})

userRouter.get("/logout", (req,res)=>{
    req.session.destroy()
    res.redirect("/login")
})

export default userRouter