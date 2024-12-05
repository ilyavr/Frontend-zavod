import React, {useEffect, useState} from 'react';
import GrapherViewer from "./graphViewer";
import {
    Button,
    Col,
    Dropdown,
    FloatingLabel,
    Form,
    Row
} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChartLine, faLink, faPencil, faPlus
} from "@fortawesome/free-solid-svg-icons";
import GrapherEdit from "./grapherEdit";

const Grapher = () => {

    const [profiles, setProfiles] = useState([]);
    const [tasks, setTasks] = useState([])
    const [taskActive, setTaskActive] = useState("gTaskColdLab");
    const [chartActive, setChartActive] = useState(9);

    const [show, setShow] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8004/grapher/getProfiles', {method: "POST"})
            .then((response) => response.json())
            .then((data) => {
                setProfiles(data);
                let tasks = []
                data.forEach(profile => {
                    if(!tasks.includes(profile.task))
                        tasks.push(profile.task);
                })
                setTasks(tasks);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    useEffect(()=>{
        let isSetActive = false;
        profiles.forEach(profile =>{
            if(profile.task === taskActive && !isSetActive) {
                isSetActive = true;
                setChartActive(profile.profileId);
            }
        })
    }, [taskActive])

    function profilesDD(){
        return(
            <Dropdown>
                <Dropdown.Toggle className={"ddBtn ddBtnDefault"} variant="default" id="dropdown-basic">
                    <FontAwesomeIcon icon={faChartLine} size={"xl"}/>
                </Dropdown.Toggle>

                <Dropdown.Menu className={"ddMenu"}>
                    <h5>График</h5>
                    <Form.Select value={taskActive} onChange={(e) => {setTaskActive(e.target.value)}}>
                        {tasks.map(name =>{
                            return(
                                <option value={name}>{name}</option>
                            )
                        })}
                    </Form.Select>
                    {chartSelect()}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    function chartSelect(){
        return(
            <Form.Select value={chartActive} onChange={(e) => setChartActive(e.target.value)}>
                {profiles.map(profile =>{
                    if(profile.task === taskActive)
                        return(
                            <option value={profile.profileId}>{profile.title}</option>
                        )
                })}
            </Form.Select>
        )
    }



    return (
        <>
            <Row style={{margin: 0}}>
            <Col className={"d-flex justify-content-end"} style={{marginRight: 0, marginTop: "5px", marginBottom: "5px"}}>
                <Button variant={"default"} onClick={() => {setShow(true); setModalEdit(false)}}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
                {profilesDD()}
                <Button variant={"default"} onClick={() => {setShow(true); setModalEdit(true)}}>
                    <FontAwesomeIcon icon={faPencil} />
                </Button>
            </Col>
            <GrapherViewer chartId={chartActive} bgColor={"white"}/>
            </Row>
            <GrapherEdit chartId={chartActive} editMode={modalEdit} show={show} setShowF={setShow} profiles={profiles}/>
        </>
    );
}

export default Grapher
