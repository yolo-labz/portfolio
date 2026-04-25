interface FieldTableProps {
	fields: Record<string, unknown>;
	documentType: string;
}

function formatKey(key: string): string {
	return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function isCurrencyKey(key: string): boolean {
	return /amount|price|total|subtotal|tax/i.test(key);
}

function formatValue(key: string, value: unknown): string {
	if (value === null || value === undefined) return "\u2014";

	if (typeof value === "number") {
		if (isCurrencyKey(key)) {
			return new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(value);
		}
		return value.toLocaleString();
	}

	if (typeof value === "boolean") return value ? "Yes" : "No";

	if (typeof value === "string") {
		const dateMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
		if (dateMatch) {
			try {
				return new Date(value).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				});
			} catch {
				return value;
			}
		}
		return value;
	}

	return String(value);
}

function renderArray(items: unknown[]): React.ReactNode {
	if (items.length === 0) return <span className="text-text-muted">\u2014</span>;

	if (typeof items[0] === "object" && items[0] !== null) {
		const headers = Object.keys(items[0] as Record<string, unknown>);
		return (
			<div className="overflow-x-auto">
				<table className="w-full text-left text-xs">
					<thead>
						<tr className="border-b border-border">
							{headers.map((h) => (
								<th key={h} className="px-3 py-1.5 font-medium text-text-muted">
									{formatKey(h)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{items.map((item, i) => (
							<tr key={i} className="border-b border-border/50">
								{headers.map((h) => (
									<td key={h} className="px-3 py-1.5 font-mono text-text">
										{formatValue(h, (item as Record<string, unknown>)[h])}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<ul className="list-inside list-disc text-sm">
			{items.map((item, i) => (
				<li key={i} className="font-mono text-text">
					{String(item)}
				</li>
			))}
		</ul>
	);
}

function renderObject(obj: Record<string, unknown>): React.ReactNode {
	return (
		<div className="ml-2 border-l border-border/50 pl-3">
			{Object.entries(obj).map(([key, value]) => (
				<div key={key} className="py-1">
					<span className="text-xs text-text-muted">{formatKey(key)}: </span>
					{typeof value === "object" && value !== null && !Array.isArray(value) ? (
						renderObject(value as Record<string, unknown>)
					) : Array.isArray(value) ? (
						renderArray(value)
					) : (
						<span className="font-mono text-sm text-text">{formatValue(key, value)}</span>
					)}
				</div>
			))}
		</div>
	);
}

export function FieldTable({ fields, documentType }: FieldTableProps) {
	const entries = Object.entries(fields);

	if (entries.length === 0) {
		return (
			<div className="rounded-lg border border-border bg-bg-card p-6 text-center">
				<p className="text-sm text-text-muted">No extracted fields</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border border-border bg-bg-card">
			<div className="border-b border-border px-4 py-2">
				<span className="text-xs font-medium text-text-muted">
					{documentType ? formatKey(documentType) : "Document"} Fields
				</span>
			</div>
			<table className="w-full text-left text-sm">
				<tbody>
					{entries.map(([key, value]) => (
						<tr key={key} className="border-b border-border/50 last:border-0">
							<td className="w-1/3 px-4 py-3 align-top text-text-muted">{formatKey(key)}</td>
							<td className="px-4 py-3 align-top">
								{Array.isArray(value) ? (
									renderArray(value)
								) : typeof value === "object" && value !== null ? (
									renderObject(value as Record<string, unknown>)
								) : (
									<span className="font-mono text-text">{formatValue(key, value)}</span>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
