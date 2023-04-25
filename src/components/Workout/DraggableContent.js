import {Trash} from "react-bootstrap-icons";
import "./DraggableContent.css"

const DraggableListElement = ({element, elements, setElements, updateComponent}) => {

    /*Removes the given element by overwriting it with a copy of
    the last element in the list and then popping the last element.
    
    This method of removing was implemented because it generated the
    least amount of movement of the elements in the list because only
    two elements are affected.*/
    function removeElement(element){
        const index = elements.indexOf(element);
        if(index < 0){
            console.log("Error: Activity not found!");
            return;
        }

        //Hides the visible shuffling that takes place when copying the last element in the list to the element being removed.
        document.querySelector("#list-element" + elements[index].id).setAttribute("state", "snap");
        document.querySelector("#list-element" + elements[index].id).style.transform = `translate(0px, ${elements[elements.length-1].yPos}px)`

        elements[index] = [...elements][elements.length-1]; // swaps element in index with last element. 
       
        elements.pop();

        setElements([...elements]);
    }

    //Sets the time of an element but limits the time to be between 0 to 99.
    function setTime(element, newTime) {
        if(newTime < 0 || isNaN(newTime)) {newTime = 0;}
        if(newTime > 99) {newTime = 99;}
        element.duration = newTime;
        document.querySelector("#list-element" + element.id + " > .list-element-content > .content-popup > .content-popup-time > #edit-time > .counter").value = newTime;
        setElements([...elements]);
    }


    function setName(element, newName) {
        element.name = newName;
        updateComponent();
        setElements([...elements]);
    }


    function getTextContent(element){
        return(
            <div className="list-element-content">
                <div id="name">
                    <textarea className="form-control"
                        onBlur={event => {setName(element, event.target.value)}}
                        onInput={updateComponent}
                        defaultValue={element.name}
                        placeholder="Skriv text här"
                    />
                </div>

                {getTimeButton(element)}

                {getTrashButton(element)}

                {getContentPopup(element)}
            </div>
        )
    }

    function getActivityContent(element){
        return(
            <div className="list-element-content">
                <div id="name">
                    <h3>{(element.order + 1) + ". " + element.name}</h3>
                </div>

                {getTimeButton(element)}

                {getTrashButton(element)}

                {getContentPopup(element)}

            </div>
        )
    }

    function getContentPopup(element){
        return(
            <div className={"content-popup"}>
                <div className={"content-popup-trash"}>
                    <div onClick={() => {
                        document.querySelector("#list-element" + element.id + " > .list-element-content").setAttribute("state", "none")
                        removeElement(element)
                    }}><p>Ta bort</p></div>
                    <div onClick={() => {
                        document.querySelector("#list-element" + element.id + " > .list-element-content").setAttribute("state", "none")
                    }}><p>Avbryt</p></div>
                </div>

                <div className={"content-popup-time"}>
                    <div id={"edit-time"}>
                        <h3 id={"decrease"} onClick={()=>{
                            setTime(element, element.duration-1);

                            document.querySelector("#list-element" + element.id + " > .list-element-content > .content-popup > .content-popup-time > #edit-time > #increase").setAttribute("state", "active");
                            if(element.duration === 0){
                                document.querySelector("#list-element" + element.id + " > .list-element-content > .content-popup > .content-popup-time > #edit-time > #decrease").setAttribute("state", "inactive");
                            }
                        }}>-</h3>

                        <input type={"number"} className={"counter"} placeholder={element.duration} onInput={event=> {
                            setTime(element, parseInt(event.target.value));
                            if(element.duration === 0){
                                document.querySelector("#list-element" + element.id + " > .list-element-content > .content-popup > .content-popup-time > #edit-time > #decrease").setAttribute("state", "inactive");
                            } else {
                                document.querySelector("#list-element" + element.id + " > .list-element-content > .content-popup > .content-popup-time > #edit-time > #decrease").setAttribute("state", "active");
                            }

                            if(element.duration === 99){
                                document.querySelector("#list-element" + element.id + " > .list-element-content > .content-popup > .content-popup-time > #edit-time > #increase").setAttribute("state", "inactive");
                            } else {
                                document.querySelector("#list-element" + element.id + " > .list-element-content > .content-popup > .content-popup-time > #edit-time > #increase").setAttribute("state", "active");
                            }
                        }}></input>

                        <h3 id={"increase"} onClick={()=>{
                            setTime(element, element.duration+1);

                            document.querySelector("#list-element" + element.id + " > .list-element-content > .content-popup > .content-popup-time > #edit-time > #decrease").setAttribute("state", "active");
                            if(element.duration === 99){
                                document.querySelector("#list-element" + element.id + " > .list-element-content > .content-popup > .content-popup-time > #edit-time > #increase").setAttribute("state", "inactive");
                            }
                        }}>+</h3>
                    </div>

                    <div id={"done-btn"} onClick={() => {
                        document.querySelector("#list-element" + element.id + " > .list-element-content").setAttribute("state", "none");
                    }}><p>Klar</p></div>
                </div>
            </div>
        )
    }

    function getTimeButton(element){
        return(
            <div id="time" onClick={() => {
                for (let i = 0; i < elements.length; i++) {
                    document.querySelector("#list-element" + elements[i].id + " > .list-element-content").setAttribute("state","none");
                }
                document.querySelector("#list-element" + element.id + " > .list-element-content").setAttribute("state","time");
            }}>

                <h3 >{element.duration}<br/>min</h3>

            </div>
        )
    }

    function getTrashButton(element){
        return(
            <div id="trash" onClick={() => {
                for (let i = 0; i < elements.length; i++) {
                    document.querySelector("#list-element" + elements[i].id + " > .list-element-content").setAttribute("state","none");
                }
                document.querySelector("#list-element" + element.id + " > .list-element-content").setAttribute("state","remove");
            }}>
                <Trash />
            </div>
        )
    }

    return(<>{(element.exerciseId === null && element.techniqueId === null) ? getTextContent(element) : getActivityContent(element)}</>)
}

export default DraggableListElement;