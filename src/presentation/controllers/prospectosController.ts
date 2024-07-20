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

    public getProspectoById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(401).json({ message: 'ID no encontrado' });

        try {
            const result = await this.pool.query('SELECT * FROM prospectos WHERE id = $1', [id])
            const prospecto = result.rows[0];
            console.log(prospecto)
            return res.status(200).json(prospecto);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error obteniendo prospecto con id: ', id })
        }
    }

    public deleteProspecto = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const result = await this.pool.query('DELETE FROM prospectos WHERE id = $1', [id])
            if (!result) return res.status(500).json({ message: `Prospecto con id ${id} no encontrado` });
            else return res.status(200).json({ message: `Prospecto eliminado correctamente` })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Error eliminando prospecto con id: ', id })
        }
    }

    public createProspecto = async (req: Request, res: Response) => {
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

    public updateProspectoById = async (req: Request, res: Response) => {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'ID es requerido' });
        }

        const fields = [
            'nombre',
            'ap_paterno',
            'ap_materno',
            'genero',
            'email',
            'municipio',
            'estado',
            'telefono',
            'curso',
            'plataforma'
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

        const query = `UPDATE prospectos SET ${updates.join(', ')} WHERE id = $${index}`;

        try {
            await this.pool.query(query, values);
            res.status(200).json({ message: 'Prospecto actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar prospecto' });
        }
    };
}