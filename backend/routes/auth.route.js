import express from "express"
import { login, logout, sign } from "../controllers/auth.routes.controller.js"

export const authRoute = express.Router()

authRoute.post("/login",login)
authRoute.post("/logout",logout)
authRoute.post("/sign",sign)