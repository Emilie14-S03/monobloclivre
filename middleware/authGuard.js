import {prisma} from "../db.js"

export const authGuard = async (req,res,next)=>{
    if (req.session.userId) {
        const user = await prisma.user.findUnique({
            where: {
              id: req.session.userId  
            }
        })
        if (user) {
            req.userLogged = user
            return next()
        }
    }
    res.redirect("/login")
}
