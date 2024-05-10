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
	
	const labels = Object.keys(beltColorsData).map((name) => {
		if (name.endsWith("_c")) {
			//Remove child belt identifier
			return name.substring(0, name.length-2)
		} 

		return name // Default case when no other case matches
	})
	const data = Object.values(beltColorsData).map((obj) => {
		return obj.count
	})

	const hexToRGBstring = (hex) => {
		// Ensure the hex code is exactly 6 characters
		if (hex.length !== 6) {
			// Default to black if the hex length is not correct
			return "rgba(0, 0, 0, 1)"
		} else {
			// Parse the hex string to extract RGB components
			const r = parseInt(hex.substring(0, 2), 16) // Extract and convert the red component
			const g = parseInt(hex.substring(2, 4), 16) // Extract and convert the green component
			const b = parseInt(hex.substring(4, 6), 16) // Extract and convert the blue component
	
			// Return the RGBA string with full opacity
			return `rgba(${r}, ${g}, ${b}, 1)`
		}
	}


	const colors = Object.values(beltColorsData).map((obj) => {
		return hexToRGBstring(obj.color)	
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
					return color
				}),
			},
		],
	}

	const childBeltIndicies = Object.values(beltColorsData).map((obj) => {
		return obj.isChild
	})

	const chartOptions = {
		indexAxis: "y",
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				beginAtZero: true,
			},
		},
		plugins: {
			horizontalLinePlugin: {
				childBeltIndicies:  childBeltIndicies,
			},
		},
	}


	const drawBeltLine = (ctx, bar, model, color, offset) => {
		ctx.save()
		ctx.strokeStyle = color
		ctx.lineWidth = bar.height/8
		ctx.beginPath()
		ctx.moveTo(bar.x, model.y+(offset*ctx.lineWidth)) 
		ctx.lineTo(bar.base, model.y+(offset*ctx.lineWidth))
		ctx.stroke()
		ctx.restore()
	}

	const drawChildBelt = (ctx, bar, model) => {
		ctx.save()
		ctx.strokeStyle = "white"
		const barWidth = bar.height/5
		ctx.lineWidth = bar.height/2 - (1 + barWidth/2)
		ctx.beginPath()
		ctx.moveTo(bar.x-1, model.y - (ctx.lineWidth/2)-barWidth/2) 
		ctx.lineTo(bar.base, model.y - (ctx.lineWidth/2)-barWidth/2)
		ctx.stroke()

		ctx.beginPath()
		ctx.moveTo(bar.x-1, model.y + (ctx.lineWidth/2)+barWidth/2) 
		ctx.lineTo(bar.base, model.y + (ctx.lineWidth/2)+barWidth/2)
		ctx.stroke()
		ctx.restore()
	}

	const horizontalLinePlugin = {
		id: "horizontalLinePlugin",
		afterDraw: (chart, args, options) => {
			const ctx = chart.ctx
			const childBeltIndicies = options.childBeltIndicies || [];
			chart.data.datasets.forEach((dataset, datasetIndex) => {
				const meta = chart.getDatasetMeta(datasetIndex)

				meta.data.forEach((bar, index) => {
					const model = bar.tooltipPosition()
					
					if (childBeltIndicies[index]) {
						drawChildBelt(ctx, bar, model)
					}
					switch (dataset.barColors[index]) {
					case "1 Dan":
						drawBeltLine(ctx, bar, model, "gold", 0)
						break
					case "2 Dan":
						drawBeltLine(ctx, bar, model, "gold", -1)
						drawBeltLine(ctx, bar, model, "gold", 1)
						break
					case "3 Dan":
						drawBeltLine(ctx, bar, model, "gold", -2)
						drawBeltLine(ctx, bar, model, "gold", 0)
						drawBeltLine(ctx, bar, model, "gold", 2)
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
			<Bar height={300} data={chartData} options={chartOptions} plugins={[horizontalLinePlugin]}/>
		</div>
	)
}

