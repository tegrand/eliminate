import { Router } from "express";

const router = Router()

router.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
    message: "API Healthy",
    timestamp: new Date().toISOString(),
    })
})

export default router