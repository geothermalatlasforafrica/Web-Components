import {Button, CloseButton, Form, InputGroup} from "react-bootstrap";
import {MdSearch} from "react-icons/md";
import React from "react";

type LayerSearchProps = {
    onSearchSubmit: (searchQuery: string, event?: React.FormEvent<HTMLFormElement>) => void;
}

export default function LayerSearch(props: LayerSearchProps) {
    const [searchQuery, setSearchQuery] = React.useState<string>("");

    function resetSearch() {
        setSearchQuery("");  // Set the value of the input field
        props.onSearchSubmit("")  // Submit the form, hereby resetting the highlighted layers
    }

    return (
        <div>
            <div id="search-input" className="m-1">
                <Form onSubmit={(event) => props.onSearchSubmit(searchQuery, event)}>
                    <InputGroup size={"sm"}>
                        <Form.Control
                            placeholder="Search for a layer..."
                            aria-label="Search input and button"
                            aria-describedby="search-button"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                        <div className="inner-btn" onClick={resetSearch}>
                            <CloseButton/>
                        </div>
                        <Button variant="outline-secondary" id="search-button" type="submit">
                            <MdSearch size={"20"}/>
                        </Button>
                    </InputGroup>
                </Form>
            </div>
        </div>
    )
}