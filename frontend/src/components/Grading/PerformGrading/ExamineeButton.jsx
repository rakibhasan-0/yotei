import React, { useState } from "react"
import styles from "./ExamineeButton.module.css"

/**
 * A button that should be used on an examinee during the grading.
 * 
 * The props object accepts an onClick handler for button presses.
 * Contents should be specified as a child, which can be any type 
 * of element, such as text or an icon.
 * 
 *   Props:
 *    id, type, onClick, width, children
 *    id 		    @type {String}   An id for the button
 *    type     	@type {String}   A string "red" or "green" to choose the type of button 
 *    onClick   @type {Function} A function that will run when the button is clicked.
 *    width	   	@type {String}   A custom width to overrun default (100%) width
 *    children  @type {JSX} 	   A jsx-element to be shown in the button 
 * 
 * Example Usage:
 * <ExamineeButton 
 *     id="pass-button"
 *     type="green"
 *     onClick={() => console.log("Pressed pass button")}
 *     width="50%">
 *     <p>G</p>
 * </ExamineeButton>
 * 
 * The parent container using this button must constrain its width.
 * 
 * @author Apelsin
 * @since 2024-05-03
 * @version 1.0 
 */

// ExamineeButton.jsx
const ExamineeButton = ({ id, type, onClick, isSelected, width, children }) => {
    const style = { width: width || "50%" };

    const buttonType = () => {
        switch (type) {
            case "red":
                return isSelected ? styles.buttonRed : styles.buttonWhite;
            case "green":
                return isSelected ? styles.buttonGreen : styles.buttonWhite;
            default:
                return styles.buttonWhite;
        }
    };

    return (
        <button
            id={id}
            className={`${styles.buttonDefault} ${buttonType()}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </button>
    );
};

export default ExamineeButton