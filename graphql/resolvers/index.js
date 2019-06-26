//  Models
const Admin = require('../../schema/models/Admin')
const Supervisor = require('../../schema/models/Supervisor')
const Attendance = require('../../schema/models/Attendance')

// Auth
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    supervisor: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('Unauthenticated')
            }
            const supervisor = await Supervisor.findById(req.userId)
            return supervisor
        }
        catch (err) {
            return err
        }
    },
    admin: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('Unauthenticated')
            }
            const admin = await Admin.findById(req.userId)
            return admin
        }
        catch (err) {
            return err
        }
    },
    supervisors: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('Unauthenticated')
            }
            const supervisors = await Supervisor.find()
            return supervisors
        }
        catch (err) {
            return err
        }
    },
    supervisorById: async(args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('Unauthenticated')
            }
            const supervisor = await Supervisor.findById(args.studentId)
            if(!supervisor) {
                throw new Error('No Such Student Found')
            }
            return supervisor
        }
        catch (err) {
            console.log('Error Getting the Supervisor by Id: ', err)
            return err
        }
    },
    attendanceByDateAndSupervisorId: async(args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('Unauthenticated')
            }
            const attendances = await Attendance.find({supervisor: args.supervisorId, date: args.date})
            return attendances
        }
        catch (err) {
            console.log('Error Getting the Attendances by supervisor Id and Date: ', err)
            return err
        }
    },
    loginSupervisor: async (args, req) => {
        try {
            const supervisor = await Supervisor.findOne({ email: args.method })
            if(!supervisor) {
                console.log('User does not Exist')
                throw new Error('User does not exist')
            }
            const isEqual = await bcrypt.compare(args.password, supervisor.password)
            if(!isEqual) throw new Error('Invalid Password')
            const token = jwt.sign({userId: supervisor.id}, 'ninenine', {
                expiresIn: '35040h'
            })
            return { userId: supervisor.id, token: token, typeUser: 'Supervisor', tokenExpiration: 35040 }
        }
        catch (err) {
            console.log('Error logging in the supervisor: ', err)
            return err
        }
    },
    loginAdmin: async (args, req) => {
        try {
            const admin = await Admin.findOne({ email: args.method })
            if(!admin) {
                console.log('User does not Exist')
                throw new Error('User does not exist')
            }
            const isEqual = await bcrypt.compare(args.password, admin.password)
            if(!isEqual) throw new Error('Invalid Password')
            const token = jwt.sign({userId: admin.id}, 'ninenine', {
                expiresIn: '35040h'
            })
            return { userId: admin.id, token: token, typeUser: 'Admin', tokenExpiration: 35040 }
        }
        catch (err) {
            console.log('Error logging in the admin: ', err)
            return err
        }
    },
    createSupervisor: async (args) => {
        try {
            const supervisor = await Supervisor.findOne({ email: args.supervisorInput.email })
            if(supervisor) {
                throw new Error('User exists already')
            }
            const hashedPassword = await bcrypt.hash(args.supervisorInput.password, 12)
            const newSupervisor = new Supervisor({
                name: args.supervisorInput.name,
                email: args.supervisorInput.email,
                phoneNumber: args.supervisorInput.phoneNumber,
                password: hashedPassword,
                dateJoined: new Date().toString(),
                dateLastLogin: new Date().toString()
            })
            savedSupervisor = await newSupervisor.save()
            const token = jwt.sign({userId: savedSupervisor.id}, 'ninenine', {
                expiresIn: '35040h'
            })
            return { userId: savedSupervisor.id, token: token, typeUser: 'Supervisor', tokenExpiration: 35040 }
        }
        catch (err) {
            return err
        }
    },
    createAdmin: async (args) => {
        try {
            const admin = await Admin.findOne({ email: args.adminInput.email })
            if(admin) {
                throw new Error('User exists already')
            }
            const hashedPassword = await bcrypt.hash(args.adminInput.password, 12)
            const newAdmin = new Admin({
                name: args.adminInput.name,
                email: args.adminInput.email,
                phoneNumber: args.adminInput.phoneNumber,
                password: hashedPassword,
                dateJoined: new Date().toString(),
                dateLastLogin: new Date().toString()
            })
            savedAdmin = await newAdmin.save()
            const token = jwt.sign({userId: savedAdmin.id}, 'ninenine', {
                expiresIn: '35040h'
            })
            return { userId: savedAdmin.id, token: token, typeUser: 'Admin', tokenExpiration: 35040 }
        }
        catch (err) {
            return err
        }
    },
    removeSupervisor: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('Unauthenticated')
            }
            const supervisor = await Supervisor.findById(args.supervisor)
            if(!supervisor) {
                throw new Error('No Such Supervisor Found')
            }
            await Supervisor.findByIdAndDelete(args.supervisorId)
            console.log('Removed supervisor with SupervisorId: ', args.supervisorId)
            return 'Success'
        }
        catch (err) {
            console.log('Error deleting the supervisor: ', err)
            return err
        }
    },
    markAttendance: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error('Unauthenticated')
            }
            const attendanceCheck = await Attendance.findOne({supervisor: req.userId, labourId: args.attendanceInput.labourId, date: args.attendanceInput.date})
            const imageCheck = await Attendance.findOne({labourImage: args.attendanceInput.labourImage}) 
            if(attendanceCheck) {
                return 'Already marked Attendance for this Labour'
            }
            if(imageCheck) {
                return 'This image has already been used'
            }
            const newAttendance = new Attendance({
                labourName: args.attendanceInput.labourName,
                labourId: args.attendanceInput.labourId,
                labourImage: args.attendanceInput.labourImage,
                date: args.attendanceInput.date,
                gpsLoc: args.attendanceInput.gpsLoc,
                supervisor: req.userId,
                validated: false,
                rejected: false,
                isOpen: true
            })
            const savedAttendance = await newAttendance.save()
            if (savedAttendance) {
                return 'Marked Present'
            }
            else {
                throw new Error('Error saving Attendance')
            }
        }
        catch (err) {
            return err
        }
    }
}