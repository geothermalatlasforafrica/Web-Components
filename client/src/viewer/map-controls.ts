import {Attribution, ScaleLine} from "ol/control";

export class MapControls {
    public static moveZoomButtonsForMetadata() {
        /// Moves the zoom buttons to the right to make room for the metadata panel.
        const zoomControls = document.getElementsByClassName("ol-zoom")[0] as HTMLElement
        zoomControls.className = zoomControls.className.replace("ol-zoom", "ol-zoom-expanded-metadata");
    }

    public static moveZoomButtonsToOriginalPosition() {
        /// Moves the zoom buttons back to their original position after the metadata panel is closed.
        const zoomControls = document.getElementsByClassName("ol-zoom-expanded-metadata")[0] as HTMLElement
        zoomControls.className = zoomControls.className.replace("ol-zoom-expanded-metadata", "ol-zoom");
    }

    public static getScaleLine() {
        return new ScaleLine({
            units: "metric",
            bar: false,
            text: false,
            minWidth: 140
        });
    }

    public static getAttributionControl() {
        return new Attribution({
            collapsible: true,
            collapsed: true,
        });
    }
}