import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import "../tasks/task.css"
import {Link} from "react-router-dom";

const Info = () => {

    return (
        <>
            <div className={"secondaryBg"}>
                <div className={"container secondaryNoSearch"}>
                    <h2 className={"text-center"}>
                        <FontAwesomeIcon icon={faQuestionCircle}/> Справка
                    </h2>
                </div>
            </div>
            <Container>
                <Row className={"d-flex justify-content-center"}>
                    <Col md={10}>
                        <h6 className="taskHeader" data-bs-toggle="collapse" data-bs-target="#pcUsers">Для пользователей компьютеров <FontAwesomeIcon icon={faArrowRight} /></h6>

                        <div className="collapse pagePL10 show" id="pcUsers">
                            <Link href="#" onClick="openFile('/Files$/Web/Documents/20080326_01.pdf', 'srv-fs02')">Инструкция
                                пользователя компьютера и Интернет(к приказу №1622 от 07.12.2007)</Link><br />
                            <Link href="#" onClick="openFile('/Files$/Web/Documents/20080328_01.pdf', 'srv-fs02')">Инструкция
                                пользователя сканером в к-331</Link><br />
                            <Link href="#" onClick="openFile('/Files$/Web/Documents/20080526_01.pdf', 'srv-fs02')">О
                                легальности самостоятельной установки программного обеспечения.</Link><br />
                        </div>

                        <h6 className="taskHeader" data-bs-toggle="collapse" data-bs-target="#directory">Справочники <FontAwesomeIcon icon={faArrowRight} /></h6>
                        <div className="collapse pagePL10 show" id="directory">
                            <Link href="/page/contacts">Контактные адреса администрации</Link><br/>
                            <Link href="/page/contractsDocs">Перечень документов для заключения договоров</Link><br/>
                            <Link href="#" onClick="$('#searchModal').modal('show')">Адреса электронной почты и
                                телефоны</Link><br/>
                            <Link href="/page/manufactureHistory">История создания завода</Link><br/>
                            <Link href="#" onClick="copyToClipboard('//srv-adnt/library')">Библиотека</Link><br/>
                            <Link href="/page/stp">Нормативные документы</Link><br/>
                            Производственный календарь
                            <Link href="#"
                               onClick="openFile('/Files$/Web/Documents/20090827_02.pdf', 'srv-fs02')">2009г</Link>
                            <Link href="#"
                               onClick="openFile('/Files$/Web/Documents/20091124_01.pdf', 'srv-fs02')">2010г</Link>
                            <Link href="#"
                               onClick="openFile('/Files$/Web/Documents/20101111_02.pdf', 'srv-fs02')">2011г</Link>
                            <Link href="#"
                               onClick="openFile('/Files$/Web/Documents/20111012_01.pdf', 'srv-fs02')">2012г</Link>
                            <Link href="#"
                               onClick="openFile('/Files$/Web/Documents/20130208_02.pdf', 'srv-fs02')">2013г</Link>
                            <Link href="#"
                               onClick="openFile('/Files$/Web/Documents/20131111_01.pdf', 'srv-fs02')">2014г</Link>
                            <Link href="#"
                               onClick="openFile('/Files$/Web/Documents/20141118_01.pdf', 'srv-fs02')">2015г</Link>
                            <Link href="#"
                               onClick="openFile('/Files$/Web/Documents/20160129_01.pdf', 'srv-fs02')">2016г</Link>
                            <Link href="#"
                               onClick="openFile('/Files$/Web/Documents/20161014_01.pdf', 'srv-fs02')">2017г</Link>
                            <Link href="#" onClick="openFile('/Files$/Web/Documents/20171115.pdf', 'srv-fs02')">2018г</Link>
                            <Link href="#" onClick="openFile('/Files$/Web/Documents/20171115.pdf', 'srv-fs02')">2019г</Link>
                            <Link href="#" onClick="openFile('/Files$/Web/Documents/2020.pdf', 'srv-fs02')">2020г</Link><br/>
                            <Link href="/page/faq">Часто задаваемые вопросы и ответы на них</Link><br />
                            <Link href="">Толковый словарь</Link><br />
                        </div>

                        <h6 className="taskHeader" data-bs-toggle="collapse" data-bs-target="#caDocs">Шаблоны
                            документов <FontAwesomeIcon icon={faArrowRight} /></h6>
                        <div className="collapse pagePL10 show" id="caDocs">
                            <Link href="">На сервере Центра Автоматизации</Link><br/>
                        </div>

                        <h6 className="taskHeader" data-bs-toggle="collapse" data-bs-target="#cad">Информация по CAD \ CAM \ CAE <FontAwesomeIcon icon={faArrowRight} /></h6>
                        <div className="collapse pagePL10 show" id="cad">
                            <Link href="">Статьи из журнала CAD/CAM/CAE OBSERVER</Link><br/>
                            <Link href="">А вам СЛАБО!</Link>(заявки принимаются-конкурс продолжается)<br/>
                            <Link href="">Справочник инженерных расчетов</Link><br/>
                            <Link href="">Советы по работе в SolidWorks(англ.)</Link><br/>
                            <Link href="">Учебник по AutoCAD 2002 (рус.) дополнительно</Link><br/>
                        </div>

                        <h6 className="taskHeader" data-bs-toggle="collapse" data-bs-target="#benefits">Пособия <FontAwesomeIcon icon={faArrowRight} /></h6>
                        <div className="collapse pagePL10 show" id="benefits">
                            <Link href="#"
                               onClick="openFile('/Library/Books/Техническая литература/SOLIWORKS оформление чертежей по ЕСКД.pdf', 'srv-adnt')">Книга
                                по оформлению чертежей SolidWorks в ЕСКД</Link><br/>
                            <Link href="">Книги по фотографии</Link><br/>
                            <Link href="">В помощь инсталятору w2k и XP</Link><br/>
                            <Link href="">В помощь инсталятору ICQ</Link><br/>
                        </div>

                        <h6 className="taskHeader">Информеры <FontAwesomeIcon icon={faArrowRight} /></h6>
                        <div className="d-flex justify-content-center">
                            <script language="JavaScript" src="http://metal4u.ru/lme_utf8.js"></script>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Info
