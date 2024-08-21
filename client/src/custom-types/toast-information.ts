import {Variant} from "react-bootstrap/types";

export type ToastInformation = {
    title: string,
    message: string,
    timestamp: string,
    uuid: string,
    level: Variant
}