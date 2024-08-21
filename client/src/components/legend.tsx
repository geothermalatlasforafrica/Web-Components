import React from 'react';
import {Card, Collapse, Form, ListGroup} from "react-bootstrap";
import {GisRepository} from "../viewer/gis-repository";
import {MapLayer} from "../layers/map-layer";
import SpinnerImage from "./spinner-image";
import CollapseArrow from "./collapse-arrow";

type LegendProps = {
    activeLayers: MapLayer[],
    onOpacityChange: (identifier: string, opacity: number) => void;
}

export default function Legend(props: LegendProps) {
    const [expanded, setExpanded] = React.useState(true);

    return (
        <Card className="map-overlay-widget position-absolute top-0 end-0 m-2">
            <Card.Header>
                <span className="align-items-center d-flex justify-content-between">
                    <div>Legend</div>
                    <CollapseArrow collapsed={!expanded} onClick={() => setExpanded(!expanded)}/>
                </span>
            </Card.Header>
            <Collapse in={expanded}>
                {props.activeLayers.length > 0 ?
                    <ListGroup className="vertical-scroll pb-0" variant="flush">
                        {props.activeLayers.map(layer => {
                            return (
                                <ListGroup.Item key={layer.identifier}>
                                    <Card.Title>{layer.fullName}</Card.Title>
                                    <Card.Subtitle className="text-muted mb-2">[{layer.unit}]</Card.Subtitle>
                                    <Form className="d-flex flex-row align-middle">
                                        <Form.Label className="flex-grow-0" htmlFor="opacityRange">Opacity</Form.Label>
                                        <Form.Range min="0" max="1" step="0.05"
                                                    defaultValue={layer.opacity}
                                                    id="opacityRange"
                                                    className="flex-grow-1 ms-2"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        props.onOpacityChange(
                                                            layer.identifier, +event.target.value
                                                        )}
                                        />
                                    </Form>
                                    <SpinnerImage url={GisRepository.getLegendGraphicUrl(layer.identifier)}/>
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                    :
                    <Card.Body>
                        <p>Please select one or multiple layers from the "Layers" menu on the left.</p>
                        <p>Click anywhere on the map to view detailed information about the selected location.</p>
                    </Card.Body>}
            </Collapse>
        </Card>
    )
}