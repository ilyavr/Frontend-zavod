import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faChevronRight,
    faChevronUp,
    faPencilAlt,
    faPlus,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import './task.css'
import Task from "./task";
import {Button} from "react-bootstrap";

function Category(props) {

    function getTaskByPos(x, y, catID, tasks) {
        let t;
        tasks.forEach((task) => {
            if (task.posX === x && task.posY === y && task.catID === catID) {
                t = task;
            }
        })
        return t;
    }

    function getMaxTaskPos(axis, catID, tasks){
        let axisMax = 0;
        tasks.forEach((task) => {
            if(task['pos'+axis.toUpperCase()] > axisMax && task.catID === catID)
                axisMax = task['pos'+axis.toUpperCase()]
        });
        return axisMax;
    }

    function taskRow(tasks, catID, j){
        let taskEls = [];
        let i;
        for(i = 0; i <= getMaxTaskPos('x', catID, tasks); i++){
           if(getTaskByPos(i, j, catID, tasks) !== undefined){
                taskEls.push(<Task key={"cat_"+catID+"_task_"+i+"_"+j} task={getTaskByPos(i, j, catID, tasks)} editMode={props.editMode}/>)
            }
        }
        if(props.editMode)
            taskEls.push(<Task key={"cat_"+catID+"_task_"+i+"_"+j} task={{type:"add"}} catID={catID} posX={i+1} posY={j} />)
        return(taskEls)
    }

    function showTasks(tasks, cat){
        let rows = [];
        let j;
        for(j = 0; j <= getMaxTaskPos('y', cat.catID, tasks); j++){
            rows.push(<div className={"row d-flex justify-content-start"} key={"cat"+cat.catID+"_posY"+j}> {taskRow(tasks, cat.catID, j)}</div>)
        }
        if(props.editMode)
            rows.push(<div className={"row d-flex justify-content-start"} key={"cat"+cat.catID+"_posY"+j+1}><Task key={"task_add_posY"+j+1} task={{type:"add"}} catID={cat.catID} posX={0} posY={j+1} /></div>)
        return (
            <>
                {rows}
            </>
        )
    }

    function editBtns(props){
        if(props.editMode){
            return(
                <>
                    <Button variant="default" className="btnIInfo"><FontAwesomeIcon icon={faChevronUp} key={"btnUPCat"+props.cat.catID}/></Button>
                    <Button variant="default" className="btnIInfo"><FontAwesomeIcon icon={faChevronDown} key={"btnDownCat"+props.cat.catID}/></Button>
                    <Button variant="default" className="btnIWarning"><FontAwesomeIcon icon={faPencilAlt} key={"btnEditCat"+props.cat.catID}/></Button>
                    <Button variant="default" className="btnISuccess"><FontAwesomeIcon icon={faPlus} key={"btnAddCat"+props.cat.catID} /></Button>
                    <Button variant="default" className="btnIDanger"><FontAwesomeIcon icon={faTimes} key={"btnDelCat"+props.cat.catID}/></Button>
                </>
            );
        }
    }

    return (
        <>
            <div className="tasks" key={"cat"+props.cat.catID} catpos={props.cat.position}>
                <h5 className="taskHeader d-flex justify-content-between">
                    <div>
                        {props.cat.name}
                        <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                    </div>
                    <div>
                        {editBtns(props)}
                    </div>
                </h5>
                {showTasks(props.tasks, props.cat)}
            </div>
        </>
    );
}

export default Category
