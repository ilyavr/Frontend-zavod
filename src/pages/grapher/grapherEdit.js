import Modal from "react-bootstrap/Modal";
import {Button, Col, FloatingLabel, Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink, faPlus} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";

const GrapherEdit = (props) => {


    const [pName, setPName] = useState("");
    const [pTaskName, setPTaskName] = useState("");
    const [pDBHost, setPDBHost] = useState("");
    const [pDBMS, setPDBMS] = useState("");
    const [pDB, setPDB] = useState("");
    const [pDBUser, setPDBUser] = useState("");
    const [pDBPass, setPDBPass] = useState("");
    const [pDBTable, setPDBTable] = useState("");
    const [pTimeField, setPTimeField] = useState("");
    const [pFields, setPFields] = useState("");
    const [pField, setPField] = useState("");
    const [pFieldTitle, setPFieldTitle] = useState("");
    const [pFieldColor, setPFieldColor] = useState("#ffffff");

    const [db, setDb] = useState([]);
    const [tables, setTables] = useState([]);
    const [fields, setFields] = useState([]);

    const [profile, setProfile] = useState([]);
    function getProfile(id){
        props.profiles.forEach(p => {
            if(p.profileId === id){
                setProfile(p)
            }
        })
    }

    function getDatabase(id){
        fetch('http://localhost:8004/grapher/getDatabase?dbId='+id, {method: "POST"})
            .then((response) => response.json())
            .then((data) => {
                setDb(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    useEffect(() => {
        if(props.editMode)
            getProfile(props.chartId)
    }, [props.show])

    function getTables(usr=pDBUser, pwd=pDBPass, host=pDBHost, db=pDB){
        fetch('http://localhost:8004/grapher/getTables?dbType=ibase&usr='+usr+'&pwd='+pwd+'&host='+host+'&dbName='+db, {method: "POST"})
            .then((response) => response.json())
            .then((data) => {
                setTables(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    function getFields(){
        fetch('http://localhost:8004/grapher/getAllFields?dbType=ibase&usr='+pDBUser+'&pwd='+pDBPass+'&host='+pDBHost+'&dbName='+pDB+'&table='+pDBTable, {method: "POST"})
            .then((response) => response.json())
            .then((data) => {
                setFields(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    useEffect(() => {
        if(profile.dbId !== undefined)
            getDatabase(profile.dbId)
    }, [profile])

    useEffect(()=>{
        if(db !== undefined && db.dbId > 0) {
            setPName(profile.title)
            setPTaskName(profile.task)
            setPDBHost(db.host)
            setPDB(db.dbName)
            setPDBUser(db.usr)
            setPDBPass(db.pwd)
            setPTimeField(profile.timeField)
            setPDBTable(profile.table)
            getTables(db.usr, db.pwd, db.host, db.dbName)
        }
    }, [db])



    function modalContent(){

        return(
            <>
                <Modal.Header closeButton>
                    <Modal.Title>{props.editMode ? "Редактирование":"Добавление"} профиля</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingInputN" label="Имя профиля" className="mb-3">
                        <Form.Control type="text" value={pName} onChange={(e) => setPName(e.target.value)}/>
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInputT" label="Название задачи" className="mb-3">
                        <Form.Control type="text" value={pTaskName} onChange={(e) => setPTaskName(e.target.value)}/>
                    </FloatingLabel>
                    <Col className={"d-flex"} >
                        <FloatingLabel controlId="floatingInputH" label="Хост" className={"col-md-9"}>
                            <Form.Control type="text" value={pDBHost} onChange={(e) => setPDBHost(e.target.value)} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInputDBMS" label="СУБД" className={"col-md-3"}>
                            <Form.Select value={pDBMS} onChange={(e) => setPDBMS(e.target.value)}>
                                <option>FireBird</option>
                                <option>Oracle</option>
                                <option>MySQL</option>
                                <option>Postgres</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <FloatingLabel controlId="floatingInputDB" label="Название БД" className="mb-3">
                        <Form.Control type="text"  value={pDB} onChange={(e) => setPDB(e.target.value)} />
                    </FloatingLabel>
                    <Col className={"d-flex"} >
                        <FloatingLabel controlId="floatingInputUsr" label="Пользователь БД" className={"col-md-6"}>
                            <Form.Control type="text"  value={pDBUser} onChange={(e) => setPDBUser(e.target.value)}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInputPwd" label="Пароль">
                            <Form.Control type={"password"} className={"addonInputRight"} value={pDBPass} onChange={(e) => setPDBPass(e.target.value)}/>
                        </FloatingLabel>
                        <Button variant={"warning"} className={"btnSizeFix btnAddonRight"} onClick={() => getTables()}>
                            <FontAwesomeIcon icon={faLink} />
                        </Button>
                    </Col>
                    <Col className={"d-flex"} >
                        <FloatingLabel controlId="floatingInputTbl" label="Таблица" className={"col"}>
                            <Form.Select type="text" className={"addonInputRight"} value={pDBTable} onChange={(e) => setPDBTable(e.target.value)}>
                                {tables.map((table) => {
                                    console.log(pDBTable);
                                    return(
                                        <option value={table}>{table}</option>
                                    )
                                })}
                            </Form.Select>
                        </FloatingLabel>
                        <Button variant={"warning"} className={"btnSizeFix btnAddonRight"} onClick={() => getFields()}>
                            <FontAwesomeIcon icon={faLink} />
                        </Button>
                    </Col>
                    <FloatingLabel controlId="floatingInputTime" label="Канал времени" className={"col"}>
                        <Form.Select type="text" className={"addonInputRight"}  value={pTimeField} onChange={(e) => setPTimeField(e.target.value)}>
                            {fields.map((field) => {
                                return(
                                    <option value={field}>{field}</option>
                                )
                            })}
                        </Form.Select>
                    </FloatingLabel>
                    <h5>Каналы</h5>
                    <Col className={"d-flex"} >
                        <FloatingLabel controlId="floatingInputField" label="Канал" className={"col"}>
                            <Form.Select type="text" className={"addonInputRight"}  value={pField} onChange={(e) => setPField(e.target.value)}>
                                {fields.map((field) => {
                                    return(
                                        <option value={field}>{field}</option>
                                    )
                                })}
                            </Form.Select>
                        </FloatingLabel>
                        <Button variant={"success"} className={"btnSizeFix btnAddonRight"}>
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                    </Col>
                    <FloatingLabel controlId="floatingInputComment" label="Комментарий к каналу">
                        <Form.Control type={"text"} value={pFieldTitle} onChange={(e) => setPFieldTitle(e.target.value)}/>
                    </FloatingLabel>
                    <div className={"d-flex"} style={{verticalAlign: "middle"}}>
                        Цвет канала <Form.Control type={"color"} className={"formColor"} value={pFieldColor} onChange={(e) => setPFieldColor(e.target.value)}/>
                    </div>
                    <Form.Control as="textarea" />
                </Modal.Body>
            </>
        )
    }

    return(
        <Modal show={props.show} onHide={() => props.setShowF(false)}>
            {modalContent()}
        </Modal>
    )
}

export default GrapherEdit;