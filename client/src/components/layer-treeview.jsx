import React from "react";
import {IoMdArrowDropright} from "react-icons/io";
import TreeView from "react-accessible-treeview";
import cx from "classnames";
import "./treeview.css";
import {RiCheckboxBlankLine, RiCheckboxFill, RiCheckboxIndeterminateFill, RiInformationLine} from "react-icons/ri";

function LayerTreeview(props) {
    return (
        <div className="tree-view pb-0 pt-0">
            <TreeView
                data={props.data}
                aria-label="Checkbox tree"
                propagateSelect
                propagateSelectUpwards
                togglableSelect
                multiSelect
                selectedIds={props.selectedIds}
                onSelect={(e) => {
                    props.onTreeViewItemSelect(e);
                }}
                nodeRenderer={({
                                   element,
                                   isBranch,
                                   isExpanded,
                                   isSelected,
                                   isHalfSelected,
                                   getNodeProps,
                                   level,
                                   handleExpand,
                               }) => {
                    const backgroundColor = props.highlightedIds.includes(element.id) ? "#afd7ff" : "transparent";
                    return (
                        <div
                            {...getNodeProps({onClick: handleExpand})}
                            id={"tree-view-item-wrapper"}
                            style={{marginLeft: 20 * (level - 1), backgroundColor: backgroundColor}}>
                            {isBranch &&
                                <ArrowIcon
                                    isOpen={isExpanded}
                                    size={18}
                                    className="icon"
                                />}
                            {!isBranch &&
                                <CheckBoxIcon
                                    className="icon"
                                    size={18}
                                    variant={isHalfSelected ? "some" : isSelected ? "all" : "none"}
                                    onClick={(e) => {
                                        props.onTreeViewItemClicked(element.id)
                                        e.stopPropagation();
                                    }}
                                />}

                            {!isBranch &&
                                <RiInformationLine
                                    className="icon"
                                    color="#007bff"
                                    size={18}
                                    onClick={() => props.onInfoButtonClicked(element)}
                                />
                            }

                            {isBranch ?
                                <span className="name">{element.name}</span>
                                :
                                <span
                                    className="name"
                                    onClick={(e) => {
                                        props.onTreeViewItemClicked(element.id)
                                        e.stopPropagation();
                                    }}>
                                        {element.name}
                                    </span>
                            }
                        </div>
                    );
                }}
            />
        </div>
    );
}

const ArrowIcon = ({isOpen, className}) => {
    const baseClass = "arrow";
    const classes = cx(
        baseClass,
        {[`${baseClass}--closed`]: !isOpen},
        {[`${baseClass}--open`]: isOpen},
        className
    );
    return <IoMdArrowDropright className={classes} size={20}/>;
};

const CheckBoxIcon = ({variant, ...rest}) => {
    switch (variant) {
        case "all":
            return <RiCheckboxFill {...rest} />;
        case "none":
            return <RiCheckboxBlankLine {...rest} />;
        case "some":
            return <RiCheckboxIndeterminateFill {...rest} />;
        default:
            return null;
    }
};

export default LayerTreeview;