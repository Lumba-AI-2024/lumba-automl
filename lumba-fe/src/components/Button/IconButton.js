export default function IconButton({ children, onClick, type }) {
	return (
		<button onClick={onClick} type={type}>
			{children}
		</button>
	);
}
