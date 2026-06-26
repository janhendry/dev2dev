interface CodeBlockProps {
	code: string;
}

// Stellt ein Code-Snippet monospaced dar (mehrzeilig moeglich).
export default function CodeBlock({ code }: CodeBlockProps) {
	return (
		<pre className="code-block">
			<code>{code}</code>
		</pre>
	);
}
