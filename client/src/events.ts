import {ToastInformation} from "./custom-types/toast-information";
import {Variant} from "react-bootstrap/types";

export class Events {
    public static fireWarningToast(message: string) {
        this.fireToast(message, "warning")
    }

    public static fireErrorToast(message: string) {
        this.fireToast(message, "danger")
    }

    private static fireToast(message: string, level: Variant) {
        let title = this.getToastTitle(level);
        const toast: ToastInformation = {
            title: title,
            message: message,
            timestamp: "",
            uuid: crypto.randomUUID(),
            level: level
        }

        const event = new CustomEvent("fire-toast", {
            detail: {
                toast: toast
            }
        });
        window.dispatchEvent(event);
    }

    private static getToastTitle(level: Variant): string {
        if (level === "warning") {
            return "Warning";
        } else if (level === "danger") {
            return "Error";
        }
        return "";
    }
}