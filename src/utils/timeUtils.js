function IncDT(dPickerStart, dPickerStop) {
    let interval = dPickerStop.current.selectedDates[0].getTime() - dPickerStart.current.selectedDates[0].getTime()
    dPickerStart.current.selectDate(dPickerStart.current.selectedDates[0].getTime() + interval);
    dPickerStop.current.selectDate(dPickerStop.current.selectedDates[0].getTime() + interval);
}

function DecDT(dPickerStart, dPickerStop) {
    let interval = dPickerStop.current.selectedDates[0].getTime() - dPickerStart.current.selectedDates[0].getTime()
    dPickerStart.current.selectDate(dPickerStart.current.selectedDates[0].getTime() - interval);
    dPickerStop.current.selectDate(dPickerStop.current.selectedDates[0].getTime() - interval);
}

function GetDTString(date){
    if(date === undefined){
        console.log("GetDTString: ERROR, date is undefined!!");
        return "01.01.1970 00:00:00";
    }
    return date.getDate()+"."+AddZeroToTime(date.getMonth()+1)+"."+date.getFullYear()+" "+AddZeroToTime(date.getHours())+":"+AddZeroToTime(date.getMinutes())+":"+AddZeroToTime(date.getSeconds());
}

function AddZeroToTime(timeUnit){
    if(timeUnit < 10)
        return "0"+timeUnit;
    else
        return timeUnit;
}

export {GetDTString, AddZeroToTime, IncDT, DecDT};