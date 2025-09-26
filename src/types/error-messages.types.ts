export type MappedMessage = {
    [key in lang]: Record<ErrorMessageKey, string>;
};

export enum ErrorMessageKey {
    error_date_params = "error_date_params",
    error_border_date = "error_border_date",
    wrong_exception = "wrong_exception",
}

export enum lang {
    es = "es",
    en = "en",
}
