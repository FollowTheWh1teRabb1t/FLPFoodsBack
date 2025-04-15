import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./Routes/authRoutes";
import reservaRoutes from './Routes/reservaRoutes'
import mesasRoutes from './Routes/mesasRoutes'
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rota de autenticação
app.use("/api/auth", authRoutes);
app.use('/reservas', reservaRoutes)
app.use('/mesas', mesasRoutes)

    
export default app;
