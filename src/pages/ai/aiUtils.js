import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import React from "react";
import {ApiUrl} from "../../App";

function ExampleImage(props){
    let exImg;

    //console.log(props.dsExample, props.cls)
    if(props.dsExample !== null && props.cls !== undefined) {
        props.dsExample.forEach((exampleEl) => {
            if (Number(exampleEl.classId) === Number(props.cls.id))
                exImg = exampleEl.data;
        })
        return (
            <OverlayTrigger
                key={"dsExampleImg"}
                placement={"auto"}
                shouldFlip
                overlay={
                    <Tooltip className={"customOverlay"} id={"dsExampleImg"} style={{width: "640px"}}>
                        <img src={exImg} className={"statsImg"} alt={props.cls.class}/>
                    </Tooltip>
                }
            >
                <Button variant={"default"}>
                    {props.cls.class}
                </Button>
            </OverlayTrigger>
        )
    }
}

function ClassesToArr(classes){
    let arr = []
    if(classes !== undefined && classes !== null)
        classes.map(clazz => {
            arr[clazz.id] = clazz;
        });
    arr[0]= "Не задан";
    return arr;
}

function GetClassById(classes, id){
    let cls = undefined;
    if(classes !== undefined && classes !== null)
        classes.forEach(clazz => {
            if(clazz.id === Number(id)) {
                cls = clazz
            }
        });
    return cls;
}

function GetClassByName(classes, name){
    let cls = undefined;
    if(classes !== undefined && classes !== null)
        classes.forEach(clazz => {
            if(clazz.class === String(name)) {
                cls = clazz
            }
        });
    return cls;
}

function GetClassId(classes, name){
    let id = -1;
    if(classes !== undefined && classes !== null)
        classes.forEach(clazz => {
            if(clazz.class.toUpperCase() === String(name).toUpperCase())
                id = clazz.id;
        });
    return id;
}

function GetClientId(clients, name){
    let id = -1;
    if(clients !== undefined)
        clients.forEach(client => {
           if(client.name.toUpperCase() === name.toUpperCase())
               id = client.id;
        });
    return id;
}

function GetModelId(models, name){
    let id = -1;
    if(models !== undefined)
        models.forEach(model => {
            if(model.name.toUpperCase() === name.toUpperCase())
                id = model.modelId;
        });
    return id;
}

function GetClients(setClients){
    fetch(`${ApiUrl}/ai/clients`, {method: "GET"})
        .then((response) => response.json())
        .then((data) => {
            setClients(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

let lastLoadedImg;
let tryCounter = 0

function LoadImg(img, setImg, client){
    if(lastLoadedImg !== img && tryCounter < 2) {
        fetch(`${ApiUrl}/ai/getImage?img=` + img + "&client=" + client, {method: "GET"})
            .then((response) => response.json())
            .then((data) => {
                setImg(data);
                lastLoadedImg = img
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
}

function GetClassesCount(classes, modelId) {
    let count = 0;
    if (classes !== undefined && classes !== null) {
        for (let i = classes.length - 1; i >= 0; i--) {
            if (!classes[i].deleted && classes[i].id !== 0 && classes[i].modelId === modelId) {
                count++;
            }
        }
    }
    return count;
}

export {ExampleImage, GetClientId, GetModelId, GetClients, LoadImg, GetClassId, GetClassById, ClassesToArr, GetClassesCount, GetClassByName};