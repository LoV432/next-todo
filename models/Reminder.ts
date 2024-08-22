import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		time: {
			type: Date,
			required: true
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{ timestamps: true }
);

export default mongoose.models.Reminder ||
	mongoose.model('Reminder', ReminderSchema);
