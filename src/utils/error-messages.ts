import { MappedMessage } from "../types/error-messages.types";

export const ErrorMessages: MappedMessage = {
    es: {
        error_date_params:
            "Debe proporcionar al menos uno de los parámetros 'hours' o 'days'.",
        error_border_date: "Fecha máxima excedida",
        wrong_exception: "Algo salió mal!",
    },
    en: {
        error_date_params:
            "You must provide at least one of the parameters 'hours' or 'days'.",
        error_border_date: "Limit date time exceeded",
        wrong_exception: "Something went wrong!",
    },
};
