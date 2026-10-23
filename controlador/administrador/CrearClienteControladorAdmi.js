const modelo = require('../../modelo/cliente/administrador/CrearClienteModelo');

class CrearClienteControladorAdmi {
    // funcion crear nuevo cliente
    static async crearCliente(req, res) {
        // Mapeamos los 4 campos reales que llegan del formulario (t1 a t4):
        const { t1: nom, t2: corr, t3: tel, t4: contra } = req.body;
        
        // ------------👁️‍🗨️ validaciones👁️‍🗨️----------------
        // Validar campos vacíos
        const errorCampos = CrearClienteControladorAdmi.verCampos(nom, corr, tel, contra);
        if (errorCampos) {
            return res.status(400).json({ error: errorCampos });
        }
        
        // Validar nombres completos
        const errornom = CrearClienteControladorAdmi.vernom(nom);
        if (errornom) {
            return res.status(400).json({ error: errornom });
        }
        
        // Validar correo
        const errorem = CrearClienteControladorAdmi.veremail(corr);
        if (errorem) {
            return res.status(400).json({ error: errorem });
        }

        // Validar teléfono
        const errortel = CrearClienteControladorAdmi.verTel(tel);
        if (errortel) {
            return res.status(400).json({ error: errortel });
        }
        
        // Validar contraseña
        const errorkey = CrearClienteControladorAdmi.verkey(contra);
        if (errorkey) {
            return res.status(400).json({ error: errorkey });
        }

        try {
            // Enviamos los 4 valores al modelo en el orden exacto de la tabla
            const result = await modelo.crearClientes(nom, corr, tel, contra);
            res.status(201).json({ mensaje: 'Cliente creado con éxito', id: result.insertId });
        } catch (err) {
            if (err.message.includes("Duplicate entry")) {
                return res.status(409).json({ 
                    error: 'Ya existe un usuario con este correo.',
                    sugerencia: 'intenta recuperar la cuenta o inicia sesión.' 
                });
            } else {
                return res.status(500).json({ error: 'Error inesperado: ' + err.message });
            }
        }
    }

    // -------------------validaciones----------------------------

    static verCampos(nom, corr, tel, contra) {
        if (!nom || !corr || !tel || !contra) {
            return 'Todos los campos son obligatorios.';
        }
        return null; 
    }

    // Verificar nombres completos
    static vernom(nom) {
        const name = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,100}$/;
        if (!name.test(nom)) {
            return 'Nombres y apellidos inválidos, mínimo 3 caracteres o máximo 100, solo letras.';
        } else {
            return null;
        }
    }

    // Validar correo
    static veremail(email) {
        const er = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!er.test(email) || email.length > 250) {
            return 'Correo inválido. Ejemplo válido: ejemplo@email.com';
        } else {
            return null;
        }
    }

    // Verificar teléfono
    static verTel(tel) {
        if (!/^\d{10}$/.test(tel)) {
            return 'El teléfono debe tener exactamente 10 dígitos numéricos.';
        } else {
            return null; 
        }
    }

    // Verificar contraseña
    static verkey(contras) {
        const key = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!key.test(contras)) {
            return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial.';
        } else {
            return null;
        }
    }
}

// Exportar con el nombre correcto de la clase
module.exports = CrearClienteControladorAdmi;