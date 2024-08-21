export function Data() {
    return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Data</h2>
            <ul>
                <li>Base layer from <a href="https://www.openstreetmap.org/">Open Street Map</a></li>
                <li>Basins</li>
                <li>World geothermal gradient</li>
            </ul>

            <h3>Download</h3>
            The data can be downloaded using QGIS.
            <ol>
                <li>Download and install <a href="https://qgis.org/en/site/">QGIS</a></li>
                <li>Open a new QGIS project</li>
                <li>Select <code>Layer</code> &gt; <code>Add Layer</code> &gt; <code>Add WMS/WMTS Layer...</code> or <code>Layer</code> &gt; <code>Add Layer</code> &gt; <code>Add WFS Layer...</code>.</li>
                <li>Under "Server Connections", select <code>New</code>.</li>
                <li>Enter a name for the connection.</li>
                <li>Enter the following URL: <code>http://localhost:8080/geoserver/wms</code></li>
                <li>Click <code>OK</code></li>
                <li>Click <code>Connect</code></li>
                <li>Select the layer you want to add to the project.</li>
                <li>Click <code>Add</code></li>
                <li>The layer is now added to the project. The data can be exported by right clicking the layer in the Layers panel and selecting Export.</li>
            </ol>

            <h3>Background information</h3>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt ipsum nec arcu dignissim, a sagittis odio lobortis. Nullam sodales, ipsum at ornare tincidunt, dolor sapien imperdiet purus, non pharetra elit felis quis metus. Suspendisse id dolor lorem. Nulla feugiat sem vitae lectus luctus aliquam. Donec pulvinar lacus eu massa mattis, vitae egestas magna ornare. Phasellus nec dolor eget elit aliquam auctor. Fusce eleifend mi et placerat tempor. Mauris euismod nisi quis egestas accumsan. Duis tortor eros, egestas vel rutrum in, tristique non arcu. Vivamus lacinia at felis ac varius.
            </p>
            <p>
            Etiam id sapien lacus. Phasellus lorem nisi, suscipit in augue vel, rhoncus aliquam ligula. In auctor id massa at porttitor. Nullam dictum neque dui, vel accumsan massa commodo ut. Pellentesque fringilla ante non elit commodo, at fringilla dolor semper. Proin viverra diam non justo bibendum commodo. Mauris semper mi orci, non mollis tortor rhoncus ut. Maecenas sed aliquam velit. Duis nibh orci, bibendum ultricies consectetur vitae, faucibus eu ex. Nunc in lorem ut erat sollicitudin cursus. Suspendisse potenti.
            </p>
        </main>
    );
}