import React from "react"
import styles from "./ExamineePairBox.module.css"
import ExamineeBox from "./ExamineeBox"
import CommentButton from "./CommentButton"

/**
 * this is a box containing an Examinee pair.
 * 
 *   Props:
 *    pairNumber        @type {any} 	 the number for the pair.
 *    examineeLeftName  @type {String} 	 the name of the left examinee.
 *    examineeRightName @type {String} 	 the name of the right examinee.
 *    rowColor          @type {String} 	 the color of the row.
 * 
 * Example Usage:
 * <ExamineeBox 
 *  examineeName = "test person"/>
 *  onClickComment = console.log("button clicked")
 * 
 * @author Apelsin
 * @since 2024-05-07
 * @version 1.0 
 */

export default function ExamineePairBox({
    pairNumber,
    examineeLeftName,
    examineeRightName,
    rowColor
}) {
	

	return (
		<fieldset className={styles.pairbox} style={{backgroundColor: rowColor}}>
            <div className={styles.pairinfo}>
                <p style={{ fontSize: "12px"}}>Par {pairNumber}</p>
                <CommentButton/>
            </div>
            <div className={styles.pair}>
                <div className={styles.pairleft}>
                    <ExamineeBox examineeName={examineeLeftName} onClickComment={() => console.log("CommentButton clicked")} />
                </div>
                <div className={styles.pairright}>
                    <ExamineeBox examineeName={examineeRightName} onClickComment={() => console.log("CommentButton clicked")} />
                </div>
            </div>
           
</fieldset>
	)
}

