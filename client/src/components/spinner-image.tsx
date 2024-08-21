import React from "react";
import BorderSpinner from "./border-spinner";

export type SpinnerImageProps = {
    url: string;
}

export default function SpinnerImage(props: SpinnerImageProps) {
    const [loading, setLoading] = React.useState(true);

    return (
        <>
            <BorderSpinner show={loading} small={false}/>
            <img src={props.url}
                 alt="Legend"
                 onLoad={() => setLoading(false)}/>
        </>
    )
}