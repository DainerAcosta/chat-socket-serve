import { Router } from "express";
import userController from "../controllers/user.controller";

class UserRoutes {

    public router: any;

    constructor() {
        this.router = Router();
        this.config();
    }

    public config() {
        this.router.post('/userLogin', userController.loginUser);
        this.router.post('/userCreate', userController.createUser);
    }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;