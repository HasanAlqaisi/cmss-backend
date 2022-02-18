import { Router } from "express";
import usersRoutes from "./atoms/users/router";

const router = Router();

router.use("/api/users", usersRoutes);

export default router;
