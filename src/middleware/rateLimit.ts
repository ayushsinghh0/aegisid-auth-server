import rateLimit from "express-rate-limit";


export const authLimiter =  rateLimit({
    windowMs:15*60*1000,//15 minute hoga
    max:100, // har ek Ip ke liye
    standardHeaders:true,
    legacyHeaders:false
})



export const strictAuthLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:10//login kee liyee/token
})