import React from "react";
import {Toast, ToastContainer} from "react-bootstrap";
import {ToastInformation} from "../custom-types/toast-information";

type ToastSectionProps = {
    toasts: ToastInformation[],
    onRemoveToast: (toastUuid: string) => void
}

function Toaster(props: ToastSectionProps) {
    const headerImgSource = "images/warning_icon.png";
    const autoHideDelay = 10000;  // [milliseconds]
    const autoHide = true;

    return (
        <div aria-live="polite" aria-atomic="true" className="bg-dark">
            <ToastContainer position="bottom-end" className="p-2 position-fixed" style={{zIndex: 1}}>
                {props.toasts.map(toast => {
                    return <Toast
                        bg={toast.level}
                        show={true}
                        onClose={() => props.onRemoveToast(toast.uuid)}
                        delay={autoHideDelay}
                        autohide={autoHide}
                        key={toast.uuid}>
                        <Toast.Header>
                            <img
                                id="toast-image"
                                src={headerImgSource}
                                className="rounded me-2"
                                alt="warning icon"
                            />
                            <strong className="me-auto">{toast.title}</strong>
                            <small className="text-muted">{toast.timestamp}</small>
                        </Toast.Header>
                        <Toast.Body>{toast.message}</Toast.Body>
                    </Toast>
                })}
            </ToastContainer>
        </div>
    );
}

export default Toaster;