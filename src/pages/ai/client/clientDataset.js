import React, {useEffect, useState} from 'react';
import {Col, Row, Tabs, Tab, Button} from "react-bootstrap";
import DsStats from "../dataset/dsStats";
import DsTab from "../dataset/dsTab";
import {useParams} from "react-router-dom";
import {GetClassesCount, GetClientId, GetClients, GetModelId} from "../aiUtils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage, faMarker, faPencil, faPlus, faRedo} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import ClassesContent from "../dataset/classes"
import AddDs from "../dataset/addDs";
import {ApiUrl} from "../../../App";
import axios from "axios";

const ClientDS = (props) => {
    const [dataset, setDataset] = useState([]);
    const [accepted, setAccepted] = useState(0);
    const [filtered, setFiltered] = useState(0);
    const [validating, setValidating] = useState(0);
    const [dsExamples, setExamples] = useState([]);
    const [clients, setClients] = useState([]);
    const [classes, setClasses] = useState([]);
    const [modelId, setModelId] = useState(-1);
    const [showClss, setShowClss] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [aiModels, setAIModels] = useState([]);
    const {client} = useParams();
    
    const [selectedClass, setSelectedClass] = useState(0);
    useEffect(() => {
        GetClients(setClients);
        axios.get(`${ApiUrl}/ai/models/get`)
            .catch(error => {
                console.error(error);
            })
            .then(response =>{
                setAIModels(response.data)
            });
    }, []);

    useEffect(() => {
        if (clients.length > 0)
            setModelId(GetModelId(clients, client));
        console.log('Значение modelID ',GetModelId(clients, client))
    }, [clients]);

    useEffect(() => {
        if(modelId !== -1) {
            fetch(`${ApiUrl}/ai/dataset?modelId=` + modelId, {method: "GET"})
                .then((response) => response.json())
                .then((data) => {
                    if(data !== null)
                        setDataset(data);
                        console.log(''/data);
                })
                .catch((err) => {
                    console.log(err.message);
                });
            fetch(`${ApiUrl}/ai/dataset/getExamples?modelId=` + modelId, {method: "GET"})
                .then((response) => response.json())
                .then((data) => {
                    if(data !== null)
                        setExamples(data);
                        console.log('examples',data)
                })
                .catch((err) => {
                    console.log(err.message);
                });
            fetch(`${ApiUrl}/ai/models/getClasses?modelId=` + modelId, {method: "GET"})
                .then((response) => response.json())
                .then((data) => {
                    if(data !== null)
                        setClasses(data);
                        console.log('classes',data)
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }, [modelId]);

    useEffect(()=>{
        let aCount = 0, fCount = 0, vCount = 0;
        if(dataset !== null && dataset !== undefined)
            dataset.forEach((dsEl) => {
                if(dsEl.status === 4)
                    aCount++;
                if(dsEl.status === 3)
                    fCount++;
                if(dsEl.status === 0 || dsEl.status === 1 || dsEl.status === 2)
                    vCount++;
            })

        setFiltered(fCount);
        setValidating(vCount);
        setAccepted(aCount);
    }, [clients, dataset, modelId]);

    function getDSLength(){
        if(dataset !== null && dataset !== undefined)
            return dataset.length;
        else
            return 0;
    }

    function getDSStats(){
        let aiModelName;
        aiModels.map((aiModel) => {
            if(aiModel.id === modelId)
                aiModelName = aiModel.name
        })
        if(dataset !== null && dataset !== undefined)
            return <DsStats dataset={dataset} setSelectedClass={setSelectedClass} classes={classes} modelName={aiModelName}/>
    }

    function getDSControls(){
        if(dataset !== null && dataset !== undefined)
            return(
                <Tabs
                    defaultActiveKey="validation"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="validation" title="На валидацию">
                        <DsTab 
                        setDSFunc={setDataset}
                        dsExample={dsExamples}
                        dataset={dataset}
                        status={[0, 1, 2]}
                        address={props.address}
                        classes={classes}/>
                    </Tab>
                    <Tab eventKey="filtration" title="Отфильтровано">
                        <DsTab setDSFunc={setDataset} 
                        dsExample={dsExamples}
                        dataset={dataset}
                        status={[3]} 
                        address={props.address}
                        classes={classes}/>
                    </Tab>
                    <Tab eventKey="current" title="Текущий">
                        <DsTab setDSFunc={setDataset} 
                        dsExample={dsExamples} dataset={dataset}
                         status={[4]} 
                         address={props.address} 
                         classes={classes}/>
                    </Tab>
                </Tabs>
            )
    
    }

    function getDSStatus(){
        if(validating !== 0){
            return "Ожидает валидации";
        }else if(filtered !== 0) {
            return "Ожидает фильтрации";
        }else{
            return "Готов";
        }
    }

    return (
        <>
            <Row>
                <Col md={12}></Col>
            </Row>
            <Row className={"d-flex justify-content-center"}>
                <Col className={"aiBlock"} md={3}>
                    <h3>Набор данных</h3>
                    <b>Клиент:</b> {client}<br/>
                    <b>Режим:</b> ручная валидация<br/>
                    <b>Статус:</b> {getDSStatus()}<br/><br/>

                    <b>Изображений:</b> {getDSLength()}
                    <Button className={"btn-default btnISuccess btnSizeFix"}
                            onClick={() => setShowAdd(true)}><FontAwesomeIcon icon={faPlus}/></Button><br/>
                    <b>Подтвержденных:</b> {accepted}<br/>
                    <b>Отфильтрованно:</b> {filtered}<br/>
                    <b>На валидацию:</b> {validating}
                        <Button variant={"default"} className={"btnSizeFix btnISuccess"}>
                            <FontAwesomeIcon icon={faMarker}/>
                        </Button><br/><br/>

                    <b>Классов:</b> {GetClassesCount(classes,modelId)}
                    <Button className={"btn-default btnIWarning btnSizeFix"}
                            onClick={() => setShowClss(true)}><FontAwesomeIcon icon={faPencil}/></Button>
                    <br/>
                </Col>
                <Col className={"aiBlock"} md={8}>
                    {getDSStats()}
                </Col>
                <Col className={"aiBlock"} md={12}>
                    {getDSControls()}
                </Col>
            </Row>
            <Modal show={showClss} onHide={() => setShowClss(false)} size={"xs"}>
            <Modal.Header closeButton>
                <Modal.Title>Классы</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ClassesContent classes={classes} setClasses={setClasses} modelId={modelId}/>
            </Modal.Body>
        </Modal>
            <Modal show={showAdd} onHide={() => {setShowAdd(false);}} size={"lg"}>
                <AddDs classes={classes} clientId={GetClientId(clients, client)} client={client} dsExamples={dsExamples} dataset={dataset} setDataset={setDataset}/>
            </Modal>    
        </>
    );
}

export default ClientDS
