import React from "react"

import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js"

import { Bar } from "react-chartjs-2"

ChartJS.register(BarElement,CategoryScale, LinearScale, Tooltip, Legend)


export default function BeltColorChart({ beltColorsData }) {
	// Assuming beltColorsData is an object containing belt colors as keys and their counts as values
	const labels = Object.keys(beltColorsData)
	const data = Object.values(beltColorsData)

	const chartData = {
		labels: labels,
		datasets: [
			{
				label: "Belt Colors",
				backgroundColor: "rgba(75,192,192,1)",
				borderColor: "rgba(0,0,0,1)",
				borderWidth: 1,
				data: data,
			},
		],
	}

	const chartOptions = {
		indexAxis: "y",
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

