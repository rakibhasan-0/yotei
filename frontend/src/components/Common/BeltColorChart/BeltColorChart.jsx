import React from "react"
import styles from "./BeltColorChart.module.css"

import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Title,
} from "chart.js"

import { Bar } from "react-chartjs-2"

ChartJS.register(BarElement,CategoryScale, LinearScale, Tooltip,Title)

/** 
 * BeltColorChart is a component that displays a bar chart of belt colors.
 * @input beltColorsData: An object containing belt colors as keys and their counts as values
 *
 * @author Team Coconut (Gabriel Morberg)
 * @since 2024-05-06
*/

export default function BeltColorChart({ beltColorsData }) {
	// Assuming beltColorsData is an object containing belt colors as keys and their counts as values
	const labels = Object.keys(beltColorsData)
	const data = Object.values(beltColorsData)

	const colors = labels.map((color) => {
		const colorMap = {
			"Vitt": "rgba(255, 255, 255, 1)",
			"Gult": "rgba(255, 255, 0, 1)",
			"Orange": "rgba(255, 165, 0, 1)",
			"Grönt": "rgba(0, 128, 0, 1)",
			"Blått": "rgba(0, 0, 255, 1)",
			"Brunt" : "rgba(139, 69, 19, 1)",
			"Svart" : "rgba(0, 0, 0, 1)",
			// Add more colors to the color map as needed
		}
		return colorMap[color]
	})

	const chartData = {
		labels: labels,
		datasets: [
			{
				backgroundColor: colors,
				borderColor: "rgba(0,0,0,1)",
				borderWidth: 1,
				data: data,
			},
		],
	}

	const chartOptions = {
		indexAxis: "x",
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				beginAtZero: true,
			},
		},

	}

	const verticalLinePlugin = {
		id: "verticalLine",
		afterDraw: (chart) => {
			const ctx = chart.ctx
			chart.data.datasets.forEach((dataset, datasetIndex) => {
				const meta = chart.getDatasetMeta(datasetIndex)
				meta.data.forEach((bar, index) => {
			  		const model = bar.tooltipPosition()
					console.log(dataset)
					// Draw a yellow vertical line on a black bar
					if (dataset.backgroundColor[index] === "black") {
						ctx.save()
						ctx.strokeStyle = "yellow" // Set line color
						ctx.lineWidth = 15 // Set line width
						ctx.beginPath()
						ctx.moveTo(model.x, bar.y) // Start at the top of the bar
						ctx.lineTo(model.x, bar.base) // End at the bottom
						ctx.stroke()
						ctx.restore()
					}
				})
			})
		},
	}
	return (
		<div className = {styles.chart}>
			<Bar data={chartData} options={chartOptions} plugins={[verticalLinePlugin]}/>
		</div>
	)
}

