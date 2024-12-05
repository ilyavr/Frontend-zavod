import React from 'react';
import logo from './imgs/logoOrig.svg'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import Main from "../pages/main/main";
import Tasks from "../pages/tasks/tasks";
import SystemState from "../pages/systemState/SystemState";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPhone, faSignOutAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import {NavDropdown} from "react-bootstrap";
import Projects from "../pages/projects/projects";
import Info from "../pages/statics/info";
import AI from "../pages/ai/ai";
import Footer from "./footer";
import ClientDS from "../pages/ai/client/clientDataset";
import ClientStats from "../pages/ai/client/clientStats";
import Client from "../pages/ai/client/client";
import Reports from "../pages/reports/reports";
import ClientSettings from "../pages/ai/client/clientSettings";
import Grapher from "../pages/grapher/grapher";
import ClientLearning from "../pages/ai/client/clientLearning";
import ClientAidata from '../pages/ai/client/clientAidata';
import Cluster from "../pages/ai/cluster";

const Header = (props) => {

   // let address = "http://172.16.1.98"
    let address = "https://www1.biryusa.corp"
    //let address = "http://localhost"

    return (
        <>
            <Router>
                <nav className="navbar navbar-expand-lg navbar-light" id="headerMain">
                    <div className="container-fluid col-md-10">
                        <a className="navbar-brand logo" href="//www.biryusa.corp/">
                            <img className="navbar-brand brandSize" src={logo} alt={"БИРЮСА"}/>
                            <div id="productionCounter"></div>
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/news">Новости</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/tasks">Задачи</Link>
                                </li>
                                <li className="nav-item"><Link className="nav-link" to="/phonebook">Телефоны</Link></li>
                                    <NavDropdown title={"Информация"}>
                                            <NavDropdown.Item href="/info">Справка</NavDropdown.Item>
                                            <NavDropdown.Item href="/library">Библиотека</NavDropdown.Item>
                                            <NavDropdown.Item href="/links">Ссылки</NavDropdown.Item>
                                            <NavDropdown.Item href="/resources">Ресурсы</NavDropdown.Item>
                                            <NavDropdown.Item href="/projects">Проекты БП</NavDropdown.Item>
                                    </NavDropdown>
                                <li className="nav-item">
                                    <Link className="nav-link "
                                       to="//jira.biryusa.corp:8080/servicedesk/customer/portal/6">Заявки</Link>
                                </li>

                            </ul>
                            <button className="btn btn-default btnHeaderMargin">
                                <FontAwesomeIcon icon={faPhone} />
                            </button>


                            <button className="btn btn-default">
                                <FontAwesomeIcon icon={faUser} />
                            </button>

                            <button className="btn btn-default" >
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </button>


                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/tasks" element={<Tasks address={address} />} />
                    <Route path="/systemState" element={<SystemState address={address} />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/info" element={<Info />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/grapher" element={<Grapher address={address} />} />
                    <Route path="/ai" element={<AI address={address}/>}>
                        <Route path="/ai/cluster" element={<Cluster address={address} />} />
                        <Route path="/ai/:client" element={<Client address={address} />}>
                            <Route path="/ai/:client/dataset" element={<ClientDS address={address}/>} />
                            <Route path="/ai/:client/stats" element={<ClientStats address={address}/>} />
                            <Route path="/ai/:client/settings" element={<ClientSettings address={address}/>} />
                            <Route path="/ai/:client/learning" element={<ClientLearning address={address}/>} />
                            <Route path="/ai/:client/aidata" element={<ClientAidata address = {address}/>} />
                        </Route>
                    </Route>
                </Routes>
                <Footer />
            </Router>
        </>
    );
}

export default Header;