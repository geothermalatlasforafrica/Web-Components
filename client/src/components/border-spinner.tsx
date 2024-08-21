import {Spinner} from "react-bootstrap";
import React from "react";

type BorderSpinnerProps = {
    show: boolean,
    small: boolean
}

export default function BorderSpinner(props: BorderSpinnerProps) {
    return (
        <>
            {
                props.show &&
                <Spinner
                    as="span"
                    animation="border"
                    size={props.small ? "sm" : undefined}
                    role="status"
                    aria-hidden="true"
                />
            }
        </>
    )
}