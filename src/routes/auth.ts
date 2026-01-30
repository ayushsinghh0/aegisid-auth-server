import { Router } from "express";
import { registerSchema, loginSchema } from "../validators/auth.schema";
import { registerUser, loginUser } from "../services/auth.service";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data.email, data.name!, data.password);

    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login",async (req,res)=>{
    try {
        const data =  loginSchema.parse(req.body);

        const user = await loginUser(data.email,data.password);

        res.json({
            id:user.id,
            email:user.email
        });
    }
    catch (err:any){
        res.status(401).json({error:err.message});
    }
})

export default router;
