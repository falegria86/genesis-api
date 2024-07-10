import { Router } from "express";
import { AlumnosController } from "./controllers/alumnosController";


export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        const alumnosController = new AlumnosController();


        router.get('/api/alumnos', alumnosController.getAlumnos);
        router.post('/api/alumnos', alumnosController.createAlumno);

        return router;
    }
}