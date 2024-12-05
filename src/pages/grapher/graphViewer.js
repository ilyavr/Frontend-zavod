import React, {useEffect, useRef, useState} from "react";
import {Line} from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';

import {
    CategoryScale, Chart,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip
} from 'chart.js';
import {htmlLegendPlugin} from "./legend";
import {Button, Col, Dropdown, Form, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faClock,
    faGear,
    faSearch,
    faUpRightAndDownLeftFromCenter
} from "@fortawesome/free-solid-svg-icons";
import {DecDT, GetDTString, IncDT} from "../../utils/timeUtils";
import AirDatepicker from "air-datepicker";
import 'air-datepicker/air-datepicker.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin,
    TimeScale
);

export const options = {
    responsive: true,
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    },
    animation: false,
    elements: {
        point:{
            radius: 0
        }
    },
    plugins: {
        htmlLegend: {
            containerID: 'channels',
        },
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
        zoom: {
            zoom: {
                drag: {
                    enabled: true
                }
            }
        },
    },
    scales: {
        y: {
            source: 'data',
            autoSkip: true,
            beginAtZero: true,
        },
        x: {
            type: 'time',
            time: {
                tooltipFormat: 'dd.MM.yyyy HH:mm:ss',
                displayFormats:{
                    minute: 'HH:mm',
                    second: 'HH:mm:ss',
                    millisecond: 'HH:mm:ss'
                },
                stepSize: 10,
            },
            ticks: {
                source: 'auto',
                maxRotation: 0,
                autoSkip: true,
            }
        }
    },
};

function GrapherViewer(props){
    const [graphData, setGraphData] = useState([])
    const [fields, setFields] = useState([])

    let d1 = new Date();
    let d2 = new Date();
    d1.setHours(d1.getHours()-1);
    let dPickerStart = useRef(), dPickerStop = useRef(), startInput = useRef(), stopInput = useRef();

    // let statsTimeout

    function updateStats(){
        // clearTimeout(statsTimeout);
            let chart = document.getElementById("chart");
            chart.classList.add("waiting");
            fetch('http://localhost:8004/grapher/getData?profileId=' + props.chartId + '&dStart=' + GetDTString(dPickerStart.current.selectedDates[0]) + '&dStop=' + GetDTString(dPickerStop.current.selectedDates[0])
                , {method: "POST"})
                .then((response) => response.json())
                .then((data) => {
                    setGraphData(data);
                    chart.classList.remove("waiting");
                })
                .catch((err) => {
                    console.log(err.message);
                });


           // statsTimeout = setTimeout(updateStats, 500);

    }

    useEffect(() => {
        fetch('http://localhost:8004/grapher/getFields?profileId='+props.chartId, {method: "POST"})
            .then((response) => response.json())
            .then((data) => {
                setFields(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
        dPickerStart.current = new AirDatepicker(startInput.current, {
            timepicker: true,
            timeFormat: 'HH:mm',
            selectedDates: d1,
        });
        dPickerStop.current = new AirDatepicker(stopInput.current, {
            timepicker: true,
            timeFormat: 'HH:mm',
            selectedDates: d2
        });
        updateStats()
    }, [props.chartId]);

    function hslToColor(h, s, l){
        let r, g, b;
        if(s === 0){
            r = g = b = l;
        }else{
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = Math.round(255 * hue2rgb(p, q, h + 1/3));
            g = Math.round(255 * hue2rgb(p, q, h));
            b = Math.round(255 * hue2rgb(p, q, h - 1/3));
        }

        let decColor = r + g * 256 + 65536 * b;

        return '#'+decColor.toString(16);
    }

    function createData(){
        if(graphData.data === undefined) return {labels: [], datasets: []};
        let labels = graphData.labels;
        let datasets = []
        let i = 0;
        fields.forEach(field => {
            datasets.push({
                label: field.title,
                data: graphData.data[field.name],
                borderColor: (field.color==="")?(hslToColor(i/fields.length, 0.75, 0.5)):field.color,
                backgroundColor: (field.color==="")?(hslToColor(i/fields.length, 0.75, 0.5)):field.color,
                borderWidth: 1.5,
                indexAxis: 'x'
            })
            i++;
        })
        return {
            labels: labels,
            datasets: datasets,
        };
    }

    function resetZoom(){
        const chart = Chart.getChart("chart");
        chart.resetZoom('easeOutCubic');
    }

    return(
        <>
            <Col className={"d-flex justify-content-end"} style={{marginRight: 0, marginBottom: "5px", marginTop: "5px"}}>
                <Button variant={"default"} onClick={resetZoom}><FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} size={"xl"}/></Button>
                <Dropdown >
                    <Dropdown.Toggle className={"ddBtn ddBtnDefault"} variant="default" id="dropdown-basic">
                        <FontAwesomeIcon icon={faClock} size={"xl"} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={"ddMenu"} renderOnMount={true}>
                        <h5>Интервал</h5>
                        <InputGroup>
                            <InputGroup.Text id="addonFrom" className={"addonFix addon"} >От</InputGroup.Text>
                            <Form.Control id="dtStartGraph" ref={startInput} className={"dtMB5"} aria-describedby="addonFrom"/>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text id="addonFrom" className={"addonFix addon"} >До</InputGroup.Text>
                            <Form.Control id="dtStopGraph" className={"dtMB5"} ref={stopInput}/>
                        </InputGroup>
                        <div className={"d-flex justify-content-center"}>
                            <Button onClick={() => {DecDT(dPickerStart, dPickerStop); updateStats()}} variant={"default"} className={"btn-graph"}><FontAwesomeIcon icon={faChevronLeft} size={"xl"}/></Button>
                            <Button onClick={() => {updateStats()}} variant={"default"} className={"btn-graph"} style={{marginLeft: "20px"}}>Применить</Button>
                            <Button onClick={() => {IncDT(dPickerStart, dPickerStop); updateStats()}} variant={"default"} className={"btn-graph"}><FontAwesomeIcon icon={faChevronRight} size={"xl"}/></Button>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle className={"ddBtn ddBtnDefault"} variant="default" id="dropdown-basic" >
                        <FontAwesomeIcon icon={faGear} size={"xl"}/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={"ddMenu"} renderOnMount={true}>
                        <h5>Настройки</h5>
                        <div id="channels"></div>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
            <Line id={"chart"} style={{maxHeight: "80vh", backgroundColor: props.bgColor}} options={options} data={createData(props.dataset)} plugins={[htmlLegendPlugin]}/>
        </>
    )
}

export default GrapherViewer;