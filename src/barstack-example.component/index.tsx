import { AxisBottom } from "@visx/axis";
import { Grid } from "@visx/grid";
import { Group } from "@visx/group";
import { LegendOrdinal } from "@visx/legend";
import cityTemperature, { CityTemperature } from "@visx/mock-data/lib/mocks/cityTemperature";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStack } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { defaultStyles, useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { timeFormat, timeParse } from "d3-time-format";
import React, { FC } from "react";

type CityName = "New York" | "San Francisco" | "Austin";

interface ITooltipData {
	bar: SeriesPoint<CityTemperature>;
	key: CityName;
	index: number;
	height: number;
	width: number;
	x: number;
	y: number;
	color: string;
}

export interface IBarStackExampleProps {
	className?: string;
	width: number;
	height: number;
	margin?: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
}

const purple1 = "#6c5efb";
const purple2 = "#c998ff";
const purple3 = "#a44afe";

const data = cityTemperature.slice(0, 12);
const keys = Object.keys(data[0]).filter((d) => d !== "date") as CityName[];

const temperatureTotals = data.reduce((allTotals, currentDate) => {
	const totalTemperature = keys.reduce((dailyTotal, k) => {
		dailyTotal += Number(currentDate[k]);

		return dailyTotal;
	}, 0);

	return [...allTotals, totalTemperature];
}, [] as number[]);

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b %d");
const formatDate = (date: string) => format(parseDate(date) as Date);

const dateScale = scaleBand({
	domain: data.map((d) => d.date),
	padding: 0.2
});
const temperatureScale = scaleLinear<number>({
	domain: [0, Math.max(...temperatureTotals)],
	nice: true
});
const colorScale = scaleOrdinal({
	domain: keys,
	range: [purple1, purple2, purple3]
});

export const BarStackExample: FC<IBarStackExampleProps> = ({
	className,
	width,
	height,
	margin = {
		top: 40,
		right: 0,
		bottom: 0,
		left: 0
	}
}) => {
	const {
		tooltipOpen,
		tooltipLeft,
		tooltipTop,
		tooltipData,
		hideTooltip,
		showTooltip
	} = useTooltip<ITooltipData>();

	const { containerRef, TooltipInPortal } = useTooltipInPortal();

	if (width < 10) {
		return null;
	}

	const xMax = width;
	const yMax = height - margin.top - 100;

	dateScale.rangeRound([0, xMax]);
	temperatureScale.range([yMax, 0]);

	return (
		<div className={className} style={{ position: "relative" }}>
			<svg ref={containerRef} width={width} height={height}>
				<rect x={0} y={0} width={width} height={height} fill="#eaedff" rx={14} />
				<Grid
					top={margin.top}
					left={margin.left}
					xScale={dateScale}
					yScale={temperatureScale}
					width={xMax}
					height={yMax}
					stroke="black"
					strokeOpacity={0.1}
					xOffset={dateScale.bandwidth() / 2}
				/>
				<Group top={margin.top}>
					<BarStack<CityTemperature, CityName>
						data={data}
						keys={keys}
						x={(d) => d.date}
						xScale={dateScale}
						yScale={temperatureScale}
						color={colorScale}
					>
						{(barStacks) =>
							barStacks.map((barStack) =>
								barStack.bars.map((bar) => (
									<rect
										key={`${barStack.index}-${bar.index}`}
										x={bar.x}
										y={bar.y}
										height={bar.height}
										width={bar.width}
										fill={bar.color}
										onMouseLeave={hideTooltip}
										onMouseMove={(event) => {
											const top = event.clientY - margin.top;
											const left = bar.x + bar.width / 2;

											showTooltip({
												tooltipData: bar,
												tooltipTop: top,
												tooltipLeft: left
											});
										}}
									/>
								))
							)
						}
					</BarStack>
				</Group>
				<AxisBottom
					top={yMax + margin.top}
					scale={dateScale}
					tickFormat={formatDate}
					stroke={purple3}
					tickStroke={purple3}
					tickLabelProps={() => ({
						fill: purple3,
						fontSize: 11,
						textAnchor: "middle"
					})}
				/>
			</svg>
			<div
				style={{
					position: "absolute",
					top: margin.top / 2 - 10,
					width: "100%",
					display: "flex",
					justifyContent: "center",
					fontSize: "14px"
				}}
			>
				<LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" />
			</div>
			{tooltipOpen && tooltipData && (
				<TooltipInPortal
					key={Math.random()} // update tooltip bounds each render
					top={tooltipTop}
					left={tooltipLeft}
					style={{
						...defaultStyles,
						minWidth: 60,
						backgroundColor: "rgba(0, 0, 0, 0.9)",
						color: "white"
					}}
				>
					<div style={{ color: colorScale(tooltipData.key) }}>
						<strong>{tooltipData.key}</strong>
					</div>
					<div>{tooltipData.bar.data[tooltipData.key]}℉</div>
					<div>
						<small>{formatDate(tooltipData.bar.data.date)}</small>
					</div>
				</TooltipInPortal>
			)}
		</div>
	);
};
