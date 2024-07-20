import { Router } from "express";
import { AlumnosController } from "./controllers/alumnosController";
import { ProspectosController } from "./controllers/prospectosController";


export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        const alumnosController = new AlumnosController();
        const prospectosController = new ProspectosController();

        //Alumnos
        router.get('/api/alumnos', alumnosController.getAlumnos);
        router.get('/api/alumnos/:id', alumnosController.getAlumnoById);
        router.post('/api/alumnos', alumnosController.createAlumno);
        router.delete('/api/alumnos/:id', alumnosController.deleteAlumno);
        router.put('/api/alumnos', alumnosController.updateAlumnoById);

        //Prospectos
        router.get('/api/prospectos', prospectosController.getProspectos);
        router.get('/api/prospectos/:id', prospectosController.getProspectoById);
        router.post('/api/prospectos', prospectosController.createProspecto);
        router.delete('/api/prospectos/:id', prospectosController.deleteProspecto);
        router.put('/api/prospectos', prospectosController.updateProspectoById);

        return router;
    }
}