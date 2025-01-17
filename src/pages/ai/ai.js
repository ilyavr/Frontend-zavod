import React, {useEffect, useState} from 'react';
import {
    Button,
    Col,
    Container,
    Row,
} from "react-bootstrap";
import {Outlet, useNavigate} from "react-router-dom";
import "./ai.css"
import {GetClients} from "./aiUtils";
import Modal from "react-bootstrap/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import ClientControlContent from "./client/clientControl";
import ModelControlContent from "./client/modelControl";
import ServerControlContent from "./client/serverControl";

const AI = (props) => {

    const navigate = useNavigate();
    const [clients, setClients] = useState([])
    const [modalContent, setModalContent] = useState([])
    const [showClients, setShowClients] = useState(false);
    const [showServer, setShowServer] = useState(false);
    const [showModels, setShowModels] = useState(false);

    useEffect(() => {
        GetClients(setClients);
    }, []);

    function handleNavigation(client){
        GetClients(setClients);
        navigate("/ai/"+client+"/stats", {state: {clients: clients}});
    }

    return (
        <>
            <div className={"secondaryBg"}>
                <div className={"container secondaryNoSearch"}>
                    <h2 className={"text-center"}>METIDA AI</h2>
                    {/* <div className="garland">
                    {Array.from({ length: 20 }).map((_, index) => (
                        <div className="light-container" key={index}>
                            <div className="stick"></div>
                            <div className={`light light-${index % 5}`}></div>
                        </div>
                    ))}
                </div> */}
                </div>

            </div>

                <Container style={{minWidth:"80vw"}}>
                    <Row>
                        <Col md={2}>
                            <Button className={"btn btn-secondary btn-sm"} onClick={() => {
                                modalContent.header = "Добавить клиент";
                                modalContent.client = []
                                setModalContent(modalContent);
                                setShowClients(true);
                            }}>+</Button>
                            <Button className={"btn btn-secondary btn-sm"} onClick={() => {
                                modalContent.header = "Сервер";
                                modalContent.client = []
                                setModalContent(modalContent);
                                setShowServer(true);
                                }}>Сервер</Button>
                            <Button className={"btn btn-secondary btn-sm"} onClick={() => {
                                modalContent.header = "Модели";
                                modalContent.client = []
                                setModalContent(modalContent);
                                setShowModels(true);
                            }}>Модели</Button><br/><br/>
                            {clients.map(client => {
                                return (
                                    <>
                                        <Button className={"btn btn-default"}
                                                onClick={() => handleNavigation(client.name)}>{client.localizedName}</Button>
                                        <Button className={"btn btn-default btn-sm"}
                                                onClick={() => {
                                                    modalContent.header = "Редактировать клиент";
                                                    modalContent.client = client;
                                                    setModalContent(modalContent);
                                                    setShowClients(true);
                                                }}><FontAwesomeIcon icon={faPencil}/></Button> <br/>
                                    </>
                                )
                            })}
                        </Col>
                        <Col md={9}>
                            <Outlet />
                        </Col>
                    </Row>
                </Container>
                <Modal show={showClients} onHide={() => setShowClients(false)} size={"xs"}>
                    <ClientControlContent header={modalContent.header} client={modalContent.client} setClients={setClients} clients={clients} setShow={setShowClients}/>
                </Modal>
                <Modal show={showModels} onHide={() => setShowModels(false)} size={"xs"}>
                    <ModelControlContent header={modalContent.header} client={modalContent.client} setShow={setShowModels}/>
                </Modal>
                <Modal show={showServer} onHide={() => setShowServer(false)} size={"xs"}>
                    <ServerControlContent header={modalContent.header} client={modalContent.client} setClients={setClients} clients={clients} setShow={setShowServer}/>
                </Modal>
        </>
    );
}

export default AI
