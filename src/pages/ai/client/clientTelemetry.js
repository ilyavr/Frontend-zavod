import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMicrochip} from "@fortawesome/free-solid-svg-icons";
import {ApiUrl} from "../../../App";
import axios from "axios";


const ClientTelemetry = (props) => {
    // const [telemetry, setTelemetry] = useState([])
    // const [tData, setTData] = useState([])
    // const [cancelTokenSource, setCancelTokenSource] = useState(null);
    //
    // let lastId = 0;
    // useEffect(() => {
    //     if (props.client === -1) return;
    //     const fetchData = async () => {
    //         // Проверяем, существует ли предыдущий запрос и отменяем его
    //         if (cancelTokenSource) {
    //             cancelTokenSource.cancel('Canceled by reload tab');
    //         }
    //
    //         // Создаем новый токен отмены
    //         const newCancelTokenSource = axios.CancelToken.source();
    //         setCancelTokenSource(newCancelTokenSource);
    //
    //         try {
    //             const response = await axios.get(`${ApiUrl}/ai/client/getTelemetry?clientId=${props.client}&telemetryId=${lastId}`, { cancelToken: newCancelTokenSource.token });
    //             setTelemetry(response.data)
    //             lastId = response.data[0].telID;
    //             if(lastId === undefined || lastId === 0)
    //                 await new Promise((resolve) => setTimeout(resolve, 5000));
    //
    //             fetchData();
    //         } catch (err) {
    //             if (!axios.isCancel(err)) {
    //                 console.log(err.message);
    //                 await new Promise((resolve) => setTimeout(resolve, 5000));
    //                 fetchData();
    //             }
    //         }
    //     };
    //
    //     fetchData();
    //
    //     // Очищаем токен отмены при размонтировании компонента
    //     return () => {
    //         if (cancelTokenSource) {
    //             cancelTokenSource.cancel('Component unmounted');
    //         }
    //         setTData([]);
    //     };
    // }, [props.client]); // Следим за изменением props.client
    //
    //
    //
    // useEffect(() => {
    //     if (telemetry != null && telemetry[0] !== undefined && telemetry[0].data !== undefined){
    //         let data = JSON.parse(telemetry[0].data);
    //         setTData(data);
    //     }
    //
    // }, [telemetry]);
    //
    // function getCPULoad() {
    //     let cpuLoad = 0;
    //     if(tData !== undefined && tData.cpu !== undefined){
    //         tData.cpu.load.forEach(coreLoad => {
    //             cpuLoad += coreLoad;
    //         })
    //         return (cpuLoad / 4).toFixed(2);
    //     }
    // }
    //
    // function getPhysicTotalMemory() {
    //     if(tData !== undefined && tData.mem !== undefined)
    //         return (tData.mem.ram.physicTotal/1024).toFixed(0);
    // }
    //
    // function getPhysicBusyMemory() {
    //     if(tData !== undefined && tData.mem !== undefined)
    //         return ((tData.mem.ram.physicTotal - tData.mem.ram.physicAvailable)/1024).toFixed(0);
    // }
    //
    // function getCPUTherm() {
    //     if(tData !== undefined && tData.mem !== undefined)
    //         return (tData.thermal.CPU).toFixed(2);
    // }

    // return(
    //     <h6>
    //         <table className={"table"} style={{border: "solid 1px white"}}>
    //             <tbody>
    //             <tr><td><FontAwesomeIcon icon={faMicrochip}/> CPU</td><td>{getCPULoad()}%</td><td>{getCPUTherm()}°C</td><td>{getPhysicBusyMemory()}/{getPhysicTotalMemory()}Mb</td></tr>
    //             {/*<tr><td><FontAwesomeIcon icon={faMicrochip}/> GPU</td><td>15%</td><td>35°C</td><td>3.56/8GB</td></tr>*/}
    //             </tbody>
    //         </table>
    //     </h6>
    // );
}

export default ClientTelemetry;