const axios = require("axios");
const express = require("express");
const {exec} = require("child_process");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");

const envPath = `.env.${process.env.NODE_ENV}`;
require("dotenv").config({path: envPath});

// Set the environment variable that is needed for database migrations
// https://salsita.github.io/node-pg-migrate/#/
process.env.DATABASE_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`;

const {pool} = require("./db"); // Import database connection

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.disable('x-powered-by');

app.set('trust proxy', 1); // trust first proxy

// https://www.npmjs.com/package/express-http-proxy
// "If you use 'https://www.npmjs.com/package/body-parser' you should declare it AFTER the proxy configuration,
// otherwise original 'POST' body could be modified and not proxied correctly."
const bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const verifyToken = (req, res, next) => {
    if (req?.headers?.authorization?.split(" ")[0] === process.env.API_TOKEN) {
        next();
    } else {
        res.status(403).send("You don't have access to this resource");
    }
};

app.get("/", async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(result.rows[0].now);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

app.post("/database-migration", verifyToken, async (req, res) => {
    try {
        console.log("Starting database migration");

        const nodePgMigratePath = path.join("node_modules", ".bin", "node-pg-migrate");

        const command = `${nodePgMigratePath} --envPath ${envPath} up`;

        const result = await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });

        console.log("Output from migration child process:");
        console.log(result);

        console.log("Finished database migration");

        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

app.post("/layer", verifyToken, async (req, res) => {
    try {
        console.log("Start inserting layer into the database");

        const layer = req.body;

        // Use parameterized query
        const text = 'INSERT INTO layers(' +
            'name, ' +
            'full_name, ' +
            'filename, ' +
            'type, ' +
            'url, ' +
            'unit, ' +
            'workspace, ' +
            'layer_group, ' +
            'description, ' +
            'keywords, ' +
            'date, ' +
            'restricted, ' +
            'resolution, ' +
            'parent_group' +
            ') ' +
            'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ' +
            'RETURNING *';
        const values = [
            layer.name,
            layer.full_name,
            layer.filename,
            layer.type,
            layer.url,
            layer.unit,
            layer.workspace,
            layer.layer_group,
            layer.description,
            layer.keywords,
            layer.date,
            layer.restricted,
            layer.resolution,
            layer.parent_group
        ];

        const result = await pool.query(text, values);

        console.log("Finished inserting layer into the database");

        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

app.get("/style/:workspace/:layer", async (req, res) => {
    console.log("Getting style");
    try {
        const workspace = req.params.workspace;
        const layer = req.params.layer;
        const url = `https://gaa-proxy.azurewebsites.net/geoserver/rest/workspaces/${workspace}/styles/${layer}_style.sld`;
        const styles = await axios.get(url, {
            auth: {
                username: process.env.GEOSERVER_USERNAME,
                password: process.env.GEOSERVER_PASSWORD
            }
        }).catch(err => {
            console.error(err);
        });
        res.set("Content-Type", 'text/.xml');
        res.status(200).send(styles.data);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

app.get("/layers/:workspace", async (req, res) => {
    const workspace = req.params.workspace;
    console.log(`Getting layers from the database for workspace ${workspace}`);

    try {
        const text = "SELECT * FROM layers WHERE workspace = $1";
        const values = [workspace];
        const result = await pool.query(text, values);
        const rows = result.rows;

        console.log(`Successfully retrieved ${rows.length} layers from the database`);

        return res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

app.delete("/layers", verifyToken, async (req, res) => {
    try {
        console.log("Start deleting layers from the database");

        const workspace = req.body.workspace;

        console.log(`Deleting layers for workspace: ${workspace}`);

        const text = `DELETE
                      FROM layers
                      WHERE workspace = $1 RETURNING *`;
        const values = [workspace];
        const result = await pool.query(text, values);

        console.log("Finished deleting layers from the database");

        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

