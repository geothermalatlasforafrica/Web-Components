import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Select from "ol/interaction/Select";
import {click, pointerMove} from "ol/events/condition";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Geometry} from "ol/geom";
import {Map} from "ol";

export class Interaction {
    private static readonly style = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.1)',
        }),
        stroke: new Stroke({
            color: 'rgba(255, 255, 255, 1)',
            width: 3,
        })
    });

    public static getPointerMoveInteraction(vectorLayer: VectorLayer<VectorSource<Geometry>>) {
        return new Select({
            condition: pointerMove,
            style: this.style,
            layers: [vectorLayer]
        });
    }

    public static getPointerClickInteraction() {
        return new Select({
            condition: click,
            style: this.style,
        });
    }

    public static addInteractionsToMap(map: Map, interactions: Select[]) {
        interactions.forEach(interaction => map?.addInteraction(interaction));
    }

    public static removeAllInteractionsFromMap(map: Map) {
        const existingInteractions = this.getInteractions(map);
        existingInteractions?.forEach(interaction => {
            if (interaction instanceof Select) {
                map?.removeInteraction(interaction);
            }
        })
    }

    private static getInteractions(map: Map) {
        return map?.getInteractions();
    }
}