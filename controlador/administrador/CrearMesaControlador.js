const modelo = require('../../modelo/administrador/CrearMesaModelo'); 
class CrearMesaControlador {
    // Función para registrar nueva mesa
    static async crearMesa(req, res) {
        // Mapeamos los 4 campos del formulario (t1 a t4):
        // t1: número de mesa, t2: capacidad, t3: ubicación/zona, t4: estado
        const { t1: numMesa, t2: cap, t3: ubi, t4: est } = req.body;
        
        // ------------👁️‍🗨️ Validaciones 👁️‍🗨️----------------
        // Validar campos vacíos
        const errorCampos = CrearMesaControlador.verCampos(numMesa, cap, ubi, est);
        if (errorCampos) {
            return res.status(400).json({ error: errorCampos });
        }
        
        // Validar número de mesa
        const errorNum = CrearMesaControlador.verNumeroMesa(numMesa);
        if (errorNum) {
            return res.status(400).json({ error: errorNum });
        }
        
        // Validar capacidad (Regla de negocio RF-09: entero mayor a cero)
        const errorCap = CrearMesaControlador.verCapacidad(cap);
        if (errorCap) {
            return res.status(400).json({ error: errorCap });
        }

        // Validar ubicación
        const errorUbi = CrearMesaControlador.verUbicacion(ubi);
        if (errorUbi) {
            return res.status(400).json({ error: errorUbi });
        }
        
        // Validar estado
        const errorEst = CrearMesaControlador.verEstado(est);
        if (errorEst) {
            return res.status(400).json({ error: errorEst });
        }

        try {
            // Enviamos los 4 valores al modelo en el orden exacto de la tabla
            const result = await modelo.crearMesa(numMesa, cap, ubi, est);
            res.status(201).json({ mensaje: 'Mesa creada con éxito', id: result.insertId });
        } catch (err) {
            // Alternativa A1 (RF-09): Control de número de mesa duplicado por la restricción UNIQUE
            if (err.message.includes("Duplicate entry")) {
                return res.status(409).json({ 
                    error: 'El número de mesa ya se encuentra registrado.',
                    sugerencia: 'Ingrese un identificador de mesa único.' 
                });
            } else {
                return res.status(500).json({ error: 'Error inesperado: ' + err.message });
            }
        }
    }

    // ------------------- Validaciones ----------------------------

    static verCampos(numMesa, cap, ubi, est) {
        if (!numMesa || !cap || !ubi || !est) {
            return 'Todos los campos son obligatorios.';
        }
        return null; 
    }

    // Verificar número de mesa
    static verNumeroMesa(numMesa) {
        if (isNaN(numMesa) || Number(numMesa) <= 0) {
            return 'El número de mesa debe ser un valor numérico válido mayor a 0.';
        }
        return null;
    }

    // Verificar capacidad (Requisito RF-09: entero mayor a cero)
    static verCapacidad(cap) {
        if (isNaN(cap) || Number(cap) <= 0) {
            return 'La capacidad de comensales debe ser un número entero mayor a cero.';
        }
        return null;
    }

    // Validar ubicación / zona
    static verUbicacion(ubi) {
        if (typeof ubi !== 'string' || ubi.trim().length < 2 || ubi.length > 50) {
            return 'La ubicación o zona debe tener entre 2 y 50 caracteres.';
        }
        return null;
    }

    // Validar estado de la mesa
    static verEstado(est) {
        const estadosPermitidos = ['disponible', 'ocupada'];
        if (!estadosPermitidos.includes(est.toLowerCase())) {
            return "El estado debe ser 'disponible', 'ocupada'.";
        }
        return null;
    }
}

// Exportar con el nombre correcto de la clase
module.exports = CrearMesaControlador;