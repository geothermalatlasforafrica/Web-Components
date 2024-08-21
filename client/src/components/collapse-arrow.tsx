import React from "react";
import {RiArrowRightSLine} from "react-icons/ri";

type CollapseArrowProps = {
    collapsed: boolean;
    onClick: () => void;
}

export default function CollapseArrow(props: CollapseArrowProps) {
    const rotation = props.collapsed ? "rotate(0deg)" : "rotate(90deg)"

    const style = {transform: rotation, transition: "all 0.2s ease", cursor: "pointer"}

    return (
        <RiArrowRightSLine
            style={style}
            size={20}
            className="ms-3"
            onClick={props.onClick}>-</RiArrowRightSLine>
    )
}