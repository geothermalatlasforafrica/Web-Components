import {Button, Carousel, Container} from "react-bootstrap";
import React from "react";
import Partners from "../components/partners";

export function Home() {
    return (
        <Container>
            <div className="text-center p-4" id={"header"}>
                <h1>Welcome to the Geothermal Atlas for Africa</h1>
                <div className="col-lg-6 mx-auto">
                    <p className="lead mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris in ante
                        ut
                        purus luctus congue non eleifend justo. Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit.
                        Phasellus maximus ipsum ut eros mollis porttitor.</p>
                </div>
                <div>
                    <Button href={"/map"}>To the map viewer</Button>
                </div>
            </div>
            <Carousel className="pb-4">
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src={"images/powerplant.jpg"}
                        alt="Geothermal powerplant"
                    />
                    <Carousel.Caption className={"bg-dark bg-opacity-50"}>
                        <h3>Geothermal Energy</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src={"images/socio_economics.jpg"}
                        alt="Socio economics"
                    />
                    <Carousel.Caption className="bg-dark bg-opacity-50">
                        <h3>Socio-economics</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <div id="goal" className="pb-4">
                <h2>The goal of the Atlas</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc auctor, nibh ac lacinia cursus,
                    neque odio consequat ex, sit amet auctor ex risus et felis. Proin at vehicula sem. Mauris
                    scelerisque ipsum id semper ullamcorper. Duis vestibulum nec dolor eu finibus. In vitae maximus
                    libero, lacinia aliquam urna. Ut volutpat finibus gravida. Quisque rhoncus purus vitae mi
                    mattis, a ornare lorem volutpat. In ornare eros nec ligula vulputate bibendum. Proin ligula
                    augue, eleifend quis feugiat vitae, tincidunt in eros. Mauris feugiat volutpat libero, vitae
                    sollicitudin nunc ullamcorper eu. Nullam egestas tristique justo, et varius arcu tempor id.
                    Nulla non molestie lacus. Donec scelerisque congue mauris, fringilla eleifend nunc porta
                    nec.</p>
                <p>Vestibulum ac pretium quam. Nulla tincidunt ac dolor sed fringilla. Integer condimentum placerat
                    ipsum, quis condimentum risus dignissim vel. Curabitur gravida in felis a porttitor. Fusce
                    gravida pellentesque turpis quis scelerisque. Aliquam convallis mauris consequat quam tincidunt
                    ornare. Ut sed enim est. Suspendisse at egestas tellus.</p>
            </div>
            <div id="leap-re" className="pb-4">
                <h2>About LEAP-RE</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mollis tempor lacus ut venenatis. Nulla
                    non erat semper, ullamcorper urna sollicitudin, gravida sapien. Nulla tincidunt aliquam sagittis.
                    Vivamus auctor lectus lacus. Vivamus quis consequat augue, at suscipit magna. Pellentesque habitant
                    morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at iaculis orci. Nam
                    vel mattis enim, eget congue arcu. Morbi ac gravida augue, eget aliquet massa. Fusce semper
                    tincidunt accumsan.</p>
                <p>Integer convallis ipsum non mauris vehicula, vitae consectetur dui maximus. Phasellus nec rhoncus
                    elit, sit amet fermentum elit. Quisque maximus lobortis justo. Etiam at orci a metus accumsan
                    posuere consectetur a lectus. Proin scelerisque quam neque, fermentum dictum lectus laoreet ac.
                    Curabitur tellus urna, fringilla et lobortis non, venenatis vitae ante. Aliquam dui ante, accumsan
                    eu sem nec, commodo aliquam justo. Ut eu felis efficitur, vehicula massa id, lacinia urna. Morbi in
                    laoreet eros. Integer eget urna et mauris semper ullamcorper consequat eget metus. Cras arcu ipsum,
                    sodales ac neque vitae, accumsan accumsan nisl. Mauris nec justo ac orci ultricies mattis ac id
                    dolor. Aenean sit amet gravida nisl.</p>
            </div>
            <Partners />
            <footer className="py-4 my-md-4 border-top">
                <div className="footer-eu-funding pb-4">
                    <div className="footer-eu-funding-item">
                        <img src="images/eu_flag.jpg"
                             className="footer-eu-funding-flag"
                             alt="Flag of the European Union"/>
                    </div>
                    <div className="footer-eu-funding-item">
                        <small>
                            The LEAP-RE project has received funding from the European Union’s Horizon 2020 Research
                            and Innovation Program under Grant Agreement 963530.
                        </small>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-center flex-wrap">
                    <div className="text-muted">
                        <a className={"text-muted text-underline-hover p-1"} href={"https://www.leap-re.eu/"}>
                            ©LEAP-RE 2023
                        </a>|
                    </div>
                    <div className="text-muted">
                        <a className={"text-muted text-underline-hover p-1"} href={"map"}>Map</a>
                    </div>
                    <div className="text-muted">
                        |<a className={"text-muted text-underline-hover p-1"} href={"map"}>FAQ</a>|
                    </div>
                    <div className="text-muted">
                        <a className={"text-muted text-underline-hover p-1"} href={"map"}>Partners</a></div>
                    <div className="text-muted">
                        |<a className={"text-muted text-underline-hover p-1"} href={"map"}>About</a>|
                    </div>
                    <div className="text-muted">
                        <a className={"text-muted text-underline-hover p-1"} href={"map"}>Data availability</a>
                    </div>
                </div>

            </footer>
        </Container>
    )
}