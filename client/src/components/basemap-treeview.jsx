import React from "react";
import {IoMdArrowDropright} from "react-icons/io";
import TreeView from "react-accessible-treeview";
import cx from "classnames";
import "./treeview.css";
import {RiCheckboxBlankLine, RiCheckboxFill, RiCheckboxIndeterminateFill} from "react-icons/ri";

function BasemapTreeview(props) {
    const [selectedId, setSelectedId] = React.useState(2);

    return (
        <div className="tree-view pb-0 pt-0">
            <TreeView
                data={props.data}
                aria-label="Checkbox tree"
                propagateSelect
                propagateSelectUpwards
                togglableSelect
                selectedIds={[selectedId]}
                defaultExpandedIds={[1]}
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
                                   handleSelect,
                                   handleExpand,
                               }) => {
                    return (
                        <div
                            {...getNodeProps({onClick: handleExpand})}
                            id={"tree-view-item-wrapper"}
                            style={{marginLeft: 20 * (level - 1)}}>
                            {isBranch &&
                                <ArrowIcon
                                    isOpen={isExpanded}
                                    size={18}
                                    className="icon"
                                />}
                            {!isBranch && <CheckBoxIcon
                                className="icon"
                                size={18}
                                onClick={(e) => {
                                    if (element.id === selectedId) {
                                        // It's not allowed to have no base layer selected
                                        e.stopPropagation();
                                        return
                                    }

                                    handleSelect(e);
                                    e.stopPropagation();

                                    setSelectedId(Number(element.id));
                                }}
                                variant={
                                    isHalfSelected ? "some" : isSelected ? "all" : "none"
                                }
                            />}
                            {isBranch ?
                                <span className="name">{element.name}</span>
                                :
                                <span
                                    className="name"
                                    onClick={(e) => {
                                        if (element.id === selectedId) {
                                            // It's not allowed to have no base layer selected
                                            e.stopPropagation();
                                            return
                                        }

                                        handleSelect(e);
                                        e.stopPropagation();

                                        setSelectedId(Number(element.id));
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

export default BasemapTreeview;