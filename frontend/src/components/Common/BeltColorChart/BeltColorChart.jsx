import React from "react"

import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
} from "chart.js"

import { Bar } from "react-chartjs-2"

ChartJS.register(BarElement,CategoryScale, LinearScale, Tooltip)


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
			"Gul": "rgba(255, 255, 0, 1)",
			"Orange": "rgba(255, 165, 0, 1)",
			"Grön": "rgba(0, 128, 0, 1)"

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
		maintainAspectRatio: true,
		scales: {
			x: {
				beginAtZero: true,
			},
		},

	}

	return (
		<div>
			<Bar data={chartData} options={chartOptions} />
		</div>
	)
}

