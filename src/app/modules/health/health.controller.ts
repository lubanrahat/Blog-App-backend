import type { Request, Response } from "express";

class HealthController {
  public handleHealthCheck(req: Request, res: Response): Response {
    return res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }
}

export default HealthController;
