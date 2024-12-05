import Modal from "react-bootstrap/Modal";
import {Button, Col, InputGroup, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faPlus, faRedo, faSearch, faTimes} from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import Form from "react-bootstrap/Form";
import {DecDT, GetDTString, IncDT} from "../../../utils/timeUtils";
import {
    ClassesToArr,
    ExampleImage, GetClassByName,
    GetClassId, GetClientId, GetClients, GetModelId,
    LoadImg
} from "../aiUtils";
import AirDatepicker from "air-datepicker";
import {ApiUrl} from "../../../App";

const AddDs = (props) => {
    const [statsImg, setSImg] = useState("");
    const [currentCls, setCurrentCls] = useState(0);
    const [stats, setStats] = useState([]);

    let d1 = new Date();
    let d2 = new Date();
    d2.setDate(d2.getDate() + 1);
    d2.setHours(0, 0, 0);
    d1.setHours(0,0,0);

    let dPickerStart = useRef(), dPickerStop = useRef(), startInput = useRef(), stopInput = useRef();


    useEffect(() => {
        dPickerStart.current = new AirDatepicker(startInput.current, {
            timepicker: true,
            timeFormat: 'HH:mm',
            selectedDates: d1,
        });
        dPickerStop.current = new AirDatepicker(stopInput.current, {
            timepicker: true,
            timeFormat: 'HH:mm',
            selectedDates: d2
        });
        loadStats()
    }, []);

    const handleAddToDataset = (id) => {
        let newDSElement
        let updatedStatsElement
        const updatedDataset = props.dataset;
        const updatedStats = stats.map((stat) => {
            if (stat.statID === id && !stat.inDataset) {
                let classId = GetClassId(props.classes, stat.plcModel)
                if(classId === -1) classId = 0
                newDSElement = {
                    datasetId: -1,
                    data: stat.inputData,
                    status: stat.status,
                    classId: classId, // Set the appropriate class ID here
                    x: stat.x,
                    y: stat.y,
                    w: stat.w,
                    h: stat.h,
                    version: 0, // Set the appropriate version here
                    timestamp: Math.floor(Date.now() / 1000)
                }
                updatedDataset.push(newDSElement);
                stat.inDataset = true;
                updatedStatsElement = stat;
            }
            return stat;
        });
        props.setDataset(updatedDataset);
        setStats(updatedStats);
        saveData(newDSElement, updatedStatsElement)
    };

    function saveData(newDSElement, updatedStatsElement){
        axios.post(`${ApiUrl}/ai/dataset/addElement`, newDSElement)
            .catch(error => {
                console.error(error);
            });

        axios.put(`${ApiUrl}/ai/client/stats/updateElement`, updatedStatsElement)
            .catch(error => {
                console.error(error);
            });
    }

    function loadStats() {
        if (props.clientId !== -1) {
            fetch(`${ApiUrl}/ai/client/getStats?clientId=` + props.clientId + '&d1=' + Math.floor(dPickerStart.current.selectedDates[0].getTime() / 1000) + '&d2=' + Math.floor(dPickerStop.current.selectedDates[0].getTime() / 1000), {method: "GET"})
                .then((response) => response.json())
                .then((data) => {
                    setStats(data);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }

    let clssArr = ClassesToArr(props.classes)


    function content(){
        let data = []
        if(stats !== undefined && stats !== null)
            data = stats.map(item => {
                if((clssArr[currentCls] === undefined || String(item.plcModel) === String(clssArr[currentCls].class) || String(currentCls) === "*") && !item.inDataset){
                    return(
                        <tr>
                            <td>{GetDTString(new Date(item.ts*1000))}</td>
                            <td><ExampleImage dsExample={props.dsExamples} cls={GetClassByName(props.classes, item.plcModel)} /></td>
                            <td>
                                <OverlayTrigger
                                    key={"statsOT"+item.ts}
                                    placement={"auto"}
                                    shouldFlip
                                    overlay={
                                        <Tooltip className={"customOverlay"} key={"statsTT"+item.ts}>
                                            <img src={statsImg} className={"statsImg"} alt={item.ts+".jpg"}/>
                                        </Tooltip>
                                    }
                                    onToggle={() => {
                                        LoadImg(item.ts+".jpg", setSImg, props.client)
                                    }}
                                >
                                    <Button variant={"default"}>{item.aiModel}</Button>
                                </OverlayTrigger>
                            </td>
                            <td>{item.probe}</td>
                            <td><Button variant={"default"} className={"btnSizeFix btnISuccess"} onClick={() => handleAddToDataset(item.statID)}><FontAwesomeIcon icon={faPlus} size={"xl"}/></Button></td>
                        </tr>
                    )
                }
            })

        if(data.every((val, i, arr) => val === arr[0]))
            return(<tr><td colSpan={4}>Нет данных</td></tr>)
        else
            return data
    }

    function classesOptionList(){
        if(props.classes !== undefined && props.classes !== null)
        return props.classes.map((cls) => {
            return(
                <option value={cls.id}>{cls.class}</option>
            )
        })
    }

    if (props.classes !== undefined) {
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Дополнить набор</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={"text-end"}>
                        <Row>
                            <Col md={3}>
                                <Form.Select
                                value={currentCls}
                                onChange={(e) => setCurrentCls(e.target.value)}
                            >
                                    <option value={"*"}>Все</option>
                                    {classesOptionList()}
                            </Form.Select>
                            </Col>
                            <Col md={9}>
                                <InputGroup>
                                <Button onClick={() => {DecDT(dPickerStart, dPickerStop); loadStats()}} variant={"default"} className={"btnIPrimary"}><FontAwesomeIcon icon={faChevronLeft} size={"xl"}/></Button>
                                <Form.Control id="dtStart" ref={startInput}/>
                                <Form.Control id="dtStop" ref={stopInput}/>
                                <Button onClick={() => {IncDT(dPickerStart, dPickerStop); loadStats()}} variant={"default"} className={"btnIPrimary"}><FontAwesomeIcon icon={faChevronRight} size={"xl"}/></Button>
                                <Button onClick={() => {loadStats()}} variant={"default"} className={"btnIPrimary"} style={{marginLeft: "20px"}}><FontAwesomeIcon icon={faSearch} size={"xl"}/></Button>
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>
                    <Table>
                        <thead>
                        <tr>
                            <th>Время</th><th>Ожидаемая</th><th>Распознанная</th><th>Точность %</th><th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {content()}
                        </tbody>
                    </Table>
                </Modal.Body>
            </>
        );
    }
};

export default AddDs;

