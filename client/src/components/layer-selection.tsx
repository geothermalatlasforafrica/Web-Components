import React, {useEffect} from 'react';
import {MapLayer} from "../layers/map-layer";
import LayerTreeview from "./layer-treeview";
import {flattenTree, INode, ITreeViewOnSelectProps} from "react-accessible-treeview";
import {Button, Card, Collapse} from "react-bootstrap";
import BasemapTreeview from "./basemap-treeview";
import BorderSpinner from "./border-spinner";
import CollapseArrow from "./collapse-arrow";
import LayerSearch from "./layer-search";
import {Events} from "../events";

type LayerSelectionProps = {
    mapLayers: MapLayer[];
    onLayerCheckBoxClicked: (layerIdentifier: string) => void;
    onLayerSelect: (isSelected: boolean, identifier: string) => void;
    onBaseMapSelect: (baseMapName: string) => void;
    onResetLayers: () => void;
    onShowMetadata: (layerIdentifier: string) => void;
}

export default function LayerSelection(props: LayerSelectionProps) {
    const [isLoadingLayers, setIsLoadingLayers] = React.useState<boolean>(true);
    const [expanded, setExpanded] = React.useState(true);
    const [highlightedIds, setHighlightedIds] = React.useState<string[]>([]);

    useEffect(() => {
        const isLoading = props.mapLayers?.length === 0
        setIsLoadingLayers(isLoading);
    }, [props.mapLayers])

    const distinctWmsLayers: MapLayer[] = [];

    props.mapLayers.forEach(mapLayer => {
        if (!distinctWmsLayers.some(l => l.identifier === mapLayer.identifier && l.mapServiceType === "wms")) {
            distinctWmsLayers.push(mapLayer);
        }
    })

    const baseMapsFolder = {
        name: "",
        children:
            [
                {
                    name: "Base maps",
                    children: [
                        {name: "OpenStreetMap"},
                        {name: "Satellite"},
                        {name: "Topography"}
                    ]
                }
            ]
    };

    const distinctParentGroups = distinctWmsLayers
        .filter(l => l.parentGroup != "") // Filter out the base maps. They don't have a parent group
        .map(l => l.parentGroup)
        .filter((value, index, array) => array.indexOf(value) === index);


    const layersFolder = {
        name: "",
        children: distinctParentGroups.map(parentGroupName => {
            const distinctLayerGroups = distinctWmsLayers
                .filter(l => l.parentGroup === parentGroupName)
                .map(l => l.layerGroup)
                .filter((value, index, array) => array.indexOf(value) === index);

            return {
                name: parentGroupName,
                id: parentGroupName,
                children: distinctLayerGroups.map(layerGroup => {
                    const layersInLayerGroup = distinctWmsLayers.filter(l => l.layerGroup === layerGroup);
                    return {
                        name: layerGroup,
                        id: layerGroup,
                        children: layersInLayerGroup.map(l => {
                            return {
                                name: l.fullName,
                                id: l.identifier
                            }
                        })
                    }
                })
            }
        })
    };

    const baseMapsData = flattenTree(baseMapsFolder);
    const layerData = flattenTree(layersFolder);

    const handleLayerTreeViewItemSelect = (selectedNode: ITreeViewOnSelectProps) => {
        if (selectedNode.isBranch) {
            return
        }

        const parentNodeId = selectedNode.element.parent;
        const parentNode = layerData.find(d => d.id === parentNodeId);
        const mapLayer = props.mapLayers.find(l =>
            l.fullName === selectedNode.element.name &&
            l.layerGroup === parentNode?.name
        );

        if (mapLayer == null) {
            return;
        }

        props.onLayerSelect(selectedNode.isSelected, mapLayer.identifier);
    }

    const handleBaseMapTreeViewItemSelect = (selectedNode: ITreeViewOnSelectProps) => {
        if (selectedNode.isBranch) {
            return
        }

        const baseMapName = selectedNode.element.name;

        if (selectedNode.isSelected) {
            props.onBaseMapSelect(baseMapName)
        }
    }

    const handleInfoButtonClicked = (selectedNode: INode) => {
        if (selectedNode.isBranch) {
            return
        }

        const parentNodeId = selectedNode.parent;
        const parentNode = layerData.find(d => d.id === parentNodeId);
        const mapLayer = props.mapLayers.find(l =>
            l.fullName === selectedNode.name &&
            l.layerGroup === parentNode?.name
        );

        if (mapLayer == null) {
            return;
        }

        props.onShowMetadata(mapLayer.identifier);
    }

    function handleSearchSubmit(searchQuery: string, event?: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault();

        if (searchQuery === "") {
            setHighlightedIds([]);
            return;
        }

        const searchResults = props.mapLayers.filter(l => l.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

        if (searchResults.length === 0) {
            setHighlightedIds([]);
            Events.fireWarningToast("No results found");
            return;
        }

        const parentGroups = searchResults
            .map(l => l.parentGroup)
            .filter((value, index, array) => array.indexOf(value) === index);

        const groups = searchResults.map(l => l.layerGroup);
        const uniqueGroups = groups.filter((value, index, array) => array.indexOf(value) === index);

        const layerIdentifiers = searchResults.map(l => l.identifier);
        const uniqueLayerIdentifiers = layerIdentifiers.filter((value, index, array) => array.indexOf(value) === index);

        const ids = parentGroups.concat(uniqueLayerIdentifiers.concat(uniqueGroups));

        setHighlightedIds(ids);
    }

    return (
        <Card className="map-overlay-widget position-absolute m-2">
            <Card.Header>
                <span className="align-items-center d-flex flex-row justify-content-between">
                    <div>Layers</div>
                    <div>
                        <Button
                            variant="outline-primary"
                            size={"sm"}
                            className="mx-1"
                            onClick={props.onResetLayers}>
                            Reset
                        </Button>
                        <CollapseArrow
                            collapsed={!expanded}
                            onClick={() => setExpanded(!expanded)}/>
                    </div>
                </span>
            </Card.Header>
            <LayerSearch onSearchSubmit={handleSearchSubmit}/>
            <Collapse in={expanded}>
                <div className="overflow-auto py-1">
                    <BasemapTreeview
                        data={baseMapsData}
                        onTreeViewItemSelect={handleBaseMapTreeViewItemSelect}
                    />
                    {isLoadingLayers ?
                        <div className="text-center p-3">
                            <span>
                                <BorderSpinner show={isLoadingLayers} small={true}/> Getting layer information...
                            </span>
                        </div>
                        :
                        <LayerTreeview
                            data={layerData}
                            selectedIds={props.mapLayers.filter(l => l.isActive).map(l => l.identifier)}
                            highlightedIds={highlightedIds}
                            onTreeViewItemClicked={props.onLayerCheckBoxClicked}
                            onTreeViewItemSelect={handleLayerTreeViewItemSelect}
                            onInfoButtonClicked={handleInfoButtonClicked}
                        />
                    }
                </div>
            </Collapse>
        </Card>
    )
}