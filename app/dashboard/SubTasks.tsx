import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { ObjectId } from 'mongoose';

export default function SubTasks({
	subTasks
}: {
	subTasks: {
		title: string;
		status: 'pending' | 'completed';
		_id: ObjectId;
	}[];
}) {
	return subTasks.map((subtask) => (
		<li key={subtask._id.toString()} className="flex items-center space-x-2">
			<Checkbox
				checked={subtask.status === 'completed'}
				id={`subtask-${subtask._id.toString()}`}
			/>

			<label
				htmlFor={`subtask-${subtask._id.toString()}`}
				className={`flex-grow ${subtask.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}
			>
				{subtask.title}
			</label>
			<Button variant="ghost" size="icon">
				<XIcon className="h-4 w-4" />
				<span className="sr-only">Delete Subtask</span>
			</Button>
		</li>
	));
}
