import express from "express";
import cors from "cors";


const app = express();
app.use(cors({
    origin: "http://localhost:8080", 
    credentials: true,               
  }));
app.use(express.json());

import adminRoutes from "./routes/admin.routes.js"
import patientRoutes from "./routes/patient.routes.js"

app.use("/bloom/v1/api/admin", adminRoutes);
app.use("/bloom/v1/api/patient", patientRoutes);

export { app };