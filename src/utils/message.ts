import { use } from "react";

export const message = {
    error:{
        needProps: "Falto algun campo por rellenar",
        invalidEmail: "El email no es valido",
        passwordNotMatch: "Las contraseñas no coinciden",
        userExist: "Ya existe un usuario con ese correo electronico",
        default: "Algo salio mal, intenta de nuevo",
        userNotFound: "Usuario no encontrado",
        invalidPassword: "Contraseña incorrecta",
        invalidToken: "Token invalido",
        tokenNotFound : "Token no encontrado",
    },
    success:{
        userCreatted: "Usuario creado con exito!",
        userLogged : "Usuario logeado con exito!",
        emailSent: "Correo enviado con exito",
        passwordChanged: "Contraseña cambiada con exito",
        authorized: "Autorizado",
    }
}