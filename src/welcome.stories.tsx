import { Welcome } from "@storybook/react/demo";
import React from "react";

export default {
	title: "Welcome",
	component: Welcome
};

const Template = (args) => <Welcome {...args} />;
Template.args = {};

export const ToStorybook: any = Template.bind({});
ToStorybook.args = { ...Template.args };
