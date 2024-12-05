import React, {useState, useEffect } from 'react';
import {Container, Row, Col, Alert, OverlayTrigger, Tooltip, Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faPencil} from "@fortawesome/free-solid-svg-icons";
import 'font-awesome/css/font-awesome.min.css';
import './SystemState.css'
import Moment from 'moment';

const SystemState = () => {
    const [points, setPoints] = useState([]);
    const [online, setOnline] = useState([]);
    const [changeability, setChangeability] = useState([]);
    const [show, setShow] = useState(false);
    const [modalContent, setModalContent] = useState([])

    const tick = () => {
        fetch('http://localhost:8000/state/online', {method: "POST"})
            .then((response) => response.json())
            .then((data) => {
                setOnline(data);
            })
            .catch((err) => {
                console.log(err.message);
                setOnline([]);
            });
        fetch('http://localhost:8000/state/changeability', {method: "POST"})
            .then((response) => response.json())
            .then((data) => {
                setChangeability(data);
            })
            .catch((err) => {
                console.log(err.message);
                setChangeability([]);
            });
    }

    useEffect(() => {
        fetch('http://localhost:8000/state/points', {method: "POST"})
            .then((response) => response.json())
            .then((data) => {
                setPoints(data);
            })
            .catch((err) => {
                console.log(err.message);
                setPoints([]);
            });
        tick();
        const timer = setInterval(() => tick(), 5000);
        return () => clearInterval(timer);
    }, []);

    function getDataById(data, id){
        let el;
        if(data === null) return el;
        data.forEach(element => {
            if(element.id === id) {
                el = element;
            }
        })
        return el;
    }

    function showData(){
        if(points.length > 0){
            return(
                points.map((point) => {
                    let state, chAbility, deadData;
                    let elementCh = getDataById(changeability, point.id)
                    let elementOn = getDataById(online, point.id)
                    if(elementOn !== undefined && elementOn.online)
                        state = "online";
                    else
                        state = "offline";
                    if(elementCh !== undefined && elementCh.changeability)
                        chAbility = "black"
                    else
                        chAbility = "orange"
                    if(elementCh !== undefined && elementCh.lastUpdate < Moment().unix()-point.dtInterval){
                        deadData = "offline"
                        chAbility = ""
                    }else{
                        deadData = ""
                    }
                    let dt = new Date(0);
                    if(elementCh !== undefined)
                        dt = new Date(elementCh.lastUpdate * 1000)

                    return (
                        <>
                            <OverlayTrigger
                                delay={{ show: 250, hide: 400 }}
                                placement={"left"}
                                overlay={
                                    <Tooltip id={"tooltip-"+point.id} unmountOnExit>
                                        {dt.getDate()+"."+(dt.getMonth()+1)+"."+dt.getFullYear()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds()}
                                    </Tooltip>
                                }
                            >
                            <Col id={"point" + point.id} md={4} className={"point"} style={{padding: "5px"}}>
                                <Button className="btn-default btnIPrimary">
                                    <FontAwesomeIcon icon={faPencil} />
                                </Button>
                                <FontAwesomeIcon className={state} icon={faCircle}/> <span className={deadData} style={{color:chAbility}}>{point.name}</span>
                            </Col>
                            </OverlayTrigger>
                        </>
                    );
                })
            );
        }else{
            return (
                <Alert variant="danger" className={"text-center"} style={{marginTop:"30px"}}>
                    <Alert.Heading>Упс, кажется сервис мониторинга сейчас недоступен :(</Alert.Heading>
                </Alert>
            );
        }
    }

    // function getModalContent(){
    //     if(modalContent.data !== undefined){
    //         return(
    //             <>
    //                 <Modal.Header closeButton>
    //                     <Modal.Title>{modalContent.header}</Modal.Title>
    //                 </Modal.Header>
    //                 <Modal.Body>
    //                     <form className="form-horizontal" id="addpoint-form" noValidate="novalidate">
    //                         <div className="control-group">
    //                             <label className="control-label" htmlFor="addpointName">Название точки</label>
    //                             <div className="controls">
    //                                 <input type="text" className="input-xxlarge" id="addpointName" placeholder="Название точки" >
    //                             </div>
    //                         </div>
    //                         <div className="control-group">
    //                             <label className="control-label" htmlFor="addpointGraphLink">Ссылка на график</label>
    //                             <div className="controls">
    //                                 <input type="text" className="input-xxlarge" id="addpointGraphLink"
    //                                        placeholder="Ссылка на график">
    //                             </div>
    //                         </div>
    //                         <div className="control-group">
    //                             <label className="control-label" htmlFor="addpointDbConnection">Подключение к БД</label>
    //                             <div className="controls">
    //                                 <select className="input-xxlarge" id="addpointDbConnection">
    //                                     <option data-id="1">[<i>firebird</i>]&nbsp;
    //                                         <b>srv-firebird-&gt;MonitorT</b> (SYSDBA)
    //                                     </option>
    //                                 </select>
    //                                 <a id="addPointGetTables" className="btn btn-success">Запрос таблиц</a>
    //                             </div>
    //                         </div>
    //                         <div className="control-group">
    //                             <label className="control-label" htmlFor="addpointTableNameAndDataTime">Таблица и поле
    //                                 времени</label>
    //                             <div className="controls">
    //                                 <select type="text" className="input-large" id="addpointTableName">
    //                                     <option>OPTION_CUT</option>
    //                                 </select>
    //                                 <select className="input-medium" id="addpointDatetime">
    //                                     <option>IDX_DISTRIBUTION</option>
    //                                     <option selected="selected">DATETIME</option>
    //                                 </select>
    //                                 <a id="addPointGenerateSql" className="btn btn-success">Генерировать SQL</a>
    //                             </div>
    //                         </div>
    //                         <div className="control-group">
    //                             <label className="control-label" htmlFor="addpointSql">SQL запрос</label>
    //                             <div className="controls">
    //                                 <input type="text" className="input-xxlarge" id="addpointSql"
    //                                        placeholder="SELECT FIRST 5 DATETIME,V1,V2,V3 FROM table ORDER BY datetime DESC"
    //                                        rel="tooltip" title=""
    //                                        data-original-title="SQL запрос, возвращающий данные, для анализа">
    //                             </div>
    //                         </div>
    //                         <div className="control-group">
    //                             <label className="control-label" htmlFor="addpointBreakTime">Нерабочее время</label>
    //                             <div className="controls">
    //                                 <input type="text" className="input-xxlarge" id="addpointBreakTime"
    //                                        placeholder="09:00-09:15,12:30-13:00" rel="tooltip" title=""
    //                                        data-original-title="Интервалы нерабочего времени, разделенные запятой.">
    //                             </div>
    //                         </div>
    //                         <!--  <div class="control-group">
    //                               <label class="control-label" for="addpointPosition">Порядок сортировки</label>
    //                               <div class="controls"> -->
    //                         <input type="hidden" className="" id="addpointPosition" placeholder="Порядок сортировки"
    //                                value="1">
    //                             <!--</div>
    //                         </div>-->
    //                             <div className="control-group">
    //                                 <label className="control-label" htmlFor="addpointIntervel">Интервал между
    //                                     данными</label>
    //                                 <div className="controls">
    //                                     <input type="text" className="input-xlarge" id="addpointIntervel"
    //                                            placeholder="300" value="300" rel="tooltip" title=""
    //                                            data-original-title="Мексимально допустимый интервал, в течении которого данные могут не поступать в таблицу">&nbsp;
    //                                         <i>(в секундах)</i>
    //                                 </div>
    //                             </div>
    //                             <div className="control-group">
    //                                 <label className="control-label" htmlFor="addpointDelay">Задержка первого
    //                                     сообщения</label>
    //                                 <div className="controls">
    //                                     <input type="text" className="input-xlarge" id="addpointDelay" placeholder="60"
    //                                            value="60" rel="tooltip" title=""
    //                                            data-original-title="Время, по истечению которого следует отправить первое сообщение об ошибке">&nbsp;
    //                                         <i>(в минутах)</i>
    //                                 </div>
    //                             </div>
    //                             <div className="control-group">
    //                                 <label className="control-label" htmlFor="addpointDead">Интервал отправки
    //                                     сообщений</label>
    //                                 <div className="controls">
    //                                     <input type="text" className="input-xlarge" id="addpointDead" placeholder="600"
    //                                            value="600" rel="tooltip" title=""
    //                                            data-original-title="Время, по истечению которого следует отправить повторное сообщение об ошибке">&nbsp;
    //                                         <i>(в минутах)</i>
    //                                 </div>
    //                             </div>
    //                             <div className="control-group">
    //                                 <label className="control-label" htmlFor="addpointUsers">Обслуживающий
    //                                     персонал</label>
    //                                 <div className="controls">
    //                                     <div className="row-fluid">
    //                                         <div className="span6">
    //                                             <div>Доступные</div>
    //                                             <select multiple="multiple" className="max-width" btn-id="a"
    //                                                     id="addpointUsers">
    //                                                 <option data-id="4">Носов А. В. (79535800388@sms.etk.ru)</option>
    //                                                 <option data-id="5">Коваленко А. Н. (kovalenko-an@biryusa.ru)
    //                                                 </option>
    //                                                 <option data-id="6">Комаров Г. А. (komarov-ga@biryusa.ru)</option>
    //                                                 <option data-id="9">Комаров Г. А. (79135321628@sms.mtslife.ru)
    //                                                 </option>
    //                                                 <option data-id="11">Кулаченко М.Н. (kulachenko-mn@biryusa.ru)
    //                                                 </option>
    //                                                 <option data-id="12">Марков Михаил (79135952014@sms.mtslife.ru)
    //                                                 </option>
    //                                                 <option data-id="13">Борисов Д.E. (dym.borisov@gmail.com)</option>
    //                                                 <option data-id="14">Дека А.Ф. (79029132982@sms.etk.ru)</option>
    //                                                 <option data-id="16">Соколов Я.А. (Sokolov-ya@biryusa.ru)</option>
    //                                             </select>
    //                                         </div>
    //                                         <div id="addpointUserButtonsWrap" className="span1 center">
    //                                             <br>
    //                                                 <div><a className="btn" btn-id="a">&gt;</a></div>
    //                                                 <div><a className="btn" btn-id="r">&lt;</a></div>
    //                                         </div>
    //                                         <div className="span5">
    //                                             <div>Назначенные</div>
    //                                             <select multiple="multiple" className="max-width" btn-id="r"
    //                                                     id="addpointUsers2">
    //                                                 <option data-id="8" selected="selected">Коваленко А. Н.
    //                                                     (79135398002@sms.mtslife.ru)
    //                                                 </option>
    //                                                 <option data-id="15" selected="selected">Соколов Я.А.
    //                                                     (79135714010@sms.mtslife.ru)
    //                                                 </option>
    //                                             </select>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                             <div className="control-group">
    //                                 <label className="control-label" htmlFor="addpointEvents">Реагировать на
    //                                     события</label>
    //                                 <div className="controls">
    //                                     <input type="checkbox" id="addpointEventDisconnection" checked="">&nbsp;<span>Разрыв связи (поступление данных)</span>&nbsp;
    //                                         <input type="checkbox" id="addpointEventInvariability" checked="">&nbsp;
    //                                             <span>Неизменность данных (переменчивость данных)</span>
    //                                 </div>
    //                             </div>
    //                             <div className="alert alert-error hidden"></div>
    //                     </form>
    //
    //                         {modalContent.data.map(item => {
    //                             return(<></>)
    //                         })}
    //
    //                 </Modal.Body>
    //             </>
    //         )
    //     }
    // }

    return (
            <>
                <div className={"secondaryBg"}>
                    <div className={"container secondaryNoSearch"}>
                        <h2 className={"text-center"}>Состояние системы</h2>
                    </div>
                </div>
                <Container className={"wrapper pageMT10"}>
                    <Col md={12} className={"legends"}>
                        <span className="legend"><FontAwesomeIcon className="online" icon={faCircle}/> <span style={{color:"black"}}>Норма</span></span>
                        <span className="legend"><FontAwesomeIcon className="offline" icon={faCircle}/> <span style={{color:"black"}}>Нет связи</span></span>
                        <span className="legend"><FontAwesomeIcon className="online" icon={faCircle}/> <span style={{color:"orange"}}>Нет переменчивости данных</span></span>
                        <span className="legend"><FontAwesomeIcon className="online" icon={faCircle}/> <span className="offline">Устаревшие данные</span></span>
                    </Col>
                    <Row className={"col-md-12"}>
                        {showData()}
                    </Row>
                </Container>
                {/*<Modal show={show} onHide={() => setShow(false)} size={"xl"}>*/}
                {/*    {getModalContent()}*/}
                {/*</Modal>*/}
            </>
        );
}

export default SystemState
