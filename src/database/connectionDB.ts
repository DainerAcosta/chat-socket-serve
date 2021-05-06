import mongoose from "mongoose";

const db = async () => {
    try {
        await mongoose.connect(`${process.env.DB_MONGO}`, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('Database connection');
        
    } catch (error) {
        throw new Error('fail connection');
    }
}

export default db;