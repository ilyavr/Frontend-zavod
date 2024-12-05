import Modal from "react-bootstrap/Modal";
import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {ApiUrl} from "../../../App";
import {toast} from "react-toastify";


const ServerControlContent = (props) => {

    const [client, setClient] = useState([]);

    useEffect(() => {
        if(props.client !== undefined)
            setClient(Object.assign({}, props.client))
    }, []);

    // const handleInputChange = (value, fld) => {
    //     setClient({ ...client, [fld]:  value});
    // };
    //
    // const SaveClient = () =>{
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
    //
    // const GetModelsList = () => {
    //     if(aiModels !== undefined) {
    //         return (
    //             <Form.Select  onChange={(e) => handleInputChange(Number(e.target.value),"modelId")}>
    //                 {aiModels.map(item => (
    //                     <option value={item.id} selected={client !== undefined && client.modelId === item.id}>{item.name}</option>
    //                 ))}
    //             </Form.Select>
    //         );
    //     }
    // }

    // const InstallSWClient = () => {
    //     console.log(client)
    //     toast.success(`Запущен процесс установки клиента.. \nЭто может занять несколько минут`)
    //     axios.post(`${ApiUrl}/ai/client/install?id=${client.id}&login=${client.login}&password=${client.password}`)
    //         .then(response => {
    //             toast.success(`Клиент установлен`)
    //         })
    //         .catch(error => {
    //             toast.error(`Ошибка установки клиента ${error}`)
    //             console.error(error);
    //         });
    // }
    //
    // const UpdateSWClient = () => {
    //     toast.warning('Пока что не реализовано...')
    // }
    //
    // const GetInstallUpgradeBtn = () => {
    //     if(client !== undefined && client.id !== undefined) {
    //         if (client.installed) //Добавить доп проверку на дату установки
    //             return (
    //                 <>
    //                 <Form.Group className="mb-3" >
    //                     <Form.Label>SSH логин</Form.Label>
    //                     <Form.Control type="text" placeholder="root" value={client.login} onChange={(e) => handleInputChange(e.target.value,"login")} />
    //                 </Form.Group>
    //                 <Form.Group className="mb-3" >
    //                     <Form.Label>SSH пароль</Form.Label>
    //                     <Form.Control type="password" placeholder="***" value={client.password} onChange={(e) => handleInputChange(e.target.value,"password")} />
    //                 </Form.Group>
    //                 <Button variant="warning" onClick={UpdateSWClient}>
    //                     Обновить ПО
    //                 </Button>
    //                 </>
    //             )
    //         else
    //             return (
    //                 <>
    //                     <Form.Group className="mb-3" >
    //                         <Form.Label>SSH логин</Form.Label>
    //                         <Form.Control type="text" placeholder="root" value={client.login} onChange={(e) => handleInputChange(e.target.value,"login")} />
    //                     </Form.Group>
    //                     <Form.Group className="mb-3" >
    //                         <Form.Label>SSH пароль</Form.Label>
    //                         <Form.Control type="password" placeholder="***" value={client.password} onChange={(e) => handleInputChange(e.target.value,"password")} />
    //                     </Form.Group>
    //                     <Button variant="warning" onClick={InstallSWClient}>
    //                         Установить ПО
    //                     </Button>
    //                 </>
    //             )
    //     }
    // }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{props.header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" >
                        <Form.Label>IP адрес</Form.Label>
                        <Form.Control type="text" value="172.16.2.145" />
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label><b>База данных</b></Form.Label><br/>
                        <Form.Label>Хост</Form.Label>
                        <Form.Control type="text" value="172.16.0.39:3306"/>
                        <Form.Label>Логин</Form.Label>
                        <Form.Control type="text" value="root"/>
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="password" value="root"/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label><b>Брокер сообщений Redis</b></Form.Label><br/>
                        <Form.Label>Хост</Form.Label>
                        <Form.Control type="text" value="172.16.0.39:6379"/>
                        <Form.Label>Логин</Form.Label>
                        <Form.Control type="text" value="root"/>
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="password" value="root"/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label><b>Хранилище Minio</b></Form.Label><br/>
                        <Form.Label>Хост</Form.Label>
                        <Form.Control type="text" value="172.16.0.39:9000"/>
                    </Form.Group>

                    <Button variant="success" >
                        Сохранить
                    </Button>

                    <Button variant="warning" >
                        Установить ПО
                    </Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default ServerControlContent;
