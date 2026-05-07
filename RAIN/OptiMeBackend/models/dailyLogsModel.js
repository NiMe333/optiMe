const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DailyLogsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    date: { type: Date, default: Date.now, required: true },
    mentalHealth: [
		{
			mood: { type: Number, required: false },
			stress: { type: Number, required: false },
			anxiety: { type: Number, required: false }
		}
	],
    healthParameters: [
		{
			sleepHours: { type: Number, required: false },
			steps: { type: Number, required: false },
            screentime: { type: Number, required: false }
		}
	],
}, {
    timestamps: true
});

module.exports = mongoose.model('dailyLogs', DailyLogsSchema);