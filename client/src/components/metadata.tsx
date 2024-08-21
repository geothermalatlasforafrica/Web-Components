import React, {useEffect, useState} from 'react';
import {Card, CloseButton} from "react-bootstrap";
import {MapLayer} from "../layers/map-layer";

type MetadataProps = {
    layer?: MapLayer,
    onCloseMetadata: any
}

export default function Metadata(props: MetadataProps) {
    const [show, setShow] = useState(false);

    function handleCardClose() {
        props.onCloseMetadata();
    }

    useEffect(() => {
        const show = props.layer != null;
        setShow(show);
    }, [props.layer]);

    return (
        <>
            {show &&
                <Card id="metadata-window" className="map-overlay-widget position-absolute top-0 mt-2">
                    <Card.Header>
                        <span>Layer information<CloseButton onClick={handleCardClose} className="float-end"/></span>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>{props.layer?.fullName}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            {props.layer?.description}
                        </Card.Subtitle>
                        <div><strong>Resolution:</strong> {props.layer?.resolution}</div>
                        <div><strong>Keywords:</strong> {props.layer?.keywords}</div>
                        <div><strong>Date:</strong> {props.layer?.date}</div>
                        <div><strong>Restricted:</strong> {props.layer?.restricted}</div>
                        <div><strong>Unit:</strong> {props.layer?.unit}</div>
                        <div><strong>Layer type:</strong> {props.layer?.type}</div>
                        <div>
                            <strong>Source: </strong>
                            <a href={props.layer?.source} target="_blank" rel="noreferrer">Access the data</a>
                        </div>
                    </Card.Body>
                </Card>}
        </>
    )
}