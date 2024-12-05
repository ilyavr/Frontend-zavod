import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLink, faPencilAlt, faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";

function Task(props) {

    function replace(originalLink){
        switch (originalLink){
            case "/modules/report":
                return "/reports";
            case "https://www1.biryusa.corp:3000/ai":
                return "/ai";
            case "/modules/graph":
                return "/grapher";
            default:
                return originalLink;
        }
    }

    function getLink(props, comp){
        let clasNames = "";
        if(!props.editMode)
            clasNames = "task col-md-1"
        else
            clasNames = "btnISuccess btnTaskChange"

        switch (props.task.type) {
            case 'module':
                return(
                    <Link key={"task"+props.task.taskID} className={clasNames} to={replace(props.task.val)}>{comp}</Link>
                )
            case 'graph':
                return(
                    <Link key={"task"+props.task.taskID} className={clasNames} to={props.task.val}>{comp}</Link>
                )
            case 'scada':
                return(
                    <Link key={"task"+props.task.taskID} className={clasNames} to={props.task.val}>{comp}</Link>
                );
            case 'add':
                return(
                    <button key={"taskAddBtn_PosY"+props.posY} data-catID={props.catID} data-position={props.posX+':'+props.posY} className={"task col-md-1 btnISuccess"} >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                );
            default:
                return(<></>);
        }
    }

    function getImg(props){
        return(
            <img src={props.task.picture} alt={props.task.name} title={props.task.name} className={"taskPic"}/>
        );
    }

    function linkBtn(){
        return(
            <FontAwesomeIcon icon={faExternalLink} />
        );
    }

    function showTask(props){
        // eslint-disable-next-line default-case
        if(!props.editMode)
            return(
                <>
                {getLink(props, getImg(props))}
                </>
            );
        else
            return(
                <div className="task taskBackdropPre "  data-catID={props.task.catID} data-position={props.task.posX + ':' + props.task.posY} title={props.task.name}>
                    <img src={props.task.picture} alt={props.task.name} title={props.task.name} className={"taskPic"}/>

                    <div className="taskBackdrop d-flex justify-content-center align-items-center">
                       <Button variant="default" className="btnISuccess btnTaskChanger">
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </Button>
                        {getLink(props, linkBtn())}
                        <Button variant="default" className="btnIDanger btnTaskChanger" >
                              <FontAwesomeIcon icon={faTimes} />
                        </Button>
                    </div>
                </div>
            )
    }

    return (
        <>
            {showTask(props)}
        </>
    );
}

export default Task
