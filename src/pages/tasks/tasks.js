import React, {useState, useEffect } from 'react';
import {Container, Row, Alert, Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faIndustry, faCog, faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import 'font-awesome/css/font-awesome.min.css';
import './task.css'
import Category from "./category";
import {ApiUrl} from "../../App";

const Tasks = (props) => {
    const [tasks, setTasks] = useState([]);
    const [cats, setCats] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetch(`${ApiUrl}/tasks/get`, {method: "POST"})
            .then((response) => response.json())
            .then((data) => {
                setTasks(data);
            })
            .catch((err) => {
                console.log(err.message);
            });

        fetch(`${ApiUrl}/tasks/cats`, {method: "POST"})
            .then((response) => response.json())
            .then((data) => {
                setCats(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    function showData(){
        if(cats !== undefined && cats.length > 0){
            return(
                cats.map((cat) => {
                    return(
                        <Category key={"cat"+cat.catID} cat={cat} tasks={tasks} editMode={editMode}/>
                    )
                 })
            );
        }else{
            return (
                <Alert variant="danger" className={"text-center"} style={{marginTop:"30px"}}>
                    <Alert.Heading>Упс, кажется задачи сейчас недоступны :(</Alert.Heading>
                </Alert>
            );
        }
    }

    function editOn(){
        setEditMode(true)
    }

    function editOff(){
        setEditMode(false)
    }

    function modeBtn(){
        if(!editMode)
            return(
                <>
                    <Button className="btn-default btnAdmin" onClick={editOn} key={"btnMode"}>
                        <FontAwesomeIcon icon={faCog} size="lg"/>
                    </Button>
                </>
            );
    }

    function cancelBtn(){
        if(editMode)
            return(
                <>
                    <Button className="btn-default btnAdmin" onClick={editOff} key={"btnCancel"}>
                        <FontAwesomeIcon icon={faChevronLeft} size="lg"/>
                    </Button>
                </>
            );
    }



    return (
        <>
            <div className={"secondaryBg"}>
                <div className={"container secondaryNoSearch"}>
                    <h2 className={"text-center"}>
                        {cancelBtn()}
                        <FontAwesomeIcon icon={faIndustry} size="sm"/> Задачи и приложения
                        {modeBtn()}
                    </h2>
                </div>
            </div>
            <Container className={"wrapper pageMT10"}>
                <Row className={"col-md-12"}>
                    {showData()}
                </Row>
            </Container>
        </>
    );
}

export default Tasks
