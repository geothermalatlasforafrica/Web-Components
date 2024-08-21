import BaseLayer from "ol/layer/Base";
import {ApiLayer} from "./api-layer";

export class MapLayer {
    public identifier: string;
    public fullName: string;
    public description: string;
    public resolution: string;
    public keywords: string;
    public date: string;
    public restricted: string;
    public unit: string;
    public source: string;
    public type: string;
    public layer: BaseLayer;
    public layerGroup: string;
    public parentGroup: string;
    public opacity: number; // Any number from 0 to 1. 0 = fully transparent. 1 = fully opaque
    public mapServiceType: string; // One of "wms" or "wfs"
    public isActive: boolean
    public isBaseMap: boolean

    constructor(apiLayer: ApiLayer, openLayerLayer: BaseLayer, opacity: number, mapServiceType: string,
                isBaseMap: boolean) {
        if (mapServiceType !== "wms" && mapServiceType !== "wfs") {
            throw new Error("Map service type not WMS or WFS");
        }

        this.identifier = apiLayer.getLayerIdentifier(apiLayer);
        this.fullName = apiLayer.full_name;
        this.description = apiLayer.description;
        this.resolution = apiLayer.resolution;
        this.keywords = apiLayer.keywords;
        this.date = apiLayer.date;
        this.restricted = apiLayer.restricted;
        this.unit = apiLayer.unit;
        this.source = apiLayer.url;
        this.type = apiLayer.type;
        this.layer = openLayerLayer;
        this.layerGroup = apiLayer.layer_group;
        this.parentGroup = apiLayer.parent_group;
        this.opacity = opacity;
        this.mapServiceType = mapServiceType;
        this.isActive = false;
        this.isBaseMap = isBaseMap;

        this.layer.setOpacity(opacity); // Set initial opacity
    }
}