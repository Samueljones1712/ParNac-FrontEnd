class Respuestas {

    constructor() {
        this.response = {
            status: "ok",
            result: [],
        };
    }

    verifyCode(verifyCode, informationValue) {
        this.response.status = "ok";
        this.response.result = {
            code: verifyCode,
            information: informationValue,
        };

        return this.response;
    }

    token(tokenValue, informationValue) {
        this.response.status = "ok";
        this.response.result = {
            token: tokenValue,
            information: informationValue,
        };

        return this.response;
    }

    error_405() {
        this.response.status = "error";
        this.response.result = {
            error_id: "405",
            error_msg: "Metodo no permitido",
        };
        return this.response;
    }

    error_200(valor = "Datos incorrectos") {
        this.response.status = "error";
        this.response.result = {
            error_id: "200",
            error_msg: valor,
        };
        return this.response;
    }

    error_400() {
        this.response.status = "error";
        this.response.result = {
            error_id: "400",
            error_msg: "Datos enviados incompletos o formato incorrecto",
        };
        return this.response;
    }

    error_401() {
        this.response.status = "error";
        this.response.result = {
            error_id: "401",
            error_msg: "Contrasena incorrecta.",
        };
        return this.response;
    }

    error_402() {
        this.response.status = "error";
        this.response.result = {
            error_id: "402",
            error_msg: "Correo incorrecto.",
        };
        return this.response;
    }


    error_500(valor = "Error interno del servidor") {
        this.response.status = "error";
        this.response.result = {
            error_id: "500",
            error_msg: valor,
        };
        return this.response;
    }
}
exports.Respuestas = Respuestas;
