import { CustomXYChart } from "@/custom-xychart.component";
import { ParentSize } from "@visx/responsive";
import React, { FC } from "react";

export default {
	title: "custom-xy-chart/dynamic",
	component: CustomXYChart
};

export const Standard: FC = () => {
	return (
		<div style={{ height: 500, width: 800 }}>
			<ParentSize>
				{({ height, width }) => <CustomXYChart height={height} width={width} />}
			</ParentSize>
		</div>
	);
};
