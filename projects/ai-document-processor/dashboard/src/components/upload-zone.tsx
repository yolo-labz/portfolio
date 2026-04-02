"use client";

import { useCallback, useRef, useState } from "react";
import { uploadDocument } from "@/lib/api";
import type { UploadResponse } from "@/lib/types";

interface UploadZoneProps {
	onUploadComplete: (response: UploadResponse) => void;
}

const ACCEPTED_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.docx";
const MAX_SIZE = 20 * 1024 * 1024;

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFile = useCallback(
		async (file: File) => {
			setError(null);

			if (!ACCEPTED_TYPES.includes(file.type)) {
				setError("Unsupported file type. Accepted: PDF, JPG, PNG, DOCX");
				return;
			}

			if (file.size > MAX_SIZE) {
				setError("File too large. Maximum size is 20MB.");
				return;
			}

			setIsUploading(true);
			try {
				const response = await uploadDocument(file);
				onUploadComplete(response);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Upload failed");
			} finally {
				setIsUploading(false);
			}
		},
		[onUploadComplete],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);

			const file = e.dataTransfer.files[0];
			if (file) handleFile(file);
		},
		[handleFile],
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleClick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) handleFile(file);
			e.target.value = "";
		},
		[handleFile],
	);

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={(e) => e.key === "Enter" && handleClick()}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			className={`
				relative min-h-48 cursor-pointer rounded-lg border-2 border-dashed
				transition-colors duration-200
				${isDragOver
					? "border-accent bg-accent/10"
					: "border-border bg-bg-card hover:border-accent/50"
				}
				flex flex-col items-center justify-center gap-3 p-8
			`}
		>
			<input
				ref={inputRef}
				type="file"
				accept={ACCEPTED_EXTENSIONS}
				onChange={handleInputChange}
				className="hidden"
			/>

			{isUploading ? (
				<>
					<svg
						className="h-8 w-8 animate-spin text-accent"
						viewBox="0 0 24 24"
						fill="none"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						/>
					</svg>
					<p className="text-sm text-text-muted">Uploading...</p>
				</>
			) : (
				<>
					<svg
						className="h-10 w-10 text-text-muted"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
						/>
					</svg>
					<p className="text-sm font-medium text-text">
						Drop files here or click to upload
					</p>
					<p className="text-xs text-text-muted">
						PDF, JPG, PNG, DOCX &mdash; Max 20MB
					</p>
				</>
			)}

			{error && (
				<p className="mt-2 text-sm text-status-failed">{error}</p>
			)}
		</div>
	);
}
