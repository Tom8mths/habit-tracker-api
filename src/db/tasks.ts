import mongoose from 'mongoose';

const { Schema, Document } = mongoose;

interface ITask extends Document {
  userId: mongoose.Types.ObjectId,
  title: string;
  occurrence: "daily" | "weekly" | "monthly" | "alternate";
  category: string;
  date: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true, trim: true },
  occurrence: { type: String, enum: ["daily", "weekly", "monthly", "alternate"], required: true},
  category: { type: String, required: true, trim: true },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const TaskModel = mongoose.model<ITask>("Task", TaskSchema);

export const getTasks = (userId: string) => TaskModel.find({ userId });
export const createTask = (values: Record<string, any>, userId: string) => new TaskModel({...values, userId}).save().then((task) => task.toObject());
export const getTaskById = (id: string) => TaskModel.findById(id);
export const updateTask = (taskId: string, userId: string, updates: Partial<ITask>) => {
  return TaskModel.findByIdAndUpdate({_id: taskId, userId}, updates, { new: true });
};
export const deleteTask = (taskId: string, userId: string) => TaskModel.findByIdAndDelete({_id: taskId, userId});

TaskSchema.index({ title: 1, date: -1 });