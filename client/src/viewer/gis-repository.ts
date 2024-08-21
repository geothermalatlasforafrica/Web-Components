import TileLayer from "ol/layer/Tile";
import {OSM, XYZ} from "ol/source";
import TileWMS from "ol/source/TileWMS";
import {Constants} from "../constants";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import {bbox as bboxStrategy} from "ol/loadingstrategy";
import {Feature} from "ol";
import {Geometry} from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import {Projection} from "ol/proj";
import {MapLayer} from "../layers/map-layer";
import {ApiLayer} from "../layers/api-layer";
import {Tile} from "ol/layer";
import {Events} from "../events";

export class GisRepository {
    public static getOpenStreetMapBaseLayer(visible: boolean): MapLayer {
        let layer = new TileLayer({
            source: new OSM(),
            zIndex: 0, // Base maps should always have zIndex 0
            visible: visible
        })

        const apiLayer = new ApiLayer(
            "osm_basemap",
            "OpenStreetMap",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        )

        return new MapLayer(apiLayer, layer, 1, "wms", true)
    }

    public static getEsriSatelliteBaseLayer(visible: boolean): MapLayer {
        const layer = new Tile({
            source: new XYZ({
                attributions: ['Powered by Esri',
                    'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, ' +
                    'USGS, AeroGRID, IGN, and the GIS User Community'],
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            }),
            zIndex: 0, // Base maps should always have zIndex 0
            visible: visible
        });

        const apiLayer = new ApiLayer(
            "satellite_basemap",
            "Satellite",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        )

        return new MapLayer(apiLayer, layer, 1, "wms", true)
    }

    public static getEsriTopographyBaseLayer(visible: boolean): MapLayer {
        const layer = new TileLayer({
            source: new XYZ({
                attributions:
                    'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                    'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                url:
                    'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                    'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            }),
            zIndex: 0, // Base maps should always have zIndex 0
            visible: visible
        });

        const apiLayer = new ApiLayer(
            "topography_basemap",
            "Topography",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        )

        return new MapLayer(apiLayer, layer, 1, "wms", true)
    }

    public static getWmsMapLayer(layer: ApiLayer, visible: boolean): MapLayer {
        const identifier = layer.getLayerIdentifier(layer);

        const source = new TileWMS({
            attributions: `<br />Selected overlay source © <a href=${layer.url} target='_blank'>Open in new tab</a>`,
            url: Constants.geoServerWmsUrl,
            params: {
                'layers': identifier,
                'TILED': true
            },
            serverType: 'geoserver',
            hidpi: false // very important for proper GeoWebCache calls
        });

        const tileLayer = new TileLayer({source: source, visible: visible, zIndex: 1});

        return new MapLayer(layer, tileLayer, 0.85, "wms", false);
    }

    public static getWfsMapLayer(layer: ApiLayer, visible: boolean): MapLayer {
        const identifier = layer.getLayerIdentifier(layer);

        const source = new VectorSource({
            format: new GeoJSON(),
            strategy: bboxStrategy,
        },);

        // Set a custom loader to add credentials (withCredentials = true) to each request.
        // The credentials, in this case, are represented by the session cookie
        source.setLoader((extent,
                          resolution,
                          projection,
                          success,
                          failure) => {
            const proj = projection.getCode();
            const url = Constants.geoServerWfsUrl +
                `?service=WFS
                &version=1.1.0
                &request=GetFeature
                &typename=${identifier}
                &outputFormat=application/json
                &srsname=${proj}
                &bbox=${extent.join(',')},${proj}`;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.withCredentials = true // Essential for protected layers
            const onError = () => {
                source.removeLoadedExtent(extent);
                failure!();
            }
            xhr.onerror = onError;
            xhr.onload = () => {
                if (xhr.status !== 200) {
                    onError();
                    return
                }

                const format = source.getFormat()!;
                const features = format.readFeatures(xhr.responseText) as Array<Feature<Geometry>>;
                source.addFeatures(features);
                success!(features);
            }
            xhr.send();
        },);

        const vectorLayer = new VectorLayer({
            source: source,
            style: new Style({
                fill: new Fill({color: "rgba(255, 255, 255, 0)"}), // Transparent
                stroke: new Stroke({color: "black", width: 1})
            }),
            visible: visible,
            zIndex: 1
        });

        return new MapLayer(layer, vectorLayer, 0.85, "wfs", false);
    }

    public static async getFeatures(wmsSource: TileWMS,
                                    coordinate: Array<number>,
                                    viewResolution: number | undefined,
                                    projection: Projection,
                                    identifier: string) {
        return await GisRepository.getFeatureInfo(wmsSource, coordinate, viewResolution, projection, identifier);
    }

    public static async getApiLayers() {
        const response = await fetch(process.env.REACT_APP_API_URL + "/layers/gaa-dev", {
            method: "GET",
            credentials: "include"
        });

        if (response.status !== 200) {
            Events.fireErrorToast("Failed to fetch layer information from the server.");
            return [];
        }

        const untypedLayers = await response.json();
        const typedLayers: ApiLayer[] = untypedLayers.map((layer: any) => new ApiLayer(
                layer.name,
                layer.full_name,
                layer.filename,
                layer.type,
                layer.url,
                layer.unit,
                layer.workspace,
                layer.description,
                layer.resolution,
                layer.keywords,
                layer.date,
                layer.restricted,
                layer.layer_group,
                layer.parent_group
            )
        );

        return typedLayers;
    }

    public static getLegendGraphicUrl(identifier: string): string {
        return Constants.geoServerWmsUrl + `?REQUEST=GetLegendGraphic
        &VERSION=1.0.0
        &FORMAT=image/png
        &WIDTH=20
        &HEIGHT=20
        &STRICT=false
        &style=${identifier}_style`;
    }

    public static getFeatureInfoUrl(wmsSource: TileWMS, coordinate: Array<number>,
                                    viewResolution: number | undefined, projection: Projection,
                                    identifier: string): string {
        // @ts-ignore:
        // viewResolution can be undefined
        // The docs state that getFeatureInfoUrl resolution parameter can be undefined, but the function
        // definition says otherwise.
        return wmsSource.getFeatureInfoUrl(coordinate, viewResolution, projection, {
            'INFO_FORMAT': 'application/json',
            'query_layers': identifier
        });
    }

    public static async getFeatureInfo(wmsSource: TileWMS, coordinate: Array<number>,
                                       viewResolution: number | undefined, projection: Projection,
                                       identifier: string): Promise<any> {
        const url = this.getFeatureInfoUrl(wmsSource, coordinate, viewResolution, projection, identifier)
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        return await response.json();
    }
}