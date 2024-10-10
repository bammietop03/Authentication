import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateToken.js";


// Middleware to verify tokens
const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Access token missing, please log in." });
  }

  // Verify access token
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err && err.name === "TokenExpiredError") {
      // Access token has expired, attempt to refresh
      if (!refreshToken) {
        return res
          .status(403)
          .json({ message: "Refresh token missing, please log in." });
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            // Refresh token is invalid or expired
            return res
              .status(403)
              .json({ message: "Refresh token expired, please log in again." });
          }

          // Refresh token is valid, issue new access token
          const newAccessToken = generateAccessToken({ userId: user.userId });

          // Send new access token as an HTTP-only cookie
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 60 * 1000, // 15 minutes
          });

          // Set user information in the request and continue
          console.log({"user": {
            userId: user.userId,
            ...user._doc,
            }
          })
          req.user = user;
          next();
        }
      );
    } else if (err) {
      // Other errors (e.g., token malformed)
      return res
        .status(403)
        .json({ message: "Invalid access token, please log in." });
    } else {
      // Access token is valid
      console.log({
        "user": {
        userId: user.userId,
        ...user._doc,
        }
      })
      req.user = user;
      next();
    }
  });
};

export default verifyToken;