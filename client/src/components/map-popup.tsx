import {Map, MapBrowserEvent, Overlay} from "ol";
import React from "react";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import {Tab, Table, Tabs} from "react-bootstrap";
import {GisRepository} from "../viewer/gis-repository";
import {MapLayer} from "../layers/map-layer";
import BorderSpinner from "./border-spinner";

export type TPopupProps = {
    map: Map
    activeLayers: MapLayer[];
    onClearSelectedFeatures: () => void;
}

export type TPopupState = {
    featureInfoTabs: JSX.Element[],
    featureInfoLoading: boolean,
    activeTabKey: string
};

export class MapPopup extends React.Component<TPopupProps, TPopupState> {
    private closer: HTMLElement | undefined;

    constructor(props: TPopupProps) {
        super(props);

        this.state = {
            featureInfoTabs: [],
            featureInfoLoading: false,
            activeTabKey: ""
        }
    }

    componentDidMount(): void {
        // Set up the popup window that appears when a user clicks somewhere on the map

        this.closer = document.getElementById('popup-closer')!;

        const overlay = this.getPopupOverlay();
        this.props.map.addOverlay(overlay);

        this.setupCloseButtonClickEvent(overlay);
        this.setupMapClickEvent(overlay);
    }

    private setupCloseButtonClickEvent(overlay: Overlay) {
        this.closer!.onclick = () => {
            this.props.onClearSelectedFeatures();
            overlay.setPosition(undefined);
            this.closePopup();
            return false;
        };
    }

    private setupMapClickEvent(overlay: Overlay) {
        this.props.map.on('click', async (evt: MapBrowserEvent<UIEvent>) => {
            const projection = this.props.map.getView().getProjection()
            const viewResolution = this.props.map.getView().getResolution();
            const coordinate = evt.coordinate;
            overlay.setPosition(coordinate);

            this.setState({featureInfoLoading: true});
            const tablesWithName = await Promise.all(this.props.activeLayers.map(async layer => {
                // For now, only clicking on WMS layers is allowed
                if (!(layer?.layer instanceof TileLayer<any>)) {
                    return
                }

                const wmsSource = layer.layer.getSource() as TileWMS;
                const identifier = layer.identifier;

                const featureResponse = await GisRepository.getFeatures(
                    wmsSource, coordinate, viewResolution, projection, identifier
                );

                const features: any[] = featureResponse.features;
                if (features.length === 0) {
                    return;
                }

                const table = this.buildFeaturesTable(features, layer.unit);
                if (table == null) {
                    this.closePopup();
                    return;
                }

                return ([layer.fullName, table]);
            }));

            const activeTabKey = tablesWithName[0]?.[0] as string;
            const tabs = tablesWithName.filter(t => t != null).map(t => {
                const name = t![0] as string;
                const table = t![1] as JSX.Element;
                const title = name.length > 15 ? name.substring(0, 15) + "..." : name;

                return <Tab key={name} eventKey={name} title={title} className="small-font">
                    {table}
                </Tab>
            });

            this.setState({featureInfoTabs: tabs, featureInfoLoading: false, activeTabKey: activeTabKey});
        });
    }

    private closePopup() {
        this.closer?.click();
    }

    private getPopupOverlay() {
        const container = document.getElementById('popup')!;
        const overlay = new Overlay({
            element: container,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });
        overlay.set("name", "overlay popup")
        return overlay;
    }

    private buildFeaturesTable(features: Array<any>, unit: string): JSX.Element | undefined {
        const feature = features[0]; // For now, we're only taking the first feature in the list
        const properties = feature["properties"];
        const isVectorLayer = feature["geometry"] != null;

        const tableContent = isVectorLayer ?
            this.getVectorTableRows(properties) :
            this.getRasterTableRows(properties, unit);
        if (tableContent == null) {
            return;
        }

        return (
            <Table striped bordered hover size="sm" className="mb-0">
                {tableContent}
            </Table>
        )
    }

    private getVectorTableRows(properties: { [p: string]: any }) {
        return <>
            <thead>
            <tr>
                <th>Property</th>
                <th>Value</th>
            </tr>
            </thead>
            <tbody>
            {
                Object.keys(properties).filter((key: string) => {
                    const lowerKey = key.toLowerCase();
                    return !(lowerKey === "geometry" || lowerKey === "shape_leng" || lowerKey === "shape_area");
                }).map((key: string) => {
                    return (
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{properties[key]}</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </>;
    }

    private getRasterTableRows(properties: { [p: string]: any }, unit: string) {
        const valueAtCoordinate = properties["GRAY_INDEX"];
        if (valueAtCoordinate === -9999) {
            return null;
        }

        return <>
            <thead>
            <tr>
                <th>Value</th>
                <th>Unit</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{Math.round(valueAtCoordinate * 100) / 100}</td>
                <td>{unit}</td>
            </tr>
            </tbody>
        </>
    }

    render() {
        return (
            <div id="popup" className="ol-popup">
                <span className={"mb-2"}>
                    <h6>Feature info</h6>
                    <a href="/#" id="popup-closer" className="ol-popup-closer"> </a>
                </span>
                <div className="ol-popup-body">
                    <BorderSpinner show={this.state.featureInfoLoading} small={false}/>
                    {!this.state.featureInfoLoading &&
                        (this.state.featureInfoTabs.length > 0 ?
                            <Tabs
                                activeKey={this.state.activeTabKey}
                                onSelect={(key: string | null) => this.setState({activeTabKey: key!})}
                                id="popup-tabs"
                                className="small-font mb-0">
                                {this.state.featureInfoTabs}
                            </Tabs>
                            :
                            <p>No data</p>)
                    }
                </div>
            </div>
        )
    }
}