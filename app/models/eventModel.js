const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//This schema is derived from the CalendarEvent interface used by the frontend.
let Meeting = new Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    color: {
        primary: { type: String, default: '#ad2121' },
        secondary: { type: String, default: '#FAE3E3' },
    },
    location: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
    monthStart: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], required: true },
    monthEnd: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], required: true },
    year: { type: Number, default: new Date().getFullYear() },
    adminName: { type: String, required: true },
    importance: { type: Number, required: true, enum: [0, 1, 2] }
})


mongoose.model('Meeting', Meeting);