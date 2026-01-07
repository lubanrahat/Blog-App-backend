import type { Request, Response } from "express";

class PostController {
  public createPost(req: Request, res: Response): Response {
    const post = req.body;

    return res.status(201).json({});
  }
}

export default PostController;
