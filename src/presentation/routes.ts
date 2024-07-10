import { Router } from "express";
import { AlumnosController } from "./controllers/alumnosController";
import { ProspectosController } from "./controllers/prospectosController";


export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        const alumnosController = new AlumnosController();
        const prospectosController = new ProspectosController();

        router.get('/api/alumnos', alumnosController.getAlumnos);
        router.post('/api/alumnos', alumnosController.createAlumno);
        router.get('/api/prospectos', prospectosController.getProspectos);
        router.post('/api/prospectos', prospectosController.createProspecto);

        return router;
    }
}