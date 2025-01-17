import Modal from "react-bootstrap/Modal";
import { Button, Table, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useState, useEffect,useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark, faRotateBack, faTrash, faImage } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { ApiUrl } from "../../../App";
import '../ai.css';

const ClassesContent = (props) => {
    const [classes, setClasses] = useState([]);
    const [showAddClassModal, setShowAddClassModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modelId, setModelId] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [dsExamples, setExamples] = useState([]);
    const [newClass, setNewClass] = useState({
        class: "",
        modelId: props.modelId,
        deleted: false,
    });
    const classInputRef = useRef(null);
    useEffect(() => {
        if (showAddClassModal) {
            classInputRef.current?.focus();
        }
    }, [showAddClassModal]);
    useEffect(() => {
        if (props.modelId !== null) {
            axios.get(`${ApiUrl}/ai/classes/getClasses?modelId=${modelId}`)
                .then(response => setClasses(response.data))
                .catch(error => console.error("Ошибка при загрузке классов:", error));
        }
    }, [props.modelId]); 


    useEffect(() => {
        console.log('Classes updated:', props.classes); // Лог для отладки
    }, [props.classes]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showDeleteModal && e.key === "Enter") {
                e.preventDefault();
                handleDeleteClass();
            }
        };
    
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showDeleteModal]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type !== "image/jpeg") {
                alert("Пожалуйста, загрузите изображение в формате JPEG.");
                return;
            }
    
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = reader.result.split(",")[1];
                const newExample = {
                    classId: modelId, 
                    data: `data:image/jpeg;base64,${base64Data}`,
                };
    
                fetch(`${ApiUrl}/ai/dataset/addExample`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newExample),
                })
                    .then((response) => {
                        if (response.ok) {
                            alert("Эталон добавлен!");
                            loadClassImage(modelId);
                            setShowImageModal(false);
                        } else {
                            alert("Ошибка при добавлении эталона.");
                        }
                    })
                    .catch((err) => console.error("Ошибка:", err));
            };
            reader.readAsDataURL(file);
        }
    };
    // Функция для загрузки изображения для выбранного класса
    const loadClassImage = (classId) => {
        console.log("Загружаем изображение для класса с ID:", classId);
    
        setIsLoading(true);  
    
        setModelId(classId); 
    
        const requestUrl = `${ApiUrl}/ai/dataset/getExamples?modelId=${classId}`;
        console.log("Запрос на получение изображения:", requestUrl);
    
        fetch(requestUrl, { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                console.log("Ответ от сервера:", data); 
    
                const example = data.find(item => item.classId === classId);
                console.log("Полученный пример для класса с ID:", classId, example);
    
                if (example && example.data) {
                    const imagePrefix = example.data.startsWith("data:image/") ? "" : "data:image/jpeg;base64,";
                    setImageSrc(`${imagePrefix}${example.data}`);
                } else {
                    console.error("Не удалось загрузить изображение для примера:", example);
                    setImageSrc(null);
                }
            })
            .catch((err) => {
                console.error("Ошибка при получении примеров:", err);
                setImageSrc(null);
            })
            .finally(() => {
                setIsLoading(false); 
            });
    
        setShowImageModal(true); 
    };
    const loadClasses = () => {
        axios.get(`${ApiUrl}/ai/classes/getClasses?modelId=${props.modelId}`)
            .then((response) => {
                props.setClasses(response.data); 
            })
            .catch((error) => console.error("Ошибка при загрузке классов:", error))
    };
    const handleAddClass = () => {
        axios.post(`${ApiUrl}/ai/classes/createClass`, newClass)
            .then(response => {
                props.setClasses(prevClasses => [...prevClasses, response.data]);
                setShowAddClassModal(false);
                setNewClass({ class: "", modelId: props.modelId, deleted: false });
                loadClasses()
            })
            .catch(error => console.error("Error adding class:", error));
    };

    const handleToggleClassStatus = (classId, deleted) => {
        axios.put(`${ApiUrl}/ai/classes/toggleStatus`, { id: classId, deleted: !deleted })
            .then(response => {
                props.setClasses(props.classes.map(cls =>
                    cls.id === classId ? { ...cls, deleted: !deleted } : cls
                ));
            })
            .catch(error => console.error("Ошибка при обновлении статуса класса:", error));
    };

    const handleDeleteClass = () => {
        props.setClasses(props.classes.filter(cls => cls.id !== classToDelete));
        axios.delete(`${ApiUrl}/ai/classes/delete/${classToDelete}`)
            .then(response => {
                setShowDeleteModal(false);
                setClassToDelete(null);
            })
            .catch(error => {
                console.error("Error deleting class:", error.response ? error.response.data : error.message);
            });
    };

    return (
        <>
            <Modal show={showAddClassModal} onHide={() => setShowAddClassModal(false)} onKeyDown={(e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddClass();
        }
    }}>
<Modal.Header closeButton>
                    <Modal.Title>Добавить класс</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formClassName">
                            <Form.Label>Название класса</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите название класса"
                                value={newClass.class}
                                ref={classInputRef} 
                                onChange={(e) => setNewClass({ ...newClass, class: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleAddClass}>Добавить класс</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Подтвердите удаление</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы точно хотите удалить этот класс?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Отмена</Button>
                    <Button variant="danger" onClick={handleDeleteClass} 
                    onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleDeleteClass();
                    }
    }}>Удалить</Button>
                </Modal.Footer>
            </Modal>

            <Modal
    show={showImageModal && !isLoading}  
    onHide={() => setShowImageModal(false)}
    key={imageSrc}  
>
    <Modal.Header closeButton>
        <Modal.Title>Просмотр</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    {isLoading ? (
        <div>Загрузка...</div>  
    ) : imageSrc ? (
        <img src={imageSrc} alt="Эталон" className="img-fluid" />
    ) : (
        <>
            <p>Изображение не найдено</p>
            <label className="custom-file-upload">
                Добавить эталон
                <input type="file" accept="image/jpeg" onChange={handleFileUpload} />
            </label>
        </>
    )}
</Modal.Body>
</Modal>

            <div>
                <Button 
                    variant="primary" 
                    onClick={() => setShowAddClassModal(true)} 
                    className="mb-3"
                >
                    <FontAwesomeIcon icon={faPlus} /> Добавить класс
                </Button>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Название класса</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.classes.length > 0 ? (
                            props.classes.map((cls) => (
                                <tr key={cls.id}>
                                    <td>{cls.id}</td>
                                    <td className={cls.deleted ? "hidden-class" : ""}>{cls.class}</td>
                                    <td className="actions-column">
                                        <div className="actions-container">
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>{!cls.deleted ? "Скрыть" : "Вернуть"}</Tooltip>}
                                        >
                                            <FontAwesomeIcon
                                                icon={!cls.deleted ? faXmark : faRotateBack}
                                                className="icon-toggle"
                                                onClick={() => handleToggleClassStatus(cls.id, cls.deleted)}
                                            />
                                        </OverlayTrigger>
                                            <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>Показать</Tooltip>}
                                        >
                                            <FontAwesomeIcon
                                                icon={faImage}
                                                className="icon-image"
                                                onClick={() => loadClassImage(cls.id)}  
                                            />
                                        </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Удалить</Tooltip>}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className={`icon-trash ${!cls.deleted ? "disabled" : ""}`}
                                                    onClick={() => {
                                                        if (cls.deleted) {
                                                            setClassToDelete(cls.id);
                                                            setShowDeleteModal(true);
                                                        }
                                                    }}
                                                />
                                            </OverlayTrigger>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Классы не найдены</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default ClassesContent;