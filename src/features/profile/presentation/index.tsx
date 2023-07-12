import { useGetUserQuery } from "../index";
//not being used.
export const UserProfile = () => {
	const { data, isLoading } = useGetUserQuery(
		"0x7c865c14f9dcDCbFd078C9eD10Be313f2e1012b9",
		{
			refetchOnMountOrArgChange: false,
		}
	);
	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Missing post!</div>;
	return (
		<div>
			<p>{data.name}</p>
			<p>{data.address}</p>
		</div>
	);
};
