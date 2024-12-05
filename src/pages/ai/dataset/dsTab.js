import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Pagination, Row, Table} from "react-bootstrap";
import DsElement from "./dsElement";
import DsEditor from "./dsEditor";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faFloppyDisk, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import Form from 'react-bootstrap/Form';
import {ClassesToArr, ExampleImage, GetClassById, LoadImg} from "../aiUtils";
import {useParams} from "react-router-dom";
import axios from "axios";
import {ApiUrl} from "../../../App";



function DsTab(props){

    const [page, setPage] = useState(0);
    const [b64image, setImg] = useState("");
    const [rect, setRect] = useState([{
        x: 0, y: 0,
        width: 0, height: 0,
        id: 'bbox1',
        fill: 'rgba(0,255,0,0.3)',
        stroke: "green",
        strokeWidth: 4,
    }]);
    const [active, setActive] = useState(null);
    const [className, setClassName] = useState(0);
    const {client} = useParams();

    const [currentCls, setCurrentCls] = useState(0);
    const editorContainer = useRef();
    const [visiblePage, setVisiblePage] = useState(0); // Состояние для индекса первой видимой страницы

    useEffect(() => {
        setPage(0)
        setVisiblePage(0)
    }, [props.selectedClass])

    function getDS(status, dataset){
        let color, counter = 0;
        let clssArr = ClassesToArr(props.classes)
        return(
            dataset.map((dsEl)=>{
                if (status.includes(dsEl.status) && (props.selectedClass === 0 || String(props.selectedClass) === String(dsEl.classId)) && (clssArr[dsEl.classId] !== undefined && !clssArr[dsEl.classId].deleted)) {
                    if (counter >= (500 * page) && counter < (500 * (page+1))) {
                        switch (dsEl.status) {
                            case 0:
                                color = "white"//"#313d64"
                                break;
                            case 1:
                                color = "#F5BE17"
                                break;
                            case 2:
                                color = "orange"
                                break;
                            default:
                                color = "white";
                                break;
                        }
                        counter++
                        let selected = false;
                        if(active === dsEl){
                            selected = true;
                            dsEl.class = className;
                        }
                        return (
                            <>
                                <DsElement selected={selected} dsEl={dsEl} color={color} selectFunc={select} classes={props.classes}/>
                            </>
                        )
                    }
                    counter++
                }
            })
        );
    }

    function getPageDSBtns(status, active, dataset) {
        let statusSize = 0;
        let clssArr = ClassesToArr(props.classes);
        dataset.forEach((dsEl) => {
            if (status.includes(dsEl.status) && (props.selectedClass === 0 || String(props.selectedClass) === String(dsEl.classId)) && (clssArr[dsEl.classId] !== undefined && !clssArr[dsEl.classId].deleted)) {
                statusSize++;
            }
        });

        const pages = Math.ceil(statusSize / 500);


        const MAX_VISIBLE_PAGES = 5; // Максимальное количество отображаемых кнопок страниц
        const visiblePages = Math.min(pages - visiblePage, MAX_VISIBLE_PAGES); // Количество видимых страниц
        const pageBtns = [];


        // Функция для создания элемента "..."
        const createEllipsis = (start, end, onClick) => (
            <Pagination.Ellipsis key={`${start}-${end}`} onClick={onClick} />
        );

        // Функция для создания кнопки страницы
        const createPageButton = (pageNumber) => (
            <Pagination.Item
                key={pageNumber}
                onClick={() => {setPage(pageNumber);}
                }
                active={pageNumber === active}
            >
                {pageNumber + 1}
            </Pagination.Item>
        );

        if (visiblePage !== 0 && pages > MAX_VISIBLE_PAGES) {
            // Добавляем элемент "..." перед последней видимой страницей
            pageBtns.push(createEllipsis(visiblePage + visiblePages + 1, pages,
                () => setVisiblePage(Math.max(visiblePage - MAX_VISIBLE_PAGES, 0))
            ));
        }

        // Добавляем кнопки для первых видимых страниц
        for (let i = visiblePage; i < visiblePage + visiblePages; i++) {
            if(i === -1) continue;
            pageBtns.push(createPageButton(i));
        }

        // Если количество страниц больше, чем максимальное количество отображаемых кнопок
        if (pages > MAX_VISIBLE_PAGES && visiblePage + visiblePages < pages) {
            // Добавляем элемент "..." перед последней видимой страницей
            pageBtns.push(createEllipsis(visiblePage + visiblePages - 1, pages, () => setVisiblePage(visiblePage + MAX_VISIBLE_PAGES)));
        }

        // Добавляем кнопки для перемещения на предыдущую и следующую страницу
        pageBtns.unshift(
            <Pagination.Prev
                key="prevPage"
                onClick={() => {
                    if(active !== 0) {
                        if(active === visiblePage)
                            setVisiblePage(Math.max(visiblePage - MAX_VISIBLE_PAGES, 0))
                        setPage(active-1);
                    }
                }}
                disabled={active === 0}
            />
        );
        pageBtns.push(
            <Pagination.Next
                key="nextPage"
                onClick={() => {
                    if(active !== pages-1) {
                        if(active === visiblePage+MAX_VISIBLE_PAGES-1)
                            setVisiblePage(visiblePage + MAX_VISIBLE_PAGES)
                        setPage(active+1);
                    }
                }}
                disabled={active === pages}
            />
        );

        return (
            <Pagination key={"dsPagination"}>{pageBtns}</Pagination>
        );
    }

    function select(dsEl){
        let clssArr = ClassesToArr(props.classes);
        setClassName(clssArr[dsEl.classId].class);
        setActive(dsEl);
        setCurrentCls(dsEl.classId)
        LoadImg(dsEl.data, setImg, client);
        setRect([{
            x: dsEl.x, y: dsEl.y,
            width: dsEl.w, height: dsEl.h,
            id: 'bbox1',
            fill: 'rgba(0,255,0,0.3)',
            stroke: "green",
            strokeWidth: 4,
        }])
    }

    function setElementInfo(element, x, y, w, h, status, classId){
        element.status = status;
        element.x = Math.round(rect[0].x);
        element.y = Math.round(rect[0].y);
        element.w = Math.round(rect[0].width);
        element.h = Math.round(rect[0].height);
        element.classId = Number(classId);

        axios.put(`${ApiUrl}/ai/dataset/updateElement`, element)
            .catch(error => {
                console.error(error);
            });

        updateElement(element)
    }

    function updateElement(element){
        if(element === undefined) return
        let id = props.dataset.indexOf(element);
                let sel = false;
                for(let i = id+1; !sel && i < props.dataset.length; i++){
                    if(props.selectedClass === 0 || props.dataset[i].classId === props.selectedClass) {
                        let newSel = props.dataset[i];
                        if (props.status.includes(newSel.status)) {
                            select(newSel)
                            sel = true
                            let el = document.getElementById("ds" + newSel.datasetID);
                            el.scrollIntoView(true);
                        }
                    }
                }
    }

    function prevImage(element){
        if(element === undefined) return
        let id = props.dataset.indexOf(element);
        let sel = false;
        for(let i = id-1; !sel && i < props.dataset.length; i--){
            if(props.selectedClass === 0 || props.dataset[i].classId === props.selectedClass) {
                let newSel = props.dataset[i];
                if (props.status.includes(newSel.status)) {
                    select(newSel)
                    sel = true
                    let el = document.getElementById("ds" + newSel.datasetID);
                    el.scrollIntoView(true);
                }
            }
        }
    }

    function save(element, rect, status, classId, scale){
        let nX, nY, nW, nH;
        nX = Math.round(rect[0].x*scale);
        nY = Math.round(rect[0].y*scale);
        nW = Math.round(rect[0].width*scale);
        nH = Math.round(rect[0].height*scale);
        setElementInfo(element, nX, nY, nW, nH, status, classId, scale)
    }

    const handleKeyPress = (event) => {
        if(event.key === 2)
            updateElement(active)
        if(event.key === 8)
            prevImage(active)
    }

    const getClasses = () => {
        if(props.classes !== null)
            return props.classes.map((cls) => {
                return(
                    <option value={cls.id}>{cls.class}</option>
                )
            })
    }

    return(
        <div key={"dsTabValidation"+props.status[0]} >
            <Row key={"dsTabValidation"+props.status[0]+"Row"} className={"d-flex justify-content-center"}>
                <Col key={"dsTabValidation"+props.status[0]+"RowCol1"} md={4} className={"justify-content-center"}>
                    <Row>
                        <Col md={11}>
                        <Form.Select
                                value={currentCls}
                                onChange={(e) => {setCurrentCls(e.target.value)}}
                        >
                            {getClasses()}
                        </Form.Select>
                        </Col>
                        <Col md={1}>
                            <ExampleImage dsExample={props.dsExample} cls={GetClassById(props.classes, currentCls)} />
                        </Col>
                    </Row>
                </Col>
                <Col key={"dsTabValidation"+props.status[0]+"RowCol2"} md={{span: 3, offset:5}} >
                    <Button className={"btnIDanger"} variant={"default"} onClick={() => {save(active, rect,3, currentCls)}}>
                        <FontAwesomeIcon icon={faTrash} size={"xl"}/>
                    </Button>
                    <Button className={"btnIPrimary"} variant={"default"} onClick={() => setRect([{
                        x: 100,
                        y: 100,
                        width: 100,
                        height: 100,
                        id: 'bbox1',
                        fill: 'rgba(0,255,0,0.3)',
                        stroke: "green",
                        strokeWidth: 4}])}>
                        <FontAwesomeIcon icon={faPlus} size={"xl"}/>
                    </Button>
                    <Button className={"btnISuccess"} variant={"default"} id="btnSave" onClick={() => {save(active, rect, 4, currentCls)}}>
                        <FontAwesomeIcon icon={faFloppyDisk} size={"xl"}/>
                    </Button>
                    <Button className={"btnISuccess"} variant={"default"} id="btnSave" onClick={() => {updateElement(active)}}>
                        <FontAwesomeIcon icon={faChevronDown} size={"xl"}/>
                    </Button>
                </Col>
            </Row>
            {getPageDSBtns(props.status, page, props.dataset)}
            <Row key={"dsTabValidation"+props.status[0]+"Row2"}>
                <Col key={"dsTabValidation"+props.status[0]+"Row2Col1"} md={2} style={{maxHeight:"700px", overflowY: "auto" }} tabIndex="0" onKeyPress={handleKeyPress}>
                    <Table hover borderless >
                        <tbody>
                        {getDS(props.status, props.dataset)}
                        </tbody>
                    </Table>
                </Col>
                <Col key={"dsTabValidation"+props.status[0]+"Row2Col2"} md={10} ref={editorContainer}>
                    <DsEditor class={className} setRectFunc={setRect} rect={rect} image={b64image} container={editorContainer}/>
                </Col>
            </Row>
        </div>
    )
}

export default DsTab;