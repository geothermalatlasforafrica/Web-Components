export class ApiLayer {
    public name: string
    public full_name: string
    public filename: string
    public type: string
    public url: string
    public unit: string
    public workspace: string
    public description: string
    public resolution: string
    public keywords: string
    public date: string
    public restricted: string
    public layer_group: string
    public parent_group: string

    constructor(
        name: string,
        full_name: string,
        filename: string,
        type: string,
        url: string,
        unit: string,
        workspace: string,
        description: string,
        resolution: string,
        keywords: string,
        date: string,
        restricted: string,
        layer_group: string,
        parent_group: string
    ) {
        this.name = name
        this.full_name = full_name
        this.filename = filename
        this.type = type
        this.url = url
        this.unit = unit
        this.workspace = workspace
        this.description = description
        this.resolution = resolution
        this.keywords = keywords
        this.date = date
        this.restricted = restricted
        this.layer_group = layer_group
        this.parent_group = parent_group
    }

    public getLayerIdentifier(layer: ApiLayer): string {
        return `${layer.workspace}:${layer.name}`;
    }
}