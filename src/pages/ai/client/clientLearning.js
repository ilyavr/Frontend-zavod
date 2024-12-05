import {useParams} from "react-router-dom";
import {GetClientId, GetClients, GetModelId} from "../aiUtils";
import {Button, Col, ProgressBar, Row, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import {options} from "../dataset/dsStats";
import {ApiUrl} from "../../../App";
import axios from "axios";
import {DecDT} from "../../../utils/timeUtils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faPause, faPlay, faPlus, faStop} from "@fortawesome/free-solid-svg-icons";

const ClientLearning = () => {
    const {client} = useParams();


    const [clients, setClients] = useState([]);
    const [modelId, setModelId] = useState(-1);
    const [classes, setClasses] = useState([]);
    const [classesLoaded, setClassesLoaded] = useState(false)

    let clientId = GetClientId(clients, client);

    useEffect(() => {
        GetClients(setClients);
    }, []);

    useEffect(() => {
        if (clients.length > 0)
            setModelId(GetModelId(clients, client));
    }, [clients]);

    useEffect(() => {
        if(modelId !== -1) {
            setClassesLoaded(false)
            fetch(`${ApiUrl}/ai/models/getClasses?modelId=` + modelId, {method: "GET"})
                .then((response) => response.json())
                .then((data) => {
                    if(data !== null) {
                        setClasses(data);
                        setClassesLoaded(true)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }, [modelId]);

    useEffect(()=>{
        classes.forEach(item =>
            getRandomNumberForClass(item.id))
    }, [classesLoaded])

    const getRandomNumberForClass = (id) => {
        setClasses(prevConfig =>
            prevConfig.map(item =>
                item.id === id ? {
                    ...item,
                    precission: Math.floor(Math.random() * (99.98 - 90 + 1)) + 90,
                    precission2: Math.floor(Math.random() * (99.98 - 90 + 1)) + 90,
                    precission3: Math.floor(Math.random() * (99.98 - 90 + 1)) + 90
                } : item
            )
        );
    }
    function createDataLoss(){
        let stats = {
            labels: ["0",
                "100",
                "200",
                "300",
                "400",
                "500",
                "600",
                "700",
                "800",
                "900",
                "1000",
                "1100",
                "1200",
                "1300",
                "1400",
                "1500",
                "1600",
                "1700",
                "1800",
                "1900",
                "2000",
                "2100",
                "2200"],
            datasets: [
                {
                    label: "01-02-2024 13:11:39",
                    data: [3, 2.1, 1.8, 1.7, 1.6, 1.6,1.5,1.5,1.6,1.3,1.6,1.4,1.3,1.3,1.4,1.1,1.2,1.2,1,1,1,0.9,0.9,0.9],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
        };
        return stats;
    }

    function createDataPrecission(){
        //
        // let labels = Object.keys(data);
        // data = Object.values(data);

        let stats = {
            labels: ["0",
                "100",
                "200",
                "300",
                "400",
                "500",
                "600",
                "700",
                "800",
                "900",
                "1000",
                "1100",
                "1200",
                "1300",
                "1400",
                "1500",
                "1600",
                "1700",
                "1800",
                "1900",
                "2000",
                "2100",
                "2200"],
            datasets: [
                {
                    label: "01-02-2024 13:11:39",
                    data: [10,11,15,16,17,18,19,20,21,22,23,24,25,26,30,40,40,45,50,50,55,60,80,90],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
        };

        return stats;
    }

    return (
        <>
            <Row className={"d-flex justify-content-center"}>
                <Col className={"aiBlock"} md={3}>
                    <h3 className={"text-center"}>{client}</h3>
                    Состояние: Завершено<br/>
                    Batch: <span contentEditable>16</span><br/>
                    sizeX: <span contentEditable>420</span><br/>
                    sizeY: <span contentEditable>420</span><br/>
                    <Button className={"btn-sm"} variant={"default"}><FontAwesomeIcon icon={faPlay}/></Button>
                    <Button className={"btn-sm"} variant={"default"}><FontAwesomeIcon icon={faPause}/></Button>
                    <Button className={"btn-sm"} variant={"default"}><FontAwesomeIcon icon={faStop}/></Button>
                </Col>
            </Row>
            <Row className={"d-flex justify-content-center"}>
                <Col className={"aiBlock"} md={4}>
                    <h4>Обучения <Button className={"btn-sm"} variant={"default"}><FontAwesomeIcon icon={faPlus}/></Button></h4>
                    <Table hover borderless >
                        <tbody>
                        <tr style={{backgroundColor: "rgba(22,65,148,0.4)"}}>
                            <td>01-02-2024 13:11:39</td>
                        </tr>
                        <tr>
                            <td>19-01-2024 15:23:55</td>
                        </tr>
                        <tr>
                            <td>11-12-2023 22:45:52</td>
                        </tr>
                        <tr>
                            <td>20-10-2023 09:33:21</td>
                        </tr>
                        <tr>
                            <td>22-09-2023 10:28:23</td>
                        </tr>
                        <tr>
                            <td>10-09-2023 14:45:33</td>
                        </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col className={"aiBlock"} md={7}>
                    <h4>График потерь</h4>
                    <Line key="lossLine" style={{maxHeight:"250px"}} options={options} data={createDataLoss()} />

                    <h4>График точности</h4>
                    <Line key="precissionLine" style={{maxHeight:"250px"}} options={options} data={createDataPrecission()} />

                    <h4>Интеграционное тестирование <Button className={"btn-sm"} variant={"default"}><FontAwesomeIcon icon={faPlay}/></Button></h4>
                    <b>Средние значения по набору</b><br/>
                    <Row>
                        <Col md={4}>
                            Текущие веса:
                            <ProgressBar now={98} label={`${98}%`} variant={"warning"}/>
                        </Col>
                        <Col md={4}>
                            CPU тест:
                            <ProgressBar now={95.3} label={`${95.3}%`} variant={"secondary"}/>
                        </Col>
                        <Col md={4}>
                            GPU тест:
                            <ProgressBar now={99} label={`${99}%`} variant={"success"}/>
                        </Col>
                    </Row>

                    {classes.filter(item => item.class != "undefined").map(item => {
                        return(
                            <>
                                <b>{item.class}</b>
                                <br/>
                                <Row>
                                    <Col md={4}>
                                        Текущие веса:
                                        <ProgressBar now={item.precission} label={`${item.precission}%`} variant={"warning"}/>
                                    </Col>
                                    <Col md={4}>
                                        CPU тест:
                                        <ProgressBar now={item.precission2} label={`${item.precission2}%`} variant={"secondary"}/>
                                    </Col>
                                    <Col md={4}>
                                        GPU тест:
                                        <ProgressBar now={item.precission3} label={`${item.precission3}%`} variant={"success"}/>
                                    </Col>
                                </Row>
                            </>
                        )
                    })}
                </Col>
            </Row>
        </>
    );
}

export default ClientLearning;