import dotenv from "dotenv";
import e from "express";
dotenv.config();
import jwt from "jsonwebtoken";

export const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const JWT_SECRET = process.env.JWT_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

/**
 *
 * @param {number} userId
 * @returns {string} token
 */
export function getJWTToken(userId) {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
  return token;
}

/**
 *
 * @param {number} userId
 * @returns {string} token
 */
export function getRefreshToken(userId) {
  const token = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  return token;
}

/**
 * @param {e.Request} req,
 * @param {e.Response} res,
 * @param {e.NextFunction} next
 *
 * A middleware to check if the user is authenticated
 */
export function isAuthenticated(req, res, next) {
  // extract cookies from Bearer header
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // check if the token is valid
  const isTokenValid = jwt.verify(token, JWT_SECRET);
  if (!isTokenValid) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // extract userId from token
  const { userId } = jwt.decode(token);
  req.userId = userId;
  next();
}
