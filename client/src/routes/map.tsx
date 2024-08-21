import {Map, View} from "ol";
import React from "react";
import {MapPopup} from "../components/map-popup";
import "ol/ol.css";
import LayerSelection from "../components/layer-selection";
import Metadata from "../components/metadata";
import {defaults} from "ol/control";
import Legend from "../components/legend";
import Select from "ol/interaction/Select";
import {GisRepository} from "../viewer/gis-repository";
import {MapLayer} from "../layers/map-layer";
import {ApiLayer} from "../layers/api-layer";
import {MapControls} from "../viewer/map-controls";

export type TMapState = {
    map?: Map;
    mapLayers: MapLayer[];
    metadataLayer?: MapLayer;
};

export class MapComponent extends React.Component<{}, TMapState> {
    private readonly mapDivRef: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);

        this.mapDivRef = React.createRef<HTMLDivElement>();

        this.state = {
            map: undefined,
            mapLayers: [],
            metadataLayer: undefined,
        };

        this.handleLayerSelect = this.handleLayerSelect.bind(this);
        this.handleResetLayers = this.handleResetLayers.bind(this);
        this.handleShowMetadata = this.handleShowMetadata.bind(this);
        this.handleCloseMetadata = this.handleCloseMetadata.bind(this);
        this.handleClearSelectedFeatures = this.handleClearSelectedFeatures.bind(this);
        this.handleBaseMapSelect = this.handleBaseMapSelect.bind(this);
        this.handleLayerCheckboxClicked = this.handleLayerCheckboxClicked.bind(this);
        this.handleOpacityChange = this.handleOpacityChange.bind(this);
    }

    async componentDidMount() {
        if (!this.mapDivRef.current) {
            console.error("test")
            return;
        }

        const map = new Map({
            target: this.mapDivRef.current,
            view: new View({
                center: [2113330.958029, 0],
                zoom: 3.5,
                maxZoom: 7,
                projection: "EPSG:3857"
            }),
            controls: defaults({attribution: false}).extend([
                MapControls.getScaleLine(),
                MapControls.getAttributionControl()
            ]),
        });

        //  Base maps
        const osmBaseLayer = GisRepository.getOpenStreetMapBaseLayer(true);
        const satelliteBaseLayer = GisRepository.getEsriSatelliteBaseLayer(false);
        const topographyBaseLayer = GisRepository.getEsriTopographyBaseLayer(false);
        const baseMaps = [osmBaseLayer, satelliteBaseLayer, topographyBaseLayer]

        // Custom layers
        const apiLayers = await GisRepository.getApiLayers();
        const wmsLayers = apiLayers.map((layer: ApiLayer) => GisRepository.getWmsMapLayer(layer, false));
        const vectorLayers = apiLayers.filter(layer => layer["type"].toLowerCase() === "vector");
        const wfsLayers = vectorLayers.map(layer => {
            return GisRepository.getWfsMapLayer(layer, false);
        })

        const mapLayers = baseMaps.concat(wmsLayers.concat(wfsLayers));
        map.setLayers(mapLayers.map(l => l.layer));

        this.setState({
            map: map,
            mapLayers: mapLayers,
        });
    }

    handleClearSelectedFeatures(): void {
        const interactions = this.state.map?.getInteractions();
        if (interactions == null) {
            return;
        }

        interactions.forEach(i => {
            if (i instanceof Select) {
                i.getFeatures().clear();
            }
        });
    }

    handleLayerSelect(isSelected: boolean, identifier: string) {
        if (!isSelected) {
            // Deactivate the WMS and WFS layers
            this.state.mapLayers.forEach(layer => {
                if (layer.identifier === identifier) {
                    layer.layer.setVisible(false);
                }
            });

            return;
        }

        const selectedWmsLayer = this.state.mapLayers.find(layer =>
            layer.identifier === identifier &&
            layer.mapServiceType === "wms"
        );

        if (selectedWmsLayer == null) {
            return;
        }

        const isRasterLayer = selectedWmsLayer.type === "Raster";
        if (isRasterLayer) {
            const layerToShow = this.state.mapLayers.find(layer =>
                layer.identifier === identifier &&
                layer.mapServiceType === "wms"
            )!;
            layerToShow.layer.setVisible(true);
            return;
        }

        // Dealing with a vector layer
        const maxZIndex = this.getMaxZIndex();
        const layersToShow = this.state.mapLayers.filter(layer =>
            layer.identifier === identifier
        );
        const wmsLayer = layersToShow.find(layer => layer.mapServiceType === "wms")!;
        wmsLayer.layer.setVisible(true);
        wmsLayer.layer.setZIndex(maxZIndex + 1)

        const wfsLayer = layersToShow.find(layer => layer.mapServiceType === "wfs")!;
        wfsLayer.layer.setVisible(true);
        wfsLayer.layer.setZIndex(maxZIndex + 2)
    }

    private getMaxZIndex() {
        const zIndices = this.state.map?.getLayers().getArray().map(l => l.getZIndex());
        return Math.max(...zIndices ?? [0]);
    }

    handleShowMetadata(layerIdentifier: string) {
        // If the show-button is pressed again for the same layer, close the info window
        const currentMetadataLayer = this.state.metadataLayer;
        if (currentMetadataLayer != null) {
            const currentMetadataWindowIdentifier = currentMetadataLayer.identifier;
            if (currentMetadataWindowIdentifier === layerIdentifier) {
                this.handleCloseMetadata();
                return;
            }
        }

        const metadataLayer = this.state.mapLayers.find(layer => layer.identifier === layerIdentifier);
        this.setState({metadataLayer: metadataLayer});

        MapControls.moveZoomButtonsForMetadata();
    }

    handleCloseMetadata() {
        this.setState({metadataLayer: undefined});

        MapControls.moveZoomButtonsToOriginalPosition();
    }

    handleBaseMapSelect(layerName: string) {
        // Activate the base map that was clicked, deactivate the others
        this.state.mapLayers
            .filter(layer => layer.isBaseMap)
            .forEach(baseMap => {
                const visible = baseMap.fullName === layerName;
                baseMap.layer.setVisible(visible);
            });
    }

    handleLayerCheckboxClicked(layerIdentifier: string) {
        // Handle the selecting of treeview items
        // Handling turning off and on the actual map layers is handled in handleLayerToggle
        let idToActivate: string | null = null;
        let idToDeactivate: string | null = null;

        const clickedLayer = this.state.mapLayers.find(m => m.identifier === layerIdentifier);
        if (!clickedLayer) {
            return;
        }

        const isDeselecting = clickedLayer.isActive;
        if (isDeselecting) {
            idToDeactivate = clickedLayer.identifier;
            this.setLayerActivity(null, idToDeactivate);
            return;
        }

        const clickedLayerIsRaster = clickedLayer.type === "Raster";
        const activeRasterLayer = this.state.mapLayers.find(l => l.type === "Raster" && l.isActive);
        if (clickedLayerIsRaster && activeRasterLayer != null) {
            idToDeactivate = activeRasterLayer.identifier;
        }

        idToActivate = clickedLayer.identifier;
        this.setLayerActivity(idToActivate, idToDeactivate);
    }

    handleResetLayers() {
        this.setState(s => ({
            mapLayers: s.mapLayers.map(l => Object.assign({}, l, {isActive: false}))
        }));
    }

    handleOpacityChange(identifier: string, opacity: number) {
        // This seems to be a bit overkill for such trivial functionality.
        // Looping over the entire array just to change an opacity value.
        // Could hinder performance.
        this.setState({
            mapLayers: this.state.mapLayers.map(l => {
                if (l.identifier !== identifier) {
                    return l;
                }

                l.layer.setOpacity(opacity);
                return Object.assign({}, l, {opacity: opacity});
            })
        });
    }

    setLayerActivity(idToActivate: string | null, idToDeactivate: string | null) {
        this.setState(s => ({
            mapLayers: s.mapLayers.map(l => {
                if (l.identifier === idToDeactivate) {
                    return Object.assign({}, l, {isActive: false});
                }

                if (l.identifier === idToActivate) {
                    return Object.assign({}, l, {isActive: true});
                }

                return l;
            })
        }));
    }

    render() {
        return (
            <div className="row flex-grow-1">
                <div className="map g-0 position-relative" ref={this.mapDivRef}>
                    <LayerSelection mapLayers={this.state.mapLayers}
                                    onLayerSelect={this.handleLayerSelect}
                                    onResetLayers={this.handleResetLayers}
                                    onShowMetadata={this.handleShowMetadata}
                                    onBaseMapSelect={this.handleBaseMapSelect}
                                    onLayerCheckBoxClicked={this.handleLayerCheckboxClicked}/>

                    {this.state.map && <MapPopup map={this.state.map}
                                                 activeLayers={this.state.mapLayers.filter(l =>
                                                     l.isActive &&
                                                     l.mapServiceType === "wms"
                                                 )}
                                                 onClearSelectedFeatures={this.handleClearSelectedFeatures}/>}

                    {this.state.map && <Metadata layer={this.state.metadataLayer}
                                                 onCloseMetadata={this.handleCloseMetadata}/>}

                    {this.state.map && <Legend
                        activeLayers={this.state.mapLayers.filter(l =>
                            l.isActive &&
                            l.mapServiceType === "wms"
                        )}
                        onOpacityChange={this.handleOpacityChange}/>}
                </div>
            </div>
        )
    }
}