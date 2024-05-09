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
	console.log(beltColorsData)
	const colors = labels.map((color) => {
		const colorMap = {
			"Grundläggande" : "rgba(255, 255, 255, 1)",
			"Vitt": "rgba(255, 255, 255, 1)",
			"Gult": "rgba(255, 255, 0, 1)",
			"Gult_barn" : "rgba(255, 255, 0, 1)",
			"Orange": "rgba(255, 165, 0, 1)",
			"Orange_barn" : "rgba(255, 165, 0, 1)",
			"Grönt": "rgba(0, 128, 0, 1)",
			"Grönt_barn" : "rgba(0, 128, 0, 1)",
			"Blått": "rgba(0, 0, 255, 1)",
			"Blått_barn" : "rgba(0, 0, 255, 1)",
			"Brunt" : "rgba(139, 69, 19, 1)",
			"Brunt_barn" : "rgba(139, 69, 19, 1)",
			"Svart" : "rgba(0, 0, 0, 1)",
			"1_Dan" : "rgba(255, 215, 0, 1)",
			"2_Dan" : "rgba(255, 215, 0, 1)",
			"3_Dan" : "rgba(255, 215, 0, 1)",
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
				barColors : labels.map((color) => {
					return color;
				}),
			},
		],
	}

	const chartOptions = {
		indexAxis: "y",
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				beginAtZero: true,
			},
		},

	}

	const horizontalLinePlugin = {
		id: "horizontalLine",
		afterDraw: (chart) => {
			const ctx = chart.ctx
			console.log(chart)
			chart.data.datasets.forEach((dataset, datasetIndex) => {
				const meta = chart.getDatasetMeta(datasetIndex)

				meta.data.forEach((bar, index) => {
			  		const model = bar.tooltipPosition()
					switch (dataset.barColors[index]) {
						case "Grundläggande":
							ctx.fillStyle = "black"
							break
						case "Vitt":
							ctx.fillStyle = "white"
							break
						case "Gult":
							ctx.fillStyle = "yellow"
							break
						case "Orange":
							ctx.fillStyle = "orange"
							break
						case "Grönt":
							ctx.fillStyle = "green"
							break
						case "Blått":
							ctx.fillStyle = "blue"
							break
						case "Brunt":
							ctx.save()
							ctx.strokeStyle = "yellow"
							ctx.lineWidth = 15 
							ctx.beginPath()
							ctx.moveTo(bar.x, model.y) 
							ctx.lineTo(bar.base, model.y)
							ctx.stroke()
							ctx.restore()
							break
						case "Svart":
							ctx.fillStyle = "black"
							break
						case "1_Dan":
							ctx.fillStyle = "gold"
							break
						case "2_Dan":
							ctx.fillStyle = "gold"
							break
						case "3_Dan":
							ctx.fillStyle = "gold"
							break
						default:
							ctx.fillStyle = "black"
					}
					
				})
			})
		},
	}
	return (
		<div className = {styles.chart}>
			<Bar data={chartData} options={chartOptions} plugins={[horizontalLinePlugin]}/>
		</div>
	)
}

