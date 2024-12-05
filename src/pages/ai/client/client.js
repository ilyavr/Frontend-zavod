import React, {useEffect, useState} from 'react';
import {Button, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartSimple, faCog, faGraduationCap, faImages,faToiletPortable} from "@fortawesome/free-solid-svg-icons";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {GetClients} from "../aiUtils";
import axios from "axios";

//                                                                   КНОПКИ НАВИГАЦИИ ПО AI
const Client = () => {
    const {client} = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const [locClients, setClients] = useState([]);

    function handleNavigation(link){
        if(location.state !== null)
            navigate(link, {state: {clients: location.state.clients}});
        else {
            GetClients(setClients)
            navigate(link, {state: {clients: locClients}});
        }

    
    }

    const getActiveButton = () => {
        if (location.pathname.includes('dataset')) return 'dataset';
        if (location.pathname.includes('stats')) return 'stats';
        if (location.pathname.includes('learning')) return 'learning';
        if (location.pathname.includes('aidata')) return 'aidata';
        if (location.pathname.includes('settings')) return 'settings';
        return null; 
    };
    const activeButton = getActiveButton();
    


    return (
        <>
            <Row>
                <Col md={12}>

                    <OverlayTrigger
                        placement='top'
                        overlay = {<Tooltip>Набор данных</Tooltip>}
                    >
                    <Button className={"btn btnIPrimary"}  variant={"default"} onClick={() => handleNavigation("/ai/"+client+"/dataset" ,'dataset')}>
                        <FontAwesomeIcon icon={faImages} size={"2xl"} color ={activeButton === 'dataset' ? 'rgba(22, 65, 148, 0.7)' : 'grey'}/></Button>
                    </OverlayTrigger>


                    <OverlayTrigger
                        placement='top'
                        overlay = {<Tooltip>Статистика</Tooltip>}
                    >
                    <Button className={'btn btnIPrimary'} variant={"default"} onClick={() => handleNavigation("/ai/"+client+"/stats",'stats')}>
                        <FontAwesomeIcon icon={faChartSimple} size={"2xl"} color ={activeButton === 'stats' ? 'rgba(22, 65, 148, 0.7)' : 'grey'}/></Button>
                    </OverlayTrigger>                    
                    
                    <OverlayTrigger
                    placement='top'
                    overlay = {<Tooltip>Обучения</Tooltip>}
                >
                    <Button className={"btn btnIPrimary"} variant={"default"} onClick={() => handleNavigation("/ai/"+client+"/learning",'learning')}>
                        <FontAwesomeIcon icon={faGraduationCap} size={"2xl"} color ={activeButton === 'learning' ? 'rgba(22, 65, 148, 0.7)' : 'grey'} /></Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                        placement='top'
                        overlay = {<Tooltip>Эталоны</Tooltip>}
                    >
                    <Button className={"btn btnIPrimary"}  variant={"default"} onClick={() => handleNavigation("/ai/"+client+"/aidata",'aidata')}>
                        <FontAwesomeIcon icon={faToiletPortable} size={"2xl"} color ={activeButton === 'aidata' ? 'rgba(22, 65, 148, 0.7)' : 'grey'}/></Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                        placement='top'
                        overlay = {<Tooltip>Настройки</Tooltip>}
                    >
                        <Button className={"btn btnIPrimary"} variant={"default"} onClick={() => handleNavigation("/ai/"+client+"/settings",'settings')}>
                            <FontAwesomeIcon icon={faCog} size={"2xl"} color ={activeButton === 'settings' ? 'rgba(22, 65, 148, 0.7)' : 'grey'}/></Button>
                
                    </OverlayTrigger>
               
               </Col>
            </Row>
            <Row>
                <Outlet />
            </Row>
        </>
    );
}

export default Client
