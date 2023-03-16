import { useEffect, useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";

export default function Home() {
	const [search, setSearch] = useState("");
	const [maxVals, setMaxVals] = useState([]);

	const [maxValue, setMaxValue] = useState(0);

	const [devices, setDevices] = useState([]);
	const [selectedDevice, setSelectedDevice] = useState();

	async function getDevices() {
		navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
			navigator.mediaDevices.enumerateDevices().then((devices) => {
				const audioinputdevices = devices.filter(
					(device) =>
						device.kind === "audioinput" &&
						!device.label.includes("Virtual")
				);
				console.log(audioinputdevices);
				setDevices(audioinputdevices);
			});
		});
	}

	function listen() {}

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>Search food</ion-title>

					<ion-buttons slot="end">
						<ion-button>Order By</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense" translucent>
					<ion-toolbar>
						<ion-title size="large">Feed</ion-title>
					</ion-toolbar>
					<ion-toolbar>
						<IonSearchbar
							value={search}
							onChange={(e) => setSearch(e.detail.value)}
							placeholder="Search Food"
							animated
							show-cancel-button="focus"
						/>
					</ion-toolbar>
				</ion-header>

				<ion-button
					color="tertiary"
					onClick={() => {
						getDevices();
					}}
					// 	navigator.mediaDevices
					// 		.getUserMedia({ audio: true })
					// 		.then(function (stream) {
					// 			// Get the list of available input devices
					// 			navigator.mediaDevices
					// 				.enumerateDevices()
					// 				.then(function (devices) {
					// 					// Find the device with the label that contains the word "headset" or "headphone"
					// 					const headsetDevice = devices.find(
					// 						function (device) {
					// 							return (
					// 								device.kind ===
					// 									"audioinput" &&
					// 								device.label.match(
					// 									/(headset|headphone)/i
					// 								)
					// 							);
					// 						}
					// 					);

					// 					// Use the headset device as the input source if it is found, otherwise use the default device
					// 					const audioContext = new AudioContext();
					// 					const audioSource =
					// 						audioContext.createMediaStreamSource(
					// 							stream
					// 						);
					// 					const inputSource = headsetDevice
					// 						? audioContext.createMediaStreamSource(
					// 								stream.clone({
					// 									audio: {
					// 										deviceId:
					// 											headsetDevice.deviceId,
					// 									},
					// 								})
					// 						  )
					// 						: audioSource;

					// 					// Create a script processor node with a buffer size of 4096 samples
					// 					const scriptProcessorNode =
					// 						audioContext.createScriptProcessor(
					// 							4096,
					// 							1,
					// 							1
					// 						);

					// 					// Connect the input source to the processing node and the processing node to the output
					// 					inputSource.connect(
					// 						scriptProcessorNode
					// 					);
					// 					scriptProcessorNode.connect(
					// 						audioContext.destination
					// 					);

					// 					// Add an event listener to the script processor node's audio processing function to process the microphone input
					// 					scriptProcessorNode.onaudioprocess =
					// 						function (event) {
					// 							// Process the microphone input here
					// 							const inputBuffer =
					// 								event.inputBuffer;
					// 							const inputData =
					// 								inputBuffer.getChannelData(
					// 									0
					// 								);
					// 							console.log(
					// 								Math.max(...inputData)
					// 							);
					// 							const newMax = Math.max(
					// 								...inputData
					// 							);
					// 							setMaxVals((prev) => [
					// 								newMax,
					// 								...prev,
					// 							]);
					// 							// console.log(inputData);
					// 						};
					// 				})
					// 				.catch(function (error) {
					// 					console.error(
					// 						"Error enumerating devices: " +
					// 							error
					// 					);
					// 				});
					// 		})
					// 		.catch(function (error) {
					// 			console.error(
					// 				"Error getting user media: " + error
					// 			);
					// 		});
					// }}
				>
					Get Devices
				</ion-button>
				<br />
				<br />
				<br />
				<h2>Listen to:</h2>

				{devices?.map((device) => (
					<div
						style={{ marginBottom: 20 }}
						// onClick={() => setSelectedDevice(device)}
					>
						<ion-button
							onClick={() => {
								const constraints = {
									audio: {
										deviceId: {
											exact: device.deviceId,
										},
									},
								};
								navigator.mediaDevices
									.getUserMedia(constraints)
									.then((stream) => {
										const audioContext = new AudioContext();
										const source =
											audioContext.createMediaStreamSource(
												stream
											);
										const analyser =
											audioContext.createAnalyser();
										source.connect(analyser);

										const bufferLength =
											analyser.frequencyBinCount;
										const dataArray = new Float32Array(
											bufferLength
										);

										const updateMaxValue = () => {
											analyser.getFloatFrequencyData(
												dataArray
											);
											const currentMaxValue = Math.max(
												...dataArray
											);
											setMaxValue(
												currentMaxValue.toFixed(3)
											);
										};

										const intervalId = setInterval(
											updateMaxValue,
											40
										);

										// return () => {
										// 	clearInterval(intervalId);
										// 	source.disconnect();
										// 	analyser.disconnect();
										// 	audioContext.close();
										// };
									})
									.catch((error) => {
										console.error(error);
									});
							}}
						>
							{device.label}
						</ion-button>
						<br />
						<>id: {device.deviceId}</>
					</div>
				))}

				<br />
				<br />
				<h2>Selected: {selectedDevice?.label}</h2>
				<br />
				<br />
				<br />

				{maxValue}

				{/* <Graph /> */}
			</ion-content>
		</>
	);
}

function Graph(props) {
	const data = props.data;
	const barWidth = 40;
	const graphHeight = 200;
	const maxValue = Math.max(...data);

	return (
		<svg width="300" height="300">
			{data.map((value, index) => {
				const barHeight = (value / maxValue) * graphHeight;
				const x = index * barWidth + 10;
				const y = graphHeight - barHeight + 50;

				return (
					<rect
						key={index}
						x={x}
						y={y}
						width={barWidth - 10}
						height={barHeight}
						fill="#2196f3"
					/>
				);
			})}
		</svg>
	);
}
