import mongoose from "mongoose";

export default (databaseName?: string) => {
  mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  mongoose.Promise = global.Promise;
};
