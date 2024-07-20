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

    public getAlumnoById = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) return res.status(401).json({ message: 'ID no encontrado' });

        try {
            const result = await this.pool.query('SELECT * FROM alumnos WHERE id = $1', [id])
            const alumno = result.rows[0];

            return res.status(200).json(alumno);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error obteniendo alumno: ', error });
        }
    }

    public deleteAlumno = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const result = await this.pool.query('DELETE FROM alumnos WHERE id = $1', [id])
            if (!result) return res.status(500).json({ message: `Alumno con id ${id} no encontrado` });
            else return res.status(200).json({ message: `Alumno eliminado correctamente` })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error eliminando alumno con id: ', id })
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

            return res.status(200).json({ message: 'Alumno agregado correctamente' });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    public updateAlumnoById = async (req: Request, res: Response) => {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'ID es requerido' });
        }

        const fields = [
            'nombre',
            'ap_paterno',
            'ap_materno',
            'fec_nacimiento',
            'calle',
            'colonia',
            'cp',
            'municipio',
            'estado',
            'telefono',
            'carrera',
            'num_exterior',
            'num_interior',
            'genero',
            'email',
        ];

        const updates = [];
        const values = [];
        let index = 1;
        for (const field of fields) {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = $${index}`);
                values.push(req.body[field]);
                index++;
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);

        const query = `UPDATE alumnos SET ${updates.join(', ')} WHERE id = $${index}`;

        try {
            await this.pool.query(query, values);
            res.status(200).json({ message: 'Alumno actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar alumno' });
        }
    };
}