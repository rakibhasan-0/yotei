import React from "react"
import ReactPlayer from "react-player"

// Render a YouTube video player or local file

export default function VideoPlayerReactPlayer({ path }) {
	// return <ReactPlayer url={path} />;
	return (
		<div className="player-wrapper">
			<ReactPlayer
				className="react-player fixed-bottom"
				url={path}
				width="100%"
				height="100%"
				controls={true}
			/>
		</div>
	)
}
