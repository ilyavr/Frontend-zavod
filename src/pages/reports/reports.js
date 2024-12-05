import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faReceipt} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import "../tasks/task.css"

const Reports = () => {
    return (
        <>
            <div className={"secondaryBg"}>
                <div className={"container secondaryNoSearch"}>
                    <h2 className={"text-center"}><FontAwesomeIcon icon={faReceipt}/> Отчеты
                    </h2>
                </div>
            </div>

            <Container >
                <Row className={"tasks d-flex justify-content-center"} style={{marginTop: "30px"}}>
                    <Col md={10}>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/modules/report/teplovoz/">Теплоучет - Сводный отчет</Link><br/>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/modules/report/ppu/consumption">ППУ расход компонентов:
                        заливочные машины</Link><br/>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/modules/report/ppu/mixPol">ППУ расход компонентов:
                        смешивание</Link><br/>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/modules/report/ppu/cannon">ППУ (Cannon)</Link><br/>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/modules/report/ppu/combCase600">ППУ-600
                        (Совмещение)</Link><br/>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/modules/report/ppu/fill">ППУ (Заливки)</Link><br/>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/modules/report/ppu/door600">ППУ-600 Двери</Link><br/>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/modules/report/eisenmann">Расход краски
                        Eisenmann</Link><br/>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/modules/report/ppu/ScanPPUCase">Статистика работы
                        сканеров</Link><br/>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/modules/report/tpa/">Термопластавтоматы</Link><br/>
                        <FontAwesomeIcon icon={faReceipt}/>  <Link to="/ai/client">Распознавание А100</Link><br/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Reports
