import logo from './imgs/logoOWhite.svg'
import {
    Link
} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThermometerEmpty} from "@fortawesome/free-solid-svg-icons";
import "./footer.css"
import 'air-datepicker/air-datepicker.css';

const Footer = () => {
    // let dPicker = new AirDatepicker('#footer-dPicker', {
    //     selectedDates: [new Date()]
    // })

    return (

        <>
            <div style={{marginTop:"30px"}}></div>
            <footer id="footer">
                <Container fluid>
                    <Row className={"d-flex justify-content-center"}>
                        <Col md={3} className={"text-center footer-copy footer-block"}>
                            <img className="navbar-brand" src={logo}  alt={"Логотип БИРЮСА"}/><br />
                        </Col>
                        <Col md={2} className={"footer-nav footer-block"}>
                            <Link className="nav-link" to="/news">Новости</Link>
                            <Link className="nav-link" to="/tasks">Задачи</Link>
                            <Link className="nav-link" to="/phonebook">Телефоны</Link>
                            <Link className="nav-link" to="/info">Справка</Link>
                            <Link className="nav-link" to="/library">Библиотека</Link>
                        </Col>
                        <Col md={2} className={"footer-nav footer-block"}>
                            <Link className="nav-link" to="/links">Ссылки</Link>
                            <Link className="nav-link" to="/resources">Ресурсы</Link>
                            <Link className="nav-link" to="/department">Отделы</Link>
                            <Link className="nav-link" to="http://jira.biryusa.corp:8080/servicedesk/customer/portal/6">Заявки</Link>
                            <Link className="nav-link" to="/projects">Проекты БП</Link>
                        </Col>
                        <Col md={2} className="footer-block">
                        </Col>
                        <Col md={3} className="d-flex justify-content-center footer-block"><div id="footer-dPicker" className="datepicker-here"></div></Col>
                        <span className="copyright footer-block">
                            <div><FontAwesomeIcon icon={faThermometerEmpty} style={{fontSize: "1.3em"}}/> серверная: <span id="srvTemp"></span>&#176;C</div>
                            © ОАО «КЗХ Бирюса», 2022 </span>
                    </Row>
                </Container>
            </footer>
        </>
    );
}
export default Footer;