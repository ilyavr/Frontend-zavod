import React, {useEffect, useState} from 'react';
import {Row} from "react-bootstrap";

const Cluster = (props) => {
    return(
        <Row>
            <iframe style={{height: "80vh"}} className={"col-md-12"} src="https://172.16.3.31:10443/#/workloads"></iframe>
        </Row>
    )
}
export default Cluster