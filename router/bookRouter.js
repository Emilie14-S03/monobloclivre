import { prisma } from "../db.js"
import { Router } from "express"
import { authGuard } from "../middleware/authGuard.js"
import { parse } from "dotenv"
import upload from "../middleware/upload.js"

const bookRouter = Router()

    bookRouter.get("/addbook", authGuard, (req,res)=>{
        res.render("pages/addbook.twig",{
            userLogged: req.userLogged
        })
    })

bookRouter.post("/addbook", authGuard, upload.single("image"), async(req,res)=>{ 
        try {
            const book = await prisma.book.create({
                data: {
                    title: req.body.title,
                    author: req.body.author,
                    image: req.file ? req.file.filename : null, 
                    userId: req.session.userId
                }
            })
            res.redirect("/dashboard")
        } catch (error) {
            res.send(error.message)
        }
    })

    bookRouter.get("/deletebook/:id", authGuard, async(req, res) => {
        const book = await prisma.book.delete({
            where: {
                id:parseInt(req.params.id)
            },
        })
        res.redirect("/dashboard")
    })

    bookRouter.get("/editbook/:id", authGuard, async(req, res) => {
        const book = await prisma.book.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.render("pages/editbook.twig", {
            userLogged: req.userLogged,
            book: book
        })
    })

    bookRouter.post("/editbook/:id", authGuard, upload.single("image"), async(req, res) => {
        const book = await prisma.book.update({
            where: {
                id:parseInt(req.params.id)
            },
            data: {
                    title: req.body.title,
                    author: req.body.author,
                    image: req.file ? req.file.filename : null,
            }
            }) 
        res.redirect("/dashboard")
        })

export default bookRouter