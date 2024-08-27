import mongoose from 'mongoose';

export const connect = async () => {
	try {
		const URI = process.env.MONGODB_URI;
		if (!URI) {
			throw new Error('MONGODB_URI environment variable not set');
		}
		await mongoose.connect(URI);
	} catch (error) {
		console.error('Error connecting to MongoDB Atlas:', error);
		throw error;
	}
};

export const closeDatabase = async () => {
	try {
		await mongoose.connection.close();
	} catch (error) {
		console.error('Error closing MongoDB Atlas connection:', error);
		throw error;
	}
};

export const clearDatabase = async () => {
	try {
		const collections = mongoose.connection.collections;
		for (const key in collections) {
			const collection = collections[key];
			await collection.deleteMany({});
		}
	} catch (error) {
		console.error('Error clearing MongoDB Atlas database:', error);
		throw error;
	}
};
