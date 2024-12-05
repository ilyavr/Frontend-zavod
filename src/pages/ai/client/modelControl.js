import Modal from "react-bootstrap/Modal";
import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {ApiUrl} from "../../../App";
import {toast} from "react-toastify";


const ModelControlContent = (props) => {

    const [aiModels, setAIModels] = useState([]);
    const [currentModel, setCurModel] = useState();
    const [modelName, setModelName] = useState("");

    useEffect(() => {
        axios.get(`${ApiUrl}/ai/models/get`)
            .catch(error => {
                console.error(error);
            })
            .then(response =>{
                setAIModels(response.data)
            });
    }, []);

    // const handleInputChange = (value, fld) => {
    //     setAIModels({ ...aiModels, [fld]:  value});
    // };
    //
    // const SaveModel = () =>{
    //     if(client.id !== undefined)
    //         axios.put(`${ApiUrl}/ai/client/update`, client)
    //             .catch(error => {
    //                 toast.error(`Ошибка сохранения клиента ${error}`)
    //                 console.error(error);
    //             });
    //     else
    //         axios.put(`${ApiUrl}/ai/client/add`, client)
    //             .catch(error => {
    //                 toast.error(`Ошибка сохранения клиента ${error}`)
    //                 console.error(error);
    //             });
    //
    //     const updatedClients = [...props.clients]; // Создаем копию массива props.clients
    //     const clientIndex = updatedClients.findIndex(item => item.id === props.client.id); // Находим индекс текущего props.client в массиве
    //     if (clientIndex !== -1) {
    //         updatedClients[clientIndex] = client; // Заменяем текущий props.client на новое значение client
    //     }else{
    //         updatedClients[updatedClients.length] = client
    //     }
    //     props.setClients(updatedClients); // Обновляем props.clients с обновленным массивом
    //     toast.success(`Клиент сохранен!`)
    // }
    // onChange={(e) => handleInputChange(Number(e.target.value),"modelId")}>


    const onSelectModel = (e) =>{
        aiModels.forEach(model => {
            if(model.id === Number(e.target.value)){
                setCurModel(model)
                setModelName(model.name)
            }
        })
    }


    const GetModelsList = () => {
        if(aiModels !== undefined) {
            return (
                 <Form.Select onChange={e => onSelectModel(e)}>
                    {aiModels.map(item => (
                        <option value={item.id}>{item.name}</option>
                    ))}
                </Form.Select>
            );
        }
    }

    const GetModelsListParent = () => {
        if(aiModels !== undefined) {
            return (
                <Form.Select>
                    {aiModels.map(item => (
                        <option value={item.id} selected={currentModel !== undefined && currentModel.parentId === item.id}>{item.name}</option>
                    ))}
                </Form.Select>
            );
        }
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{props.header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" >
                        <Form.Label>AI Модель </Form.Label> <Button className={"btn btn-secondary btn-sm"}>+</Button>
                        {GetModelsList()}
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Название</Form.Label>
                        <Form.Control type="text" placeholder="A100 YOLOv4" value={modelName} onChange={e => setModelName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Родительская AI Модель</Form.Label>
                        {GetModelsListParent()}
                    </Form.Group>
                    <Button className={"btn btn-danger"}>Удалить</Button>
                    <Button variant="success">
                        Сохранить
                    </Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default ModelControlContent;
