import classNames from "classnames";

function Flex(props) {
	return (
		<div {...props} className={`flex ${props.className}`}>
			{props.children}
		</div>
	);
}

function Row(props) {
	const config = {
		"flex-row": true,
		"items-center": props.center,
		"justify-between": props.center,
	};
	const classes = classNames(config);

	return (
		<Flex {...props} className={`${props.className} ${classes} `}>
			{props.children}
		</Flex>
	);
}

function Column(props) {
	const config = {
		"flex-col": true,
		[props.className]: true,
	};
	const classes = classNames(config);
	return (
		<Flex className={`${classes} ${props.className}`}>
			{props.children}
		</Flex>
	);
}

export { Flex, Row, Column };
