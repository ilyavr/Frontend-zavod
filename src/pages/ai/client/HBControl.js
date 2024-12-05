import Modal from "react-bootstrap/Modal";
import React, {useEffect, useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import {ApiUrl} from "../../../App";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faPlay, faRotate, faStop} from "@fortawesome/free-solid-svg-icons";


const HBContent = (props) => {
    const [client, setClient] = useState([]);
    const [appStates, setAppStates] = useState({
        "Detector": true,
        "Telemetry": true,
        "SQLCache": true,
        "DataCache": true,
        "Conductor": true,
    });
    const [telemetryTimestamp, setTelemetryTimestamp] = useState(null);
    const [sqlCacheTimestamp, setSqlCacheTimestamp] = useState(null);

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

    useEffect(() => {
        if (props.client !== undefined) setClient(Object.assign({}, props.client));
    }, []);

    useEffect(() => {
        axios
            .get(`${ApiUrl}/ai/lastdata/lastdata`)
            .then((response) => {
                const responseData = response.data;

                const telemetryData = JSON.parse(responseData.telemetry.data);
                setTelemetryTimestamp(telemetryData.timestamp);
                setSqlCacheTimestamp(responseData.timestamp);
            })
            .catch((error) => {
                console.error("Ошибка получения данных: ", error);
            });
    }, []);

    const start = (appName, clientId) => {
        setTimeout(
            () =>
                axios
                    .put(`${ApiUrl}/ai/client/runCmd?id=${clientId}&service=${appName}`)
                    .then(() => {
                        setAppStates({ ...appStates, [appName]: true });
                        toast.success("Приложение ${appName} запущено!");
                    })
                    .catch((error) => {
                        console.error(error);
                        toast.error("Не удалось запустить приложение ${appName}!");
                    }),
            1000
        );
    };

    const stop = (appName, clientId) => {
        setTimeout(
            () =>
                axios
                    .put(`${ApiUrl}/ai/client/stopCmd?id=${clientId}&service=${appName}`)
                    .then(() => {
                        setAppStates({ ...appStates, [appName]: false });
                        toast.success("Приложение ${appName} остановлено!");
                    })
                    .catch((error) => {
                        console.error(error);
                        toast.error("Не удалось остановить приложение ${appName}!");
                    }),
            1000
        );
    };

    const restart = (appName, clientId) => {
        setTimeout(
            () =>
                axios
                    .put(`${ApiUrl}/ai/client/restartCmd?id=${clientId}&service=${appName}`)
                    .then(() => {
                        setAppStates({ ...appStates, [appName]: true });
                        toast.success("Приложение ${appName} перезапущено!");
                    })
                    .catch((error) => {
                        console.error(error);
                        toast.error("Не удалось перезапустить приложение ${appName}!");
                    }),
            1000
        );
    };

    const AppControl = ({ appName, appState, clientId, start, stop, restart, timestamp }) => {
        return (
            <Row className="aiBlock">
                <Col>
                    <h4>
                        <FontAwesomeIcon
                            icon={faCircle}
                            style={appState ? { color: "green" } : { color: "red" }}
                        />{" "}
                        {appName}
</h4>
                    {timestamp && (
                        <div>Последние данные: {formatTimestamp(timestamp)}</div>
                    )}
                </Col>
                <Col>
                    <Button
                        variant="default"
                        className="btnISuccess btn-lg"
                        onClick={() => start(appName, clientId)}
                    >
                        <FontAwesomeIcon icon={faPlay} />
                    </Button>
                    <Button
                        variant="default"
                        className="btnISuccess btn-lg"
                        onClick={() => stop(appName, clientId)}
                    >
                        <FontAwesomeIcon icon={faStop} />
                    </Button>
                    <Button
                        variant="default"
                        className="btnISuccess btn-lg"
                        onClick={() => restart(appName, clientId)}
                    >
                        <FontAwesomeIcon icon={faRotate} />
                    </Button>
                </Col>
            </Row>
        );
    };

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Управление клиентом</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AppControl
                    appName="Detector"
                    appState={appStates.Detector}
                    clientId={props.client}
                    start={start}
                    stop={stop}
                    restart={restart}
                />
                <AppControl
                    appName="Telemetry"
                    appState={appStates.Telemetry}
                    clientId={props.client}
                    start={start}
                    stop={stop}
                    restart={restart}
                    timestamp={telemetryTimestamp}
                />
                <AppControl
                    appName="SQLCache"
                    appState={appStates.SQLCache}
                    clientId={props.client}
                    start={start}
                    stop={stop}
                    restart={restart}
                    timestamp={sqlCacheTimestamp}
                />
                <AppControl
                    appName="DataCache"
                    appState={appStates.SQLCache}
                    clientId={props.client}
                    start={start}
                    stop={stop}
                    restart={restart}
                />
                <AppControl
                    appName="Conductor"
                    appState={appStates.SQLCache}
                    clientId={props.client}
                    start={start}
                    stop={stop}
                    restart={restart}
                />
            </Modal.Body>
        </>
    );
};

export default HBContent;
