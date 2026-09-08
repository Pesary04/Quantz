import type { Express } from "express";
import { type Server } from "http";
import {
  handleContact,
  handleAdvisorMessage,
  handleEnquiry,
  handleVehicleQuote,
} from "./form-handlers";

/**
 * Registers the API routes on the local Express dev server. Each route calls
 * the same framework-agnostic handler used by the Vercel serverless functions
 * (api/*.ts), so development and production behave identically.
 */
export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    const { status, body } = await handleContact(req.body);
    res.status(status).json(body);
  });

  app.post("/api/advisor-message", async (req, res) => {
    const { status, body } = await handleAdvisorMessage(req.body);
    res.status(status).json(body);
  });

  app.post("/api/enquiry", async (req, res) => {
    const { status, body } = await handleEnquiry(req.body);
    res.status(status).json(body);
  });

  app.post("/api/vehicle-quote", async (req, res) => {
    const { status, body } = await handleVehicleQuote(req.body);
    res.status(status).json(body);
  });

  return httpServer;
}
