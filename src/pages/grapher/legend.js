import {Chart} from "chart.js";

const getOrCreateLegendList = (chart) => {
        const legendContainer = document.getElementById("channels");
        if(legendContainer !== null) {
            let listContainer = legendContainer.querySelector('ul');

            if (!listContainer) {
                listContainer = document.createElement('ul');
                listContainer.style.display = 'flex';
                listContainer.style.flexDirection = 'row';
                listContainer.style.margin = 0;
                listContainer.style.padding = 0;

                legendContainer.appendChild(listContainer);
            }
            return listContainer;
        }
        return null;
    };

    const htmlLegendPlugin = {
        id: 'htmlLegend',
        afterUpdate(chart, args, options) {
        if(chart === null || chart === undefined ) return;
            const ul = getOrCreateLegendList(chart);
            if(ul === null) return;
            ul.style.flexDirection = 'column';
            // Remove old legend items
            while (ul.firstChild) {
                ul.firstChild.remove();
            }

            // Reuse the built-in legendItems generator
            const items = chart.options.plugins.legend.labels.generateLabels(chart);

            items.forEach(item => {
                const li = document.createElement('li');
                li.style.alignItems = 'center';
                li.style.cursor = 'pointer';
                li.style.display = 'flex';
                li.style.flexDirection = 'row';
                li.style.marginLeft = '10px';
                // const comment = $("#comment").html();
                li.onclick = () => {
                    const {type} = chart.config;
                    if (type === 'pie' || type === 'doughnut') {
                        // Pie and doughnut charts only have a single dataset and visibility is per item
                        chart.toggleDataVisibility(item.index);
                    } else {
                        chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                    }
                    //deleteCookie(transliterate(comment+"_"+item.text));
                    // if(getCookie(transliterate(comment+"_"+item.text)) != undefined && getCookie(transliterate(comment+"_"+item.text)) === 'true')
                    //     setCookie(transliterate(comment+"_"+item.text), false, {secure: true, 'max-age': 31536000});
                    // else
                    //     setCookie(transliterate(comment+"_"+item.text), true, {secure: true, 'max-age': 31536000});


                    chart.update();
                };
                // if(getCookie(transliterate(comment+"_"+item.text)) != undefined){
                //     item.hidden = (getCookie(transliterate(comment+"_"+item.text)) === 'true');
                //     chart.setDatasetVisibility(item.datasetIndex, !item.hidden);
                // }

                // Color box
                const boxSpan = document.createElement('span');

                boxSpan.style.background = item.strokeStyle;
                boxSpan.style.borderColor = item.strokeStyle;
                boxSpan.style.borderWidth = item.lineWidth + 'px';
                boxSpan.style.display = 'inline-block';
                boxSpan.style.height = '20px';
                boxSpan.style.marginRight = '10px';
                boxSpan.style.width = '20px';

                // Text
                const textContainer = document.createElement('p');
                textContainer.style.color = item.fontColor;
                textContainer.style.margin = 0;
                textContainer.style.padding = 0;
                textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

                const text = document.createTextNode(item.text);
                textContainer.appendChild(text);

                li.appendChild(boxSpan);
                li.appendChild(textContainer);
                ul.appendChild(li);
            });
        }
    };

    export {htmlLegendPlugin};
