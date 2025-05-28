import { JwtPayload } from './path/to/your/jwtPayloadFile'; // Adjust the import path as necessary

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Optional user property of type JwtPayload
    }
  }
}