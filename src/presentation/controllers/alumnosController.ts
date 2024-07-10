import { Request, Response } from "express";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { envs } from "../../config/envs";

export class AlumnosController {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: envs.HOST
        })
    }

    public getAlumnos = async (req: Request, res: Response) => {
        try {
            const result = await this.pool.query('SELECT * FROM alumnos');
            const alumnos = result.rows;

            return res.status(200).json(alumnos);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error obteniendo alumnos: ', error });
        }
    }

    public createAlumno = async (req: Request, res: Response) => {
        const {
            nombre,
            ap_paterno,
            ap_materno,
            fec_nacimiento,
            genero,
            email,
            calle,
            colonia,
            cp,
            municipio,
            estado,
            telefono,
            carrera,
            num_exterior,
            num_interior,
        } = req.body;

        try {
            await this.pool.query(
                `INSERT INTO alumnos (id, nombre, ap_paterno, ap_materno, fec_nacimiento, genero, email, num_exterior, num_interior, calle, colonia, cp, municipio, estado, telefono, carrera)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
                [uuidv4(), nombre, ap_paterno, ap_materno, fec_nacimiento, genero, email, num_exterior, num_interior, calle, colonia, cp, municipio, estado, telefono, carrera]
            );

            return res.status(200).json({ message: 'Alumno creado correctamente' });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
}