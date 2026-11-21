const modelo = require('../../modelo/administrador/CrearAdminModeloAdmi');

class CrearAdminControladorAdmi {
    
    // RF-16: Crear nuevo administrador por parte del Administrador
    static async crearAdmin(req, res) {
        // Permitir captura con nombres descriptivos o formato de formulario t1..t5
        const body = req.body || {};
        const nom = body.nombre || body.t1;
        const doc = body.documento || body.t2;
        const corr = body.correo || body.email || body.t3;
        const tel = body.telefono || body.tel || body.t4;
        const contra = body.contraseña || body.clave || body.password || body.t5;

        // ------------ 👁️‍🗨️ Validaciones RF-16 CA-03 / A2 👁️‍🗨️ ------------
        
        // 1. Validar campos vacíos
        const errorCampos = CrearAdminControladorAdmi.verCampos(nom, doc, corr, tel, contra);
        if (errorCampos) {
            return res.status(400).json({ error: errorCampos });
        }

        // 2. Validar nombre completo
        const errorNom = CrearAdminControladorAdmi.verNom(nom);
        if (errorNom) {
            return res.status(400).json({ error: errorNom });
        }

        // 3. Validar documento de identidad
        const errorDoc = CrearAdminControladorAdmi.verDoc(doc);
        if (errorDoc) {
            return res.status(400).json({ error: errorDoc });
        }

        // 4. Validar correo corporativo
        const errorCorr = CrearAdminControladorAdmi.verEmail(corr);
        if (errorCorr) {
            return res.status(400).json({ error: errorCorr });
        }

        // 5. Validar teléfono (10 dígitos)
        const errorTel = CrearAdminControladorAdmi.verTel(tel);
        if (errorTel) {
            return res.status(400).json({ error: errorTel });
        }

        // 6. Validar política de seguridad de la contraseña temporal
        const errorKey = CrearAdminControladorAdmi.verKey(contra);
        if (errorKey) {
            return res.status(400).json({ error: errorKey });
        }

        try {
            // ------------ 👁️‍🗨️ Validar duplicados RF-16 CA-02 / A1 👁️‍🗨️ ------------
            const existentes = await modelo.buscarPorCorreoODocumento(corr, doc);
            if (existentes && existentes.length > 0) {
                const coincideCorreo = existentes.some(admin => admin.correo.toLowerCase() === corr.toLowerCase());
                const coincideDoc = existentes.some(admin => String(admin.documento) === String(doc));

                if (coincideCorreo) {
                    return res.status(409).json({ 
                        error: 'El correo electrónico ingresado ya se encuentra registrado en el sistema (CA-02).',
                        sugerencia: 'Ingrese un correo electrónico diferente.'
                    });
                }

                if (coincideDoc) {
                    return res.status(409).json({ 
                        error: 'El documento de identidad ingresado ya se encuentra registrado en el sistema (A1).',
                        sugerencia: 'Verifique el documento de identidad.'
                    });
                }
            }

            // Registrar nuevo administrador (Estado 1 = Activo por defecto)
            const resultado = await modelo.crearAdmin(nom, doc, corr, tel, contra, 1);

            return res.status(201).json({
                success: true,
                mensaje: 'Administrador creado exitosamente y cuenta activa (CA-01).',
                administrador: {
                    idAdmin: resultado.insertId,
                    nombre: nom,
                    documento: doc,
                    correo: corr,
                    telefono: tel,
                    rol: 'Administrador',
                    estado: 'Activo'
                }
            });

        } catch (err) {
            // Control de excepciones de clave duplicada a nivel MySQL
            if (err.message.includes('Duplicate entry')) {
                return res.status(409).json({
                    error: 'Ya existe un administrador con ese correo o documento de identidad.',
                    detalle: err.message
                });
            }

            console.error('Error al crear administrador (RF-16):', err);
            return res.status(500).json({ 
                error: 'Error interno del servidor al procesar el registro.', 
                detalle: err.message 
            });
        }
    }

    // ------------------- Métodos auxiliares de validación -------------------

    static verCampos(nom, doc, corr, tel, contra) {
        if (!nom || !doc || !corr || !tel || !contra) {
            return 'Todos los campos son obligatorios: nombre, documento, correo, teléfono y contraseña (CA-03).';
        }
        return null;
    }

    static verNom(nom) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,100}$/;
        if (!regex.test(nom)) {
            return 'El nombre completo debe contener solo letras y tener entre 3 y 100 caracteres.';
        }
        return null;
    }

    static verDoc(doc) {
        const docStr = String(doc).trim();
        if (!/^[A-Za-z0-9]{6,20}$/.test(docStr)) {
            return 'El documento de identidad debe tener entre 6 y 20 caracteres alfanuméricos.';
        }
        return null;
    }

    static verEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email) || email.length > 100) {
            return 'El correo electrónico es inválido. Ejemplo: admin@elbuensabor.com';
        }
        return null;
    }

    static verTel(tel) {
        if (!/^\d{10}$/.test(String(tel).trim())) {
            return 'El teléfono debe tener exactamente 10 dígitos numéricos.';
        }
        return null;
    }

    static verKey(contra) {
        // Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regex.test(contra)) {
            return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial.';
        }
        return null;
    }
}

module.exports = CrearAdminControladorAdmi;
