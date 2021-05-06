import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import * as dotenv from "dotenv";
import connectionDB from "./database/connectionDB";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import userRoutes from "./routes/user.routes";

class Serve {
  public app: Application;
  public serve: any;
  public io: any;

  constructor() {
    dotenv.config();
    connectionDB();
    this.app = express();
    this.serve = createServer(this.app);
    this.io = new Server(this.serve, { path: "/wss" });
    this.config();
    this.routes();
    this.rooms();
    this.start();
  }

  config(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use("/static", express.static("src/public"));
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", process.env.ACCESS_SOCKET);
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
  }

  routes(): void {
    this.app.use("/users", userRoutes);
  }

  rooms(): void {
    let num = 1;

    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected", socket.id);

      setInterval(() => {
        socket.emit("count", (num += 1));
      }, 10000);
    });
  }

  start() {
    const portHTTP = this.app.get("port");
    const portSocket = 4000;

    this.app.listen(portHTTP, () => {
      console.log("Serve HTTP on port", portHTTP);
    });

    this.serve.listen(portSocket, () => {
      console.log("ServeSocket on port", portSocket);
    });
  }
}

const server = new Serve();
server;
