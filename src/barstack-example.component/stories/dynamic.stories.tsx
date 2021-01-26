import { BarStackExample } from "@/barstack-example.component";
import { ParentSize } from "@visx/responsive";
import React, { FC } from "react";

export default {
	title: "bar-stack-example/dynamic",
	component: BarStackExample
};

export const Standard: FC = () => {
	return (
		<div style={{ height: 500, width: 800 }}>
			<ParentSize>
				{({ height, width }) => <BarStackExample height={height} width={width} />}
			</ParentSize>
		</div>
	);
};
