import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Form, InputGroup, Overlay, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChartSimple,
    faChevronLeft,
    faChevronRight,
    faSearch,
    faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";

import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import Modal from "react-bootstrap/Modal";
import {
    ExampleImage,
    GetClassByName,
    GetClassesCount,
    GetClientId,
    GetClients,
    GetModelId,
    LoadImg
} from "../aiUtils";
// import ClientTelemetry from "./clientTelemetry";
// import ModelControlContent from "./modelControl";
import {DecDT, GetDTString, IncDT} from "../../../utils/timeUtils";
import {useLocation, useParams} from "react-router-dom";
import {ApiUrl} from "../../../App";
import axios from "axios";
import HBControl from "./HBControl";
import TelemetryControl from "./telemetryControl";
import '../ai.css'

const ClientStats = (props) => {
    let d1 = new Date();
    let d2 = new Date();
    d2.setDate(d2.getDate() + 1);
    d2.setHours(0, 0, 0);
    d1.setHours(0,0,0);

    let dPickerStart = useRef(), dPickerStop = useRef(), startInput = useRef(), stopInput = useRef();

    const [stats, setStats] = useState([])
    const [models, setModels] = useState([]);
    const [errors, setErrors] = useState([]);
    const [show, setShow] = useState(false);
    const [modalContent, setModalContent] = useState([])
    const [statsImg, setSImg] = useState("");
    const [dsExamples, setExamples] = useState([]);
    const [classes, setClasses] = useState([]);
    const [clients, setClients] = useState([]);

    const {client} = useParams();

    const [clientId, setClientId] = useState(-1);
    const [modelId, setModelId] = useState(-1);
    const location = useLocation();
    const [cancelTokenSource, setCancelTokenSource] = useState(null);
    const [manualStats, setManualStats] = useState(false);
    const [showHB, setShowHB] = useState(false);
    const [showTelemetry, setShowTelemetry] = useState(false);

    useEffect(() => {
        GetClients(setClients)
    }, []);


    useEffect(() => {
        if(clients !== undefined && clients.length > 0) {
            setModelId(GetModelId(clients, client));
            setClientId(GetClientId(clients, client));
        }
        // clearTimeout(statsTimerId);
    }, [client, clients]);

    let lastTs = 0;
    let localStats = [];

    useEffect(() => {
        if (clientId === -1 || manualStats) return; 
        const fetchData = async () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel('Canceled by reload tab');
            }
            const newCancelTokenSource = axios.CancelToken.source();
            setCancelTokenSource(newCancelTokenSource);
    
            try {
                const response = await axios.get(`${ApiUrl}/ai/client/getStats?clientId=` + clientId + '&d1=' + Math.floor(d1.getTime() / 1000) + '&d2=' + Math.floor(d2.getTime() / 1000) + '&lastTS=' + lastTs);
                if (response.status === 200) {
                    const updatedStats = [...localStats, ...response.data];
                    localStats = updatedStats;
                    setStats(updatedStats);
                    lastTs = updatedStats[updatedStats.length - 1]?.ts || lastTs;
                }
            } catch (err) {
                if (!axios.isCancel(err)) {
                    console.log(err.message);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    fetchData();
                }
            }
        };
    
        fetchData();
    
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel('Component unmounted');
            }
        };
    }, [clientId, manualStats]);

    useEffect(() => {
        if(modelId === -1) return;
        const loadExamples = async () => {
            try {
                const response = await axios.get(`${ApiUrl}/ai/dataset/getExamples?modelId=` + modelId)
                setExamples(response.data)
            }catch(err){
                console.log(err.message);
            }
        }

        const loadClasses = async () => {
            try {
                const response = await axios.get(`${ApiUrl}/ai/models/getClasses?modelId=` + modelId)
                setClasses(response.data)
            }catch(err){
                console.log(err.message);
            }
        }

        loadClasses()
        loadExamples()
        dPickerStart.current = new AirDatepicker(startInput.current, {
            timepicker: true,
            timeFormat: 'HH:mm',
            selectedDates: d1,
            onSelect: function(data) {
                // Обновляем значение d1 при выборе новой даты в AirDatepicker
                d1 = data.date;
            }
        });
        dPickerStop.current = new AirDatepicker(stopInput.current, {
            timepicker: true,
            timeFormat: 'HH:mm',
            selectedDates: d2,
            onSelect: function(data) {
                d2 = data.date;
            }
        });
            setStats([]);
            setExamples([]);
            setClasses([]);

    }, [modelId]);

    useEffect(() =>{
        let model = {
            probeMax: 0,
            probeArr: [],
            probeMin: 0,
            ts: 0,
            errors: 0
        };

        let locModels = [];
        let locErrs = [];
        for(let i in stats) {
            let item = stats[i];

            if (locModels.at(item.plcModel) !== undefined)
                model = locModels.at(item.plcModel);
            else
                model = {
                    probeMax: 0,
                    probeArr: [],
                    probeMin: 1,
                    ts: 0,
                    errors: 0
                };

            model.probeMax = model.probeMax < item.probe ? item.probe : model.probeMax;
            model.probeArr.push(item.probe);
            if (item.probe>0){
            model.probeMin = model.probeMin > item.probe ? item.probe : model.probeMin;
            }
            model.ts = model.ts < item.ts ? item.ts : model.ts;

            if (item.plcModel !== item.aiModel) {
                model.errors++;
                locErrs.push(item);
            }

            locModels[item.plcModel] = model;
        }
        setErrors(locErrs);
        setModels(locModels);

    }, [stats])

    function getStats(){
        return(
            <>
                <Table>
                    <thead>
                        <tr className='tdCenter'>
                            <th>Модель</th><th>Мин. %</th><th>Ошибок</th><th>Время</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {models.map((item, name) => {
                        let avgProbe = 0;
                            item.probeArr.forEach(probe => {
                                avgProbe += probe;
                            })
                        avgProbe /= item.probeArr.length;
                        return(
                            <tr className='tdCenter'>
                                <td>Б-{name}</td>
                                <td>{Math.round(item.probeMin*10000)/100}</td>
                                <td>{item.errors}</td>
                                <td>{GetDTString(new Date(item.ts*1000))}</td>
                                <td>
                                    <Button  onClick={() => {
                                        modalContent.header = "Статистика Б-"+name;
                                        modalContent.model = name;
                                        modalContent.data = stats;
                                        setModalContent(modalContent);
                                        setShow(true);
                                    }} variant={"default"}><FontAwesomeIcon icon={faChartSimple} /></Button>
                                    <Button  onClick={() => {
                                        modalContent.header = "Ошибки Б-"+name;
                                        modalContent.model = name;
                                        modalContent.data = errors;
                                        setModalContent(modalContent);
                                        setShow(true);
                                    }} disabled={item.errors === 0} variant={"default"}><FontAwesomeIcon icon={faTriangleExclamation} style={item.errors > 0 ? {color: "#ffc107"}:{}} /></Button>
                                </td>
                            </tr>
                        )
                    })}

                    </tbody>
                </Table>
            </>
        );
    }


    function getModalContent(){
        if(modalContent.data !== undefined){
            return(
             <>
                <Modal.Header closeButton>
                    <Modal.Title>{modalContent.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table>
                        <thead>
                        <tr>
                            <th>Время</th><th>Ожидаемая</th><th>Распознанная</th><th>Точность</th><th>Цикл</th><th>Фото</th>
                        </tr>
                        </thead>
                        <tbody>
                            {modalContent.data.map(item => {
                                if(item.plcModel === modalContent.model || modalContent.model === "*"){
                                    return(
                                        <tr>
                                            <td>{GetDTString(new Date(item.ts*1000))}</td>
                                            <td><ExampleImage dsExample={dsExamples} cls={GetClassByName(classes, item.plcModel)} /></td>
                                            <td>
                                                <OverlayTrigger
                                                    key={"statsOT"+item.ts}
                                                    placement={"auto"}
                                                    shouldFlip
                                                    overlay={
                                                            <Tooltip className={"customOverlay"} key={"statsTT"+item.ts} >
                                                                <img src={statsImg} className={"statsImg"} alt={item.ts+".jpg"}/>
                                                            </Tooltip>
                                                    }
                                                    onToggle={() => {
                                                        LoadImg(item.ts+".jpg", setSImg, client)
                                                    }}
                                                >
                                                    <Button variant={"default"}>{item.aiModel}</Button>
                                                </OverlayTrigger>
                                            </td>
                                            <td>{item.probe}</td>
                                            <td>{item.cycle}</td>   
                                            <td>{item.ts}</td>
                                        </tr>
                                    )
                                }
                                return(<></>)
                            })}
                        </tbody>
                    </Table>
                </Modal.Body>
             </>
            )
        }
    }

    const historyStats = () => {
        if(dPickerStart.current.lastSelectedDate.getDate() !== new Date().getDate()) {
            setManualStats(true)
            setStats([]);
            try {
                axios.get(`${ApiUrl}/ai/client/getStats?clientId=` + clientId + '&d1=' + Math.floor(dPickerStart.current.lastSelectedDate.getTime() / 1000) + '&d2=' + Math.floor(dPickerStop.current.lastSelectedDate.getTime() / 1000) + '&lastTS=0')
                    .then(response => {
                        setStats(response.data)
                        console.log(response.data)
                    })
            } catch (err) {
                if (!axios.isCancel(err)) {
                    console.log(err.message);
                }
            }
        }else{
            setManualStats(false)
        }
    }

    function getLastErrTime(){
        if(errors.at(errors.length-1) !== undefined)
            return GetDTString(new Date(errors.at(errors.length-1).ts*1000))
    }

    function getRecognizedCount(){
        if(stats !== null && errors !== null)
            return stats.length-errors.length;
        else
            return 0;
    }

    return (
        <>
            <Row className={"d-flex justify-content-center"}>
                <Col className={"aiBlock"} md={3}>
                    <h3 className={"text-center"}>{client}</h3>
                    Состояние: работа<br/>
                    {/*Режим: автомат<br/>*/}
                    Ошибок сегодня: {errors.length}
                        <Button  onClick={() => {
                            modalContent.header = "Ошибки";
                            modalContent.model = "*";
                            modalContent.data = errors;
                            setModalContent(modalContent);
                            setShow(true);
                        }} variant={"default"}><FontAwesomeIcon icon={faTriangleExclamation} style={errors.length > 0 ? {color: "#ffc107"}:{}} /></Button><br/>
                    Последняя: {getLastErrTime()}<br/>
                </Col>
                <Col  className={"aiBlock"} md={3}>
                    <h3 className={"text-center"}>Статистика</h3>

                    Распознано: {getRecognizedCount()}  <Button onClick={() => {
                    modalContent.header = "Статистика";
                    modalContent.model = "*";
                    modalContent.data = stats;
                    setModalContent(modalContent);
                    setShow(true);
                }} variant={"default"}><FontAwesomeIcon icon={faChartSimple} /></Button><br/>
                    Классов: {GetClassesCount(classes)}<br/>
                    Последнее обучение: <br/>
                </Col>
                <Col className={"aiBlock text-center"} md={3}>
                    <h4>Система клиента</h4>
                    <Button variant="secondary" onClick={()=> setShowTelemetry(true)}>
                        Состояние
                    </Button><br/><br/>
                    <Button variant="secondary" onClick={()=> setShowHB(true)}>
                        Управление
                    </Button>
                    {/*<ClientTelemetry client={GetClientId(location.state.clients, client)} address={props.address} cancelTokenSource={location.state.cancelTokenSource}/>*/}
                </Col>
            </Row>
            <Row className={"d-flex justify-content-center"}>
                <Col className={"aiBlock"} md={10}>
                    <InputGroup>
                        <Button onClick={() => {DecDT(dPickerStart, dPickerStop); historyStats()}} variant={"default"} className={"btnIPrimary"}><FontAwesomeIcon icon={faChevronLeft} size={"xl"}/></Button>
                        <Form.Control id="dtStart" ref={startInput}/>
                        <Form.Control id="dtStop" ref={stopInput}/>
                        <Button onClick={() => {IncDT(dPickerStart, dPickerStop); historyStats()}} variant={"default"} className={"btnIPrimary"}><FontAwesomeIcon icon={faChevronRight} size={"xl"}/></Button>
                        <Button onClick={() => {historyStats()}} variant={"default"} className={"btnIPrimary"} style={{marginLeft: "20px"}}><FontAwesomeIcon icon={faSearch} size={"xl"}/></Button>
                    </InputGroup>
                    {getStats()}
                </Col>
            </Row>
            <Modal show={show} onHide={() => setShow(false)} size={"xl"}>
                {getModalContent()}
            </Modal>

            <Modal show={showHB} onHide={() => setShowHB(false)} size={"xs"}>
                <HBControl header={modalContent.header} client={clientId} setShow={setShowHB}/>
            </Modal>

            <Modal show={showTelemetry} onHide={() => setShowTelemetry(false)} size={"lg"}>
                <TelemetryControl header={modalContent.header} client={modalContent.client} setShow={setShowTelemetry}/>
            </Modal>
        </>
    );
}

export default ClientStats
