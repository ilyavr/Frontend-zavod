import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { ApiUrl } from "../../../App";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const TelemetryControlContent = () => {
    const [telemetryData, setTelemetryData] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [cpuTemperatureData, setCpuTemperatureData] = useState([]);
    const [RAMData,setRAMData] = useState([]);
    const [timestamps, setTimestamps] = useState([]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000); 
        return date.toLocaleString("ru-RU", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const fetchCpu = () => {
        axios
            .get(`${ApiUrl}/ai/telemetrygraph/telemetrygraph`)
            .then((response) => {
                console.log("Ответ от сервера CPU:", response.data);
                const cpuData = response.data.map(item => {
                    try {
                        return {
                            timestamp: item.timestamp, 
                            temperature: item.average_temperature,
                            ram: item.average_ram
                        };
                    } catch (error) {
                        console.error("Ошибка при разборе данных CPU:", error);
                        return null;
                    }
                }).filter(item => item !== null);
    
                const temperatureData = cpuData.map(data => data.temperature); 
                const timestampsData = cpuData.map(data => data.timestamp);
                const RamData = cpuData.map(data => data.ram);
                setCpuTemperatureData(temperatureData);  
                setRAMData(RamData);
                setTimestamps(timestampsData);
            })
            .catch((error) => {
                console.error("Ошибка при получении данных графика CPU:", error);
            });
    };

    const fetchTelemetryData = () => {
        axios
            .get(`${ApiUrl}/ai/telemetry/latest`)
            .then((response) => {
                const rawTelemetry = response.data;
                setTelemetryData(rawTelemetry);
                const parsed = JSON.parse(rawTelemetry.data);
                setParsedData(parsed);
            })
            .catch((error) => {
                console.error("Ошибка загрузки телеметрии:", error);
            });
    };

    useEffect(() => {
        fetchTelemetryData();
        fetchCpu();  
    }, []);

    const data = {
        labels: timestamps.map((timestamp) => formatTimestamp(timestamp)).reverse(), 
        datasets: [
            {
                label: "Температура CPU (°C)",
                data: cpuTemperatureData,  
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
            },
        ],
    };
    const isDataAvailable = cpuTemperatureData.length > 0 && timestamps.length > 0;
    const memorydata = {
        labels: timestamps.map((timestamp) => formatTimestamp(timestamp)).reverse(), 
        datasets: [
            {
                label: "Данные RAM",
                data: RAMData, 
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
            },
        ],
    };
    const isRamDataAvailable = RAMData.length > 0 && timestamps.length > 0;
return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Телеметрия клиента</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {parsedData ? (
                    <>
                        <Row>
                            <h5 align="center">Общая информация</h5>

                            <Row>
                                <Col>
                                    <b>Последние данные за:</b> {formatTimestamp(parsedData.timestamp)}
                                </Col>
                            </Row>
                            <br />
                            <br />
                            <Col>
                                <b>RAM (Доступно/Всего):</b>{" "}
                                {parsedData.mem?.ram?.physicAvailable} / {parsedData.mem?.ram?.physicTotal}
                                <br />
                                <b>Swap (Доступно/Всего):</b>{" "}
                                {parsedData.mem?.ram?.swapAvailable} / {parsedData.mem?.ram?.swapTotal}
                                <br />
                            </Col>
                            <Col>
                                <b>Загрузка CPU:</b>
                                {parsedData.cpu?.load?.map(value => Number(value).toFixed(2)).join(", ")}
                                <br />
                                <b>Температура CPU (°C):</b> {parsedData.thermal?.CPU}
                                <br />
                            </Col>
                        </Row>

                        <Row>
                            <h5 align="center">График температуры CPU</h5>
                            {isDataAvailable ? (
                                <Line data={data} />
                                
                            ) : (
                                <p>Загрузка данных...🏭</p>
                            )}
                        </Row>
                        <Row>
                            <h5 align="center">График RAM</h5>
                            {isRamDataAvailable ? (
                                <Line data={memorydata} />
                                
                            ) : (
                                <p>Загрузка данных...🏭</p>
                            )}
                        </Row>
                    </>
                ) : (
                    <p>Загрузка данных... 🏭</p>
                )}
            </Modal.Body>
        </>
    );
};

export default TelemetryControlContent;