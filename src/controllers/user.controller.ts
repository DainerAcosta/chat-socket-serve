import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchema from "../models/user.schema";
import generateJWT from "../helpers/jwt";

class UserController {
  public async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      let user = await userSchema.findOne({ email });
      if (!user) {
        res.status(400).json({ msg: "El usuario no existe" });
        return;
      }

      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword) {
        res.status(400).json({ msg: "Contraseña incorrecta" });
        return;
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: 3600,
        },
        (error, token) => {
          if (error) throw error;

          res.json({ token: token, userName: user.username });
        }
      );
    } catch (error) {
      res.json({ msm: "error" });
    }
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      let user = await userSchema.findOne({ email });

      if (user) {
        res.status(400).json({
          ok: false,
          msg: "El usuario ya existe",
        });
      }

      let newUser = new userSchema(req.body);

      const salt = bcrypt.genSaltSync();
      newUser.password = bcrypt.hashSync(password, salt);

      await newUser.save();

      const token = await generateJWT(newUser.id, newUser.name);

      res.status(201).json({
        ok: true,
        uid: newUser.id,
        name: newUser.name,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Por favor hable con el administrador",
      });
    }
  }
}

const userController = new UserController();
export default userController;
