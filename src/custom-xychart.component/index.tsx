import composeRefs from "@seznam/compose-react-refs";
import { AxisBottom } from "@visx/axis";
import { curveCardinal } from "@visx/curve";
import { localPoint } from "@visx/event";
import { Grid } from "@visx/grid";
import { Group } from "@visx/group";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { scaleLinear, scaleTime } from "@visx/scale";
import { Bar, Line, LinePath } from "@visx/shape";
import { defaultStyles, useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { bisector, extent, max } from "d3-array";
import { timeFormat } from "d3-time-format";
import React, { FC, MouseEvent, TouchEvent, useCallback, useMemo } from "react";

export interface ICustomXYChartExampleProps {
	className?: string;
	height: number;
	width: number;
	margin?: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
}

const data = appleStock.slice(800);

const purple1 = "#6c5efb";
const purple2 = "#c998ff";
const purple3 = "#a44afe";

const format = timeFormat("%b");
const formatDate = (date) => format(new Date(date));

const bisectDate = bisector<AppleStock, Date>((d) => new Date(d.date)).left;

export const CustomXYChart: FC<ICustomXYChartExampleProps> = ({
	className,
	height,
	width,
	margin = {
		top: 40,
		right: 0,
		bottom: 0,
		left: 0
	}
}) => {
	const {
		hideTooltip,
		showTooltip,
		tooltipData,
		tooltipTop,
		tooltipLeft
	} = useTooltip<AppleStock>();
	const { containerRef: containerRef1, TooltipInPortal: Tooltip1 } = useTooltipInPortal();
	const { containerRef: containerRef2, TooltipInPortal: Tooltip2 } = useTooltipInPortal();

	const containerRef = composeRefs(containerRef1, containerRef2);

	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const dateScale = useMemo(() => {
		return scaleTime({
			range: [margin.left, innerWidth + margin.left],
			domain: extent(data, (d) => new Date(d.date)) as [Date, Date]
		});
	}, [innerWidth, margin]);

	const stockValueScale = useMemo(() => {
		return scaleLinear({
			range: [innerHeight + margin.top, margin.top],
			domain: [0, (max(data, (d) => d.close) ?? 0) + innerHeight / 3],
			nice: true
		});
	}, [innerHeight, margin]);

	const handleTooltip = useCallback(
		(event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>) => {
			const { x } = localPoint(event) ?? { x: 0 };
			const x0 = dateScale.invert(x);
			const index = bisectDate(data, x0, 1);
			const d0 = data[index - 1];
			const d1 = data[index];

			const d = d1?.date
				? x0.valueOf() - new Date(d0.date).valueOf() >
				  new Date(d1.date).valueOf() - x0.valueOf()
					? d1
					: d0
				: d0;

			showTooltip({
				tooltipData: d,
				tooltipLeft: x,
				tooltipTop: stockValueScale(d.close)
			});
		},
		[dateScale, showTooltip, stockValueScale]
	);

	const xMax = width;
	const yMax = height - margin.top - 100;

	dateScale.rangeRound([0, xMax]);
	stockValueScale.range([yMax, 0]);

	return (
		<div className={className} style={{ position: "relative" }}>
			<svg ref={containerRef as any} height={height} width={width}>
				<rect x={0} y={0} height={height} width={width} fill="#eaedff" rx={14} />
				<Grid
					top={margin.top}
					left={margin.left}
					xScale={dateScale}
					yScale={stockValueScale}
					width={xMax}
					height={yMax}
					stroke="black"
					strokeOpacity={0.1}
				/>
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
				<LinePath
					data={data}
					x={(d) => dateScale(new Date(d.date) ?? 0)}
					y={(d) => stockValueScale(d.close ?? 0)}
					strokeWidth={1}
					stroke={purple3}
					curve={curveCardinal}
				/>
				<Bar
					x={margin.left}
					y={margin.top}
					width={innerWidth}
					height={innerHeight}
					fill="transparent"
					rx={14}
					onTouchStart={handleTooltip}
					onTouchMove={handleTooltip}
					onMouseMove={handleTooltip}
					onMouseLeave={hideTooltip}
				/>
				{tooltipData && (
					<Group>
						<Line
							from={{ x: tooltipLeft, y: margin.top }}
							to={{ x: tooltipLeft, y: innerHeight - margin.top }}
							stroke={purple2}
							strokeWidth={2}
							pointerEvents="none"
							strokeDasharray="5,2"
						/>
						<circle
							cx={tooltipLeft}
							cy={tooltipTop ?? 0 + 1}
							r={4}
							fill="black"
							fillOpacity={0.1}
							stroke="black"
							strokeOpacity={0.1}
							strokeWidth={2}
							pointerEvents="none"
						/>
						<circle
							cx={tooltipLeft}
							cy={tooltipTop}
							r={4}
							fill={purple1}
							stroke="white"
							strokeWidth={2}
							pointerEvents="none"
						/>
					</Group>
				)}
			</svg>
			{tooltipData && (
				<>
					<Tooltip1
						key={Math.random()}
						top={tooltipTop}
						left={tooltipLeft}
						style={{
							...defaultStyles,
							background: "#3b6978",
							border: "1px solid white",
							color: "white"
						}}
					>
						<span>Hello World~!</span>
					</Tooltip1>
					<Tooltip2
						key={Math.random()}
						top={innerHeight - margin.top}
						left={tooltipLeft}
						style={{
							...defaultStyles,
							minWidth: 72,
							textAlign: "center"
						}}
					>
						{tooltipData.date.toString()}
					</Tooltip2>
				</>
			)}
		</div>
	);
};
