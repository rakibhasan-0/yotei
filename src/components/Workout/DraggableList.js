import * as React from "react";
import Moveable from "react-moveable";
import "./DraggableList.css"
import {useState, useEffect, useRef} from "react";
import { List } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import DraggableContent from "./DraggableContent";
import Modal from "react-bootstrap/Modal";
import WorkoutActivitySelection from "./WorkoutActivitySelection"

/**
 * Draggable list component.
 * Based on: https://codesandbox.io/s/w4bxv?file=/src/App.tsx
 * @Author Team 8 Kebab pizza 4/5-2022
 */

const EditWorkout = ({startActivities, updateOutputArray}) => {
    let act = startActivities ? startActivities : []
    const [elements, setElements] = useState(act);
    const prevElements = useRef(elements);
    const containerHeight = useRef(0);

    //Triggered on load.
    useEffect(() => {
        updateComponent();
        setElements([...elements]);
    }, []);

    //Triggered when an element is added or removed.
    useEffect(() => {
        if(prevElements.current.length > elements.length){//Element removed
            let removedPos = -1;

            for (let i = 0; i < elements.length; i++) {
                if(prevElements.current[i].id !== elements[i].id){
                    removedPos = prevElements.current[i].order;
                }
            }

            if(removedPos !== -1) {
                document.querySelector("#list-element" + prevElements.current[prevElements.current.length - 1].id).setAttribute("state", "none");
            } else {
                removedPos = prevElements.current[prevElements.current.length - 1].order;
            }

            for (let i = 0; i < elements.length; i++) {
                if (elements[i].order > removedPos) {
                    elements[i].order--;
                }
            }

            document.querySelector(".draggable-list").style.transitionDuration = "0.2s"
        } else {//Element added
            document.querySelector(".draggable-list").style.transitionDuration = "0s"

            let newElementHeight
            if(elements.length !== 0){
                newElementHeight = document.querySelector("#list-element" + elements[elements.length-1].id).clientHeight;
            }

            window.scrollTo(window.scrollX, window.scrollY + newElementHeight);
        }

        updateComponent();
        prevElements.current = [...elements];
        setElements([...elements]);

    }, [elements.length]);


    //Moves the given element to the given position and moves relevant elements
    //up or down in order to fill the void lef by the initial element in the list.
    function moveElement(element, order) {
        if (order < element.order) {
            for (let i = 0; i < elements.length; i++) {
                if(elements[i].order < element.order && elements[i].order >= order){
                    elements[i].order++;
                }
            }
        } else if(order > element.order) {
            for (let i = 0; i < elements.length; i++) {
                if(elements[i].order > element.order && elements[i].order <= order){
                    elements[i].order--;
                }
            }
        }
        element.order = order;
    }

    //Updates the elements' yPos variable to match their position in the list.
    function updateYPos(exceptId){
        let offset = 0;
        for (let i = 0; i < elements.length; i++) {
            for (let j = 0; j < elements.length; j++) {
                if(elements[j].order === i) {

                    if(elements[j].id !== exceptId){
                        elements[j].yPos = offset;
                    }

                    offset += elements[j].height+1;
                    break;
                }
            }
        }
    }

    //Updates the elements' height variable to match their container height on screen.
    function updateHeight(){
        for (let i = 0; i < elements.length; i++) {
            const elementRef = document.querySelector("#list-element" + elements[i].id);
            if(elementRef != null) {
                elements[i].height = elementRef.clientHeight;
            }
        }
    }

    //Adds together the height of all element in the list in order to find
    //the right container height for the list on screen.
    function updateContainerHeight() {
        let totalElementHeight = 0;
        for (let i = 0; i < elements.length; i++) {totalElementHeight += elements[i].height;}
        totalElementHeight += elements.length-1;
        containerHeight.current = totalElementHeight;
        document.querySelector(".draggable-list").style.height = `${containerHeight.current+2}px`
    }

    //Calculates what position the element should have according to the given Y value.
    function calcPos(element, y){
        let offset = 0;

        for (let i = 0; i < elements.length; i++) {
            if(elements[i].id !== element.id) {
                offset = (y + (element.height/2)) - (elements[i].yPos+elements[i].height/2);
                if(Math.abs(offset) < (element.height/2)){
                    return elements[i].order;
                }
            }
        }

        return element.order;
    }

    //Updates the position of the element containers on screen.
    function updateTranslate(){

        for (let i = 0; i < elements.length; i++) {
            document.querySelector("#list-element" +
                elements[i].id).style.transform = `translate(0px, ${elements[i].yPos}px)`
        }
    }

    //Full update of the components state.
    function updateComponent(){
        updateHeight();
        updateYPos(-1);
        updateContainerHeight();
        updateTranslate();
        updateOutputArray([...elements]);
    }

    //Returns an id that is not used by any element in the list.
    function getUniqueId(){
        let firstFreeId=1;
        let uniqueId = false;
        while (!uniqueId){
            uniqueId = true;
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].id === firstFreeId){
                    uniqueId = false;
                    firstFreeId++;
                    break;
                }
            }
        }
        return firstFreeId;
    }

    //Adds new activity elements.
    function addActivities(activities){
        activities.map(activity => {
            elements.push({name: activity.name, duration: activity.duration ? activity.duration : 0, workoutId:null, id:getUniqueId(), exerciseId: activity.exerciseId, techniqueId: activity.techniqueId, order:elements.length, yPos:0, height: 0, activity: true})
            setElements([...elements]);
        })
        
        updateYPos(-1);
    }

    //Adds new text element.
    function addText(){
        elements.push({name:"", duration:0, workoutId:null, id:getUniqueId(), exerciseId: null, techniqueId: null, order:elements.length, yPos:0, height: 0, activity: false})
        setElements([...elements]);
        updateYPos(-1);
    }

    function dragStart(element, set) {
        set([0 , element.yPos]);

        document.querySelector("#list-element" + element.id).setAttribute("state","isDragged-true");
        for (let i = 0; i < elements.length; i++) {
            document.querySelector("#list-element" + elements[i].id + " > .list-element-content").setAttribute("state", "none");
        }
        updateHeight();
    }

    function drag(element, dragPosY){
        //Limit movement area
        if (dragPosY < 0) {
            dragPosY = 0;
        }
        if (dragPosY > (containerHeight.current-element.height)) {
            dragPosY = (containerHeight.current-element.height);
        }

        //Find hover position
        const order = calcPos(element, dragPosY);

        if (order !== element.order) {
            moveElement(element, order);
            updateYPos(element.id);
        }

        element.yPos = dragPosY;
    }

    function dragEnd(element) {
        document.querySelector("#list-element" + element.id).setAttribute("state", "none");
        updateYPos(-1);
        updateTranslate();
        updateOutputArray([...elements]);
        setElements([...elements]);
    }


    const [popupDisplayed, setPopup] = useState(false);
    const closePopup = () => setPopup(false);

    return (
        <>
            {elements.length === 0 ? "Passet innehåller ingen aktivitet" : null}
            <div className="draggable-list">
                {elements.map((element) => (
                    <div className="list-element" id={"list-element" + element.id} key={element.id} style={{transform: "translate(0px, " + element.yPos + "px)"}}>

                        <div className="list-element-drag-btn" id={"drag-btn" + element.id}>
                            <List/>
                        </div>

                        <Moveable
                            target={document.querySelector("#drag-btn" + element.id)}
                            draggable={true}
                            throttleDrag={0}

                            onDragStart={({set}) => {dragStart(element, set)}}
                            onDrag={({beforeTranslate}) => {drag(element, beforeTranslate[1])}}
                            onDragEnd={() => {dragEnd(element)}}
                            onRender={() => {updateTranslate();}}
                        />

                        <DraggableContent
                            element={element}
                            elements={elements}
                            setElements={setElements}
                            updateComponent={updateComponent}
                        />

                    </div>
                    ))}
            </div>

            <div className={"add-btn-container"}>
                <Button className="add-button btn-md" variant="inline" onClick={() => addText()}>+ Fri text</Button>
                <Button className="add-button btn-md" variant="inline" onClick={() => setPopup(true)}>+ Aktivitet</Button>
            </div>
            
            <Modal show={popupDisplayed} onHide={closePopup}>
                <WorkoutActivitySelection closePopup={closePopup} addActivities={addActivities}/>
            </Modal>
        </>
    );
}

export default EditWorkout;