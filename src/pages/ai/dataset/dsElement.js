import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {ClassesToArr} from "../aiUtils"

function DsElement(props){

    function showElement(props){
        let color = props.color;
        if(props.selected)
            color = "rgba(22,65,148,0.4)";

        let clsArr = ClassesToArr(props.classes)
        if(clsArr[props.dsEl.classId] !== undefined)
            return(
                <tr id={"ds"+props.dsEl.datasetID} key={"ds"+props.dsEl.datasetID} style={{backgroundColor: color}} onClick={() => {props.selectFunc(props.dsEl)}}>
                    <td>Б-{clsArr[props.dsEl.classId].class}</td>
                    <td>
                        <OverlayTrigger
                            key={"dsTT"+props.dsEl.datasetID}
                            placement={"right"}
                            overlay={
                                <Tooltip id={"dsTT"+props.dsEl.datasetID} >
                                    {props.dsEl.data}
                                </Tooltip>
                            }
                        >
                            <FontAwesomeIcon icon={faImage} />
                        </OverlayTrigger>
                    </td>
                </tr>
            )
    }

    return(
        <>
            {showElement(props)}
        </>
    )
}

export default DsElement;