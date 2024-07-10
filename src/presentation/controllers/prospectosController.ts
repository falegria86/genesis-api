import { Request, Response } from "express";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { envs } from "../../config/envs";

export class ProspectosController {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: envs.HOST
        })
    }

    public getProspectos = async (req: Request, res: Response) => {
        try {
            const result = await this.pool.query('SELECT * FROM prospectos');
            const prospectos = result.rows;

            return res.status(200).json(prospectos);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error obteniendo prospectos: ', error });
        }
    }

    public createProspecto = async (req: Request, res: Response) => {
        console.log(req.body)
        const {
            nombre,
            ap_paterno,
            ap_materno,
            genero,
            email,
            municipio,
            estado,
            telefono,
            curso,
            plataforma,
        } = req.body;

        try {
            await this.pool.query(
                `INSERT INTO prospectos (id, nombre, ap_paterno, ap_materno, genero, email, municipio, estado, telefono, curso, plataforma)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [uuidv4(), nombre, ap_paterno, ap_materno, genero, email, municipio, estado, telefono, curso, plataforma]
            );

            return res.status(200).json({ message: 'Prospecto agregadp correctamente' });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
}