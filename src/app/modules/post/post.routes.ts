import express, { type Router } from "express";
import PostController from "./post.controller";
export default function registerPostRoutes(): Router {
    const router = express.Router();
    const controller = new PostController();

    return router;
}