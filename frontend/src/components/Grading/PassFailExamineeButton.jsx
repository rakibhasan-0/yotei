import React, { useState } from 'react';
import styles from './PassFailExamineeButton.module.css';

/**
 * A pass or fail button that should be used during the grading.
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
 * <PassExamineeButton 
 *     id="pass-button"
 *     type="green"
 *     onClick={() => console.log("Pressed pass button")}
 *     width="50%">
 *     <p>G</p>
 * </PassExamineeButton>
 * 
 * The parent container using this button must constrain its width.
 * 
 * @author Apelsin
 * @since 2024-05-02
 * @version 1.0 
 */

const PassExamineeButton = ({ id, type, onClick, width, children }) => {
  const [hasColor, setColor] = useState(false);

  const toggleColor = () => {
    setColor(!hasColor);
  };

  const style = width ? { width } : { width: "100%" };

  const buttonType = () => {
    switch (type) {
      case "red":
        return hasColor ? styles.buttonRed : styles.buttonWhite;
      case "green":
        return hasColor ? styles.buttonGreen : styles.buttonWhite;
      default:
        return hasColor ? styles.buttonWhite : styles.buttonWhite;
    }
  };

  return (
    <button
      id={id}
      className={`${styles.buttonDefault} ${buttonType()}`}
      onClick={() => {
        toggleColor();
        if (onClick) {
          onClick();
        }
      }}
      style={style}
    >
      {children}
    </button>
  );
};

export default PassExamineeButton;
