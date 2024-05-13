
import styles from "./TagUsagePopup.module.css"

export default function TagUsagePopup (usage) {
	usage = usage.usage
	return <div className={styles["usage-text"]}>
        Taggen används på:
		<br/>

		{usage.exercises > 0 ? <> <span className={styles["usage-number"]}>{usage.exercises}</span> övning{usage.exercises > 1 ? "ar" : ""}
			<br/> </> : null}
		{usage.techniques > 0 ? <><span className={styles["usage-number"]}>{usage.techniques}</span> teknik{usage.techniques > 1 ? "er" : ""}
			<br/>  </> : null}
		{usage.workouts > 0 ? <><span className={styles["usage-number"]}>{usage.workouts}</span> pass
			<br/>	</> : null}
	</div>
}
