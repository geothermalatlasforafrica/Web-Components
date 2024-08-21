export function About() {
    return (
        <div className="container-fluid">
            <h2>About</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <h3>Involved parties</h3>
            <div className="row align-items-center">
                <div className="col-4" >
                    <a href="https://www.tno.nl/en/"><img src="images/tno_logo.gif" alt="TNO Logo" style={{ maxWidth: "100%" }}></img></a>
                </div>
                <div className="col-4">
                    <a href="https://www.leap-re.eu/"><img src="images/leapre_logo.jpg" alt="LEAP-RE Logo" style={{ maxWidth: "100%" }}></img></a>
                </div>
                <div className="col-4">
                    <a href="https://www.uu.nl/en"><img src="images/uu_logo.jpg" alt="UU Logo" style={{ maxWidth: "100%" }}></img></a>
                </div>
            </div>
        </div>
    );
}