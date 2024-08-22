'use client';

import { DownloadIcon, FileIcon, PaperclipIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Attachments({
	taskId,
	files
}: {
	taskId: string;
	files: { fileUrl: string; filename: string; _id: string }[];
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [deleteIsLoading, setDeleteIsLoading] = useState(false);
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		try {
			setIsLoading(true);
			const fileData = fileInputRef.current?.files?.[0];
			const response = await fetch(
				`/api/tasks/files?taskId=${taskId}&filename=${fileData?.name}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'multipart/form-data'
					},
					body: fileData
				}
			);
			if (!response.ok) {
				return;
			}
			router.refresh();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleDelete(fileId: string) {
		try {
			setDeleteIsLoading(true);
			const response = await fetch(
				`/api/tasks/files?taskId=${taskId}&fileId=${fileId}`,
				{
					method: 'DELETE'
				}
			);
			if (!response.ok) {
				return;
			}
			router.refresh();
		} catch (error) {
			console.error(error);
		} finally {
			setDeleteIsLoading(false);
		}
	}
	return (
		<div className="mt-4">
			<h4 className="mb-2 font-semibold">Attachments</h4>
			<ul className="space-y-2">
				{files.map((file) => (
					<li
						onClick={() => document}
						key={file._id}
						className="flex items-center justify-between rounded bg-muted p-2"
					>
						<div className="flex items-center space-x-2 overflow-hidden pr-5">
							<FileIcon className="h-4 w-4" />
							<span className="overflow-hidden">{file.filename}</span>
						</div>
						<div className="flex items-center space-x-2">
							<a href={file.fileUrl} target="_blank" download={file.filename}>
								<DownloadIcon className="h-4 w-4" />
								<span className="sr-only">Download File</span>
							</a>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleDelete(file._id)}
								disabled={deleteIsLoading}
							>
								<XIcon className="h-4 w-4" />
								<span className="sr-only">Delete File</span>
							</Button>
						</div>
					</li>
				))}
			</ul>
			<div className="mt-2">
				<input
					disabled={isLoading}
					type="file"
					ref={fileInputRef}
					className="hidden"
					onChange={handleFileUpload}
				/>
				<Button
					disabled={isLoading}
					variant="outline"
					onClick={() => fileInputRef.current?.click()}
					className="w-full"
				>
					<PaperclipIcon className="mr-2 h-4 w-4" />
					{isLoading ? 'Uploading...' : 'Attach Files'}
				</Button>
			</div>
		</div>
	);
}
