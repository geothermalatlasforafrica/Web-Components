import {Col, Row} from "react-bootstrap";
import React from "react";

type Partner = {
    alt_text: string,
    imageSource: string,
    link: string
}

export default function Partners() {
    const partners: Partner[] = [
        {
            alt_text: "Addis-Ababa-University",
            imageSource: "images/Addis-Ababa-University_257x177.png",
            link: "https://www.aau.edu.et/"
        },
        {
            alt_text: "BRGM",
            imageSource: "images/BRGM_257x177.png",
            link: "https://www.brgm.fr/en"
        },
        {
            alt_text: "CDER",
            imageSource: "images/CDER_257x177.png",
            link: "http://www.cder.dz/"
        },
        {
            alt_text: "CNR",
            imageSource: "images/CNR_257x177.png",
            link: "https://www.cnr.it/en"
        },
        {
            alt_text: "GEO2D",
            imageSource: "images/GEO2D_257x177.png",
            link: "http://www.geo2d.com/en/home"
        },
        {
            alt_text: "GFZ",
            imageSource: "images/GFZ_257x177.png",
            link: "https://www.gfz-potsdam.de/en/"
        },
        {
            alt_text: "NARSS",
            imageSource: "images/NARSS_257x177.png",
            link: "http://www.narss.sci.eg/"
        },
        {
            alt_text: "ODDEG",
            imageSource: "images/ODDEG_257x177.png",
            link: "https://www.oddeg.dj/"
        },
        {
            alt_text: "SantAnna",
            imageSource: "images/SantAnna_257x177.png",
            link: "https://www.santannapisa.it/en"
        },
        {
            alt_text: "Strathmore-University",
            imageSource: "images/Strathmore-University_257x177.png",
            link: "https://www.strathmore.edu/"
        },
        {
            alt_text: "TNO",
            imageSource: "images/TNO_257x177.png",
            link: "https://www.tno.nl/en/"
        },
        {
            alt_text: "UK-Research-and-Innovation",
            imageSource: "images/UK-Research-and-Innovation_257x177.png",
            link: "https://www.ukri.org/"
        },
        {
            alt_text: "UNEP",
            imageSource: "images/UNEP_257x177.png",
            link: "https://www.unep.org/"
        },
        {
            alt_text: "Universidade-Eduardo-Mondlane",
            imageSource: "images/Universidade-Eduardo-Mondlane_257x177.png",
            link: "https://www.uem.mz/"
        },
        {
            alt_text: "Universita-degli-studi-di-Firenze",
            imageSource: "images/Universita-degli-studi-di-Firenze_257x177.png",
            link: "https://www.unifi.it/"
        },
        {
            alt_text: "Universita-degli-studi-di-Torino",
            imageSource: "images/Universita-degli-studi-di-Torino_257x177.png",
            link: "https://www.unito.it/"
        },
        {
            alt_text: "Universiteit-Utrecht",
            imageSource: "images/Universiteit-Utrecht_257x177.png",
            link: "https://www.uu.nl/en"
        },
        {
            alt_text: "UNIVERSITY-OF-DAR-ES-SALAAM",
            imageSource: "images/UNIVERSITY-OF-DAR-ES-SALAAM_257x177.png",
            link: "https://www.udsm.ac.tz/"
        },
        {
            alt_text: "University-of-Nairobi",
            imageSource: "images/University-of-Nairobi_257x177.png",
            link: "https://www.uonbi.ac.ke/"
        }
    ]

    return (
        <div id={"partners"}>
            <h2>Partners</h2>
            <Row className={"text-center"}>
                {
                    partners.map((partner, index) => {
                        return (
                            <Col key={index} className="col-xl-2 col-md-3 col-sm-6 col-6">
                                <a href={partner.link} target={"_blank"} rel={"noreferrer"}>
                                    <img alt={partner.alt_text} className={"img-fluid"} src={partner.imageSource}/>
                                </a>
                            </Col>
                        )
                    })
                }
            </Row>
        </div>
    )
}