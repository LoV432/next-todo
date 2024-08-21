import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		// description: { type: String },
		status: {
			type: String,
			enum: ['pending', 'completed'],
			default: 'pending'
		},
		// dueDate: { type: Date },
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		subTasks: [
			{
				title: { type: String, required: true },
				status: {
					type: String,
					enum: ['pending', 'completed'],
					default: 'pending'
				}
			}
		],
		files: [
			{
				filename: { type: String },
				fileUrl: { type: String }
			}
		]
	},
	{ timestamps: true }
);

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
