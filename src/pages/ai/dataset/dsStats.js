import React, {useRef} from "react";
import {Bar, getElementAtEvent} from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {ClassesToArr, GetClassById, GetClassId} from "../aiUtils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Набор данных',
        },
    },
};

function DsStats(props){
    let data = [], labels = [];

    function createData(ds){
        let clssArr = ClassesToArr(props.classes)
        ds.forEach((dsEl) => {
            if (clssArr[dsEl.classId] !== undefined && !clssArr[dsEl.classId].deleted) {
                if (data[clssArr[dsEl.classId].class] === undefined) {
                    data[clssArr[dsEl.classId].class] = 1;
                } else {
                    data[clssArr[dsEl.classId].class]++;
                }
            }
        });

        labels = Object.keys(data);
        data = Object.values(data);

        let stats = {
            labels,
            datasets: [
                {
                    label: props.modelName,
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
        };

        return stats;
    }

    const chartRef = useRef();
    const onClick = (event) => {
        let i = 0;
        let position = -1;
        if (getElementAtEvent(chartRef.current, event)[0] === undefined){
            props.setSelectedClass(0);
            return;
        }else
            position = getElementAtEvent(chartRef.current, event)[0].index
        labels.forEach((element) => {
            if (i === position)
                props.setSelectedClass(GetClassId(props.classes, element))
            i++
        })
    }

    function showElement(props){
        return(
            <Bar key="datasetBars" ref={chartRef} style={{maxHeight:"250px"}} options={options} data={createData(props.dataset)}     onClick={onClick} />
        )
    }

    return(
        <>
            {showElement(props)}
        </>
    )
}

export default DsStats;