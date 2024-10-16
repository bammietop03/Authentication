import express from 'express';
import { connectDb } from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.route.js";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from './middleware/passport.js';
import session from "express-session";
import swaggerUi from "swagger-ui-express";
import specs from './swaggerConfig.js';
import helmet from 'helmet';

dotenv.config();


const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Use Helmet middleware
// app.use(helmet());
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Log requests to the console
app.use(cookieParser()); // Parse cookies

// Use express-session for OAuth flow
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:80"],
  credentials: true,
}));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  connectDb();
  console.log(`Server running on port ${port}`);
});


export default app;