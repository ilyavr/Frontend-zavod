import React, {useState, useEffect, useRef} from 'react';
import axios from "axios";
import {ApiUrl} from "../../../App";
import {Form, Accordion, Card, ListGroup, Col, Row, Button, Overlay, Tooltip, OverlayTrigger} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfo, faPencil, faPlus, faSave, faTimes, faUpload} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import {GetClientId, GetClients, GetModelId} from "../aiUtils";
import {useParams} from "react-router-dom";

const ClientSettings = () => {

    const [config, setConfig] = useState([]);
    const [origConfig, setOrigConfig] = useState([]);
    const [clients, setClients] = useState([]);
    const {client} = useParams();
    const [clientId, setClientId] = useState(-1);
    const [nestedId, setNestedId] = useState(-2);

    useEffect(() => {
        GetClients(setClients)
    }, []);


    useEffect(() => {
        if(clients !== undefined && clients.length > 0) {
            setClientId(GetClientId(clients, client));
        }
    }, [client, clients]);

    useEffect(() => {
        axios.get(`${ApiUrl}/ai/config/getAllApp?id=1`)
            .catch(error => {
                console.error(error);
            })
            .then(response =>{
                setConfig(response.data)
                setOrigConfig(response.data)
                setNestedId(getCurrentMaxId()+1)
            });
    }, []);

    const handleValueChange = (id, value) => {
        setConfig(prevConfig =>
            prevConfig.map(item =>
                item.id === id ? { ...item, value: value } : item
            )
        );
    };

    const handleParamChange = (id, param) => {
        setConfig(prevConfig =>
            prevConfig.map(item =>
                item.id === id ? { ...item, param: param } : item
            )
        );
    };

    const handleDescriptionChange = (id, description) => {
        setConfig(prevConfig =>
            prevConfig.map(item =>
                item.id === id ? { ...item, description } : item
            )
        );
    };

    const handleTypeChange = (id, type) => {
        setConfig(prevConfig =>
            prevConfig.map(item =>
                item.id === id ? { ...item, paramType: type } : item
            )
        );
    };

    const getNestedContent = (id, parentId, paramType, app, visited) => {
        if (visited.has(id)) {
            return null; // Prevents infinite recursion
        }
        visited.add(id);
        return getAppContent(id, parentId, paramType, app, visited);
    };

    const getCurrentMaxId = () => {
        let tmpConfig = config
        if (tmpConfig.length === 0) return 0; // Handle case where config is empty
        return tmpConfig.reduce((maxElement, currentElement) => {
            return currentElement.id > maxElement.id ? currentElement: maxElement
        }).id;
    };

    const addNested = (id, app, client) =>{
        setConfig(prevConfig => [
            ...prevConfig,
            {
                id: nestedId,
                param: "",
                value: "VALUE",
                paramType: "string",
                parentId: id,
                description: "",
                app: app,
                clientId: client
            }
        ]);
        setNestedId(nestedId + 1)
    }

    const remove = (element) => {
        setConfig(prevConfig => prevConfig.filter(item => item !== element))
    }

    const getAddButton = (paramType, id, app, client) => {
        if(paramType === "list" || paramType === "structure")
            return (
                <Button className={"appBtn btn-default btn-sm"} onClick={() => addNested(id, app, client)}><FontAwesomeIcon icon={faPlus}/></Button>
            )
    }

    const getRemoveButton = (element) => {
            return (
                <Button className={"appBtn btn-default btn-sm"} onClick={() => remove(element)}><FontAwesomeIcon icon={faTimes}/></Button>
            )
    }

    const saveSettings = () =>{//TODO: доделать
        // Массив для измененных элементов
        const changedElements = config.filter(newItem => {
            const oldItem = origConfig.find(oldItem => oldItem.id === newItem.id);
            if (!oldItem) return false; // Если элемент не найден в старом массиве, он не изменен

            // Сравниваем все поля, кроме id
            return Object.keys(newItem).some(key => key !== 'id' && newItem[key] !== oldItem[key]);
        });

        // Массив для новых элементов
        const newElements = config.filter(newItem =>
            !origConfig.some(oldItem => oldItem.id === newItem.id)
        );

        console.log(newElements)
        console.log(changedElements)
        //
        // setTimeout(()=>{
        //     toast.success(`Конфигурация сохранена в БД!`)
        // }, 500)
    }

    const uploadSettings = () =>{
        setTimeout(()=>{
            toast.success(`Конфигурация на хосте обновлена!`)
        }, 2000)
    }

    const NumericContentEditable = (item) => {
        const handleInput = (e) => {
            const value = e.target.innerText;
            if (!/^\d*$/.test(value)) {
                e.target.innerText = value.replace(/\D/g, '');
            }
        };

        const handleKeyPress = (e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        };

        return (
            <Col
                contentEditable
                onInput={handleInput}
                onKeyPress={handleKeyPress}
                onChange={e => handleValueChange(item.id, e.target)}
                suppressContentEditableWarning
                style={{display: 'inline'}}
                className={"paramValue"}
                md={7}
            >
                {item.value}
            </Col>
        );
    };

    const getValueFld = (item) => {
        switch (item.paramType){
            case "number":
                return NumericContentEditable(item)
            case "bool":
                return(
                    <Col md={7}>
                        <Form.Control
                            as="select"
                            value={item.value}
                            onChange={e => handleValueChange(item.id, e.target.value)}
                            className={"paramSelect"}
                        >
                            <option value="false">False</option>
                            <option value="true">True</option>
                        </Form.Control>
                    </Col>
                )
            case "string":
                return (
                    <Col
                        contentEditable
                        onChange={e => handleValueChange(item.id, e.target)}
                        suppressContentEditableWarning
                        style={{display: 'inline'}}
                        className={"paramValue"}
                        md={7}
                    >
                        {item.value}
                    </Col>
                )
            case "list":
            case "structure":
                return (
                    <Col
                        style={{display: 'inline'}}
                        className={"paramValue"}
                        md={7}
                    >
                    </Col>
                )
            case "clientid":
                return (
                    <Col
                        style={{display: 'inline'}}
                        className={"paramValue"}
                        md={7}
                    >
                        {clientId}
                    </Col>
                )
        }
    }

    const getParamNameFld = (item, editable) => {
        if(item.description !== ""){
            return(
                <OverlayTrigger
                    key={"dsExampleImg"}
                    placement={"left"}
                    shouldFlip
                    overlay={
                    <Tooltip>
                        {item.description}
                    </Tooltip>
                }
                >
                    <Col
                        contentEditable={editable}
                        onChange={e => handleParamChange(item.id, e.target)}
                        suppressContentEditableWarning
                        style={{display: 'inline'}}
                        className={"paramName"}
                        md={3}
                    >
                        {item.param}
                    </Col>
                </OverlayTrigger>
            )
        } else {
            return(
                <Col
                    contentEditable={editable}
                    onChange={e => handleParamChange(item.id, e.target)}
                    suppressContentEditableWarning
                    style={{display: 'inline'}}
                    className={"paramName"}
                    md={3}
                >
                    {item.param}
                </Col>
            )
        }
    }



    const getAppContent = (id, parentId, parentType, app, visited) => {
        let editableParam = true
        if(parentType === "list")
            editableParam = false
        return (
            <>
                {config.filter(item => item.parentId === id && item.app === app && item.parentId !== parentId).map(item => (
                    <>
                        <ListGroup.Item
                            id={item.id}
                        >
                            <Row>
                                {getParamNameFld(item, editableParam)}
                                {getValueFld(item)}
                                <Col md={1}>
                                    <Form.Control
                                        as="select"
                                        value={item.paramType}
                                        onChange={e => handleTypeChange(item.id, e.target.value)}
                                        style={{display: 'inline', width: 'auto'}}
                                        className={"paramSelect"}
                                    >
                                        <option value="number">Number</option>
                                        <option value="string">String</option>
                                        <option value="list">List</option>
                                        <option value="structure">Structure</option>
                                        <option value="bool">Boolean</option>
                                        <option value="clientid">Client ID</option>
                                    </Form.Control>
                                </Col>
                                <Col md={1}>
                                    {getAddButton(item.paramType, item.id, item.app, item.clientId)}
                                    {getRemoveButton(item)}
                                </Col>
                            </Row>
                            {getNestedContent(item.id, item.parentId, item.paramType, app, visited)}
                        </ListGroup.Item>
                    </>
                ))}
            </>)
    }

    return (
        <>
            <h2>Настройки

                    {/* <OverlayTrigger
                        placement='top'
                        overlay = {<Tooltip>Настройки</Tooltip>}
                    >
                        <Button className={"btn btnIPrimary"} variant={"default"} onClick={() => handleNavigation("/ai/"+client+"/settings",'settings')}>
                            <FontAwesomeIcon icon={faCog} size={"2xl"} color ={activeButton === 'settings' ? 'rgba(22, 65, 148, 0.7)' : 'grey'}/></Button>
                
                    </OverlayTrigger> */}
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Сохранить настройки</Tooltip>}
                >
                <Button className={"btn-default btn-lg"} onClick={saveSettings}><FontAwesomeIcon icon={faSave}/></Button>
                </OverlayTrigger>
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Применить настройки</Tooltip>}
                >
                <Button className={"btn-default btn-lg"} onClick={uploadSettings}><FontAwesomeIcon icon={faUpload}/></Button>
                </OverlayTrigger>
            </h2>
            <br/>
            <Accordion key="0">
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Detector</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            <h3><span>Detector</span> <Button className={"appBtn btn-default btn-sm"} onClick={() => addNested(-1, "Detector", clientId)}><FontAwesomeIcon icon={faPlus}/></Button></h3>
                            {getAppContent(-1, 0, "", "Detector", new Set())}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Telemetry</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            <h3><span>Telemetry</span> <Button className={"appBtn btn-default btn-sm"} onClick={() => addNested(-1, "Telemetry", clientId)}><FontAwesomeIcon icon={faPlus}/></Button></h3>
                            {getAppContent(-1, 0, "", "Telemetry", new Set())}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Data Cache</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            <h3><span>Data Cache</span> <Button className={"appBtn btn-default btn-sm"} onClick={() => addNested(-1, "DataCache", clientId)}><FontAwesomeIcon icon={faPlus}/></Button></h3>
                            {getAppContent(-1, 0, "", "DataCache", new Set())}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                    <Accordion.Header>SQL Cache</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            <h3><span>SQL Cache</span> <Button className={"appBtn btn-default btn-sm"} onClick={() => addNested(-1, "SQLCache", clientId)}><FontAwesomeIcon icon={faPlus}/></Button></h3>
                            {getAppContent(-1, 0, "", "SQLCache", new Set())}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5">
                    <Accordion.Header>Conductor</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            <h3><span>Conductor</span> <Button className={"appBtn btn-default btn-sm"} onClick={() => addNested(-1, "ClientConductor", clientId)}><FontAwesomeIcon icon={faPlus}/></Button></h3>
                            {getAppContent(-1, 0, "", "ClientConductor", new Set())}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>

            </Accordion>
        </>
    );
}

export default ClientSettings
