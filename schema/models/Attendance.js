const mongoose = require('mongoose')
const Schema = mongoose.Schema

const attendanceSchema = new Schema({
    supervisor: {
        type: Schema.Types.ObjectId,
        ref: 'Supervisor',
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    labourName: {
        type: String,
        required: true,
    },
    labourId: {
        type: String,
        required: true,
    },
    labourImage: {
        type: String,
        required: true,
    },
    gpsLoc: {
        type: String,
        required: true,
    },
    validated: {
        type: Boolean,
        required: true,
    },
    rejected: {
        type: Boolean,
        required: true
    },
    isOpen: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Attendance', attendanceSchema)