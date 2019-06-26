const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    
    type Supervisor {
        _id: ID!
        name: String!
        email: String!
        password: String
        phoneNumber: String!
        dateJoined: String
        dateLastLogin: String
    }
    
    type Admin {
        _id: ID!
        name: String!
        email: String!
        password: String
        phoneNumber: String!
        dateJoined: String
        dateLastLogin: String
    }

    type Attendance {
        _id: ID!
        supervisor: Supervisor!
        date: String!
        gpsLoc: String!
        labourId: String!
        labourName: String!
        labourImage: String!
        validated: Boolean!
        rejected: Boolean!
        isOpen: Boolean!
    }

    input SupervisorInput {
        email: String!
        name: String!
        password: String!
        phoneNumber: String!
    }

    input AdminInput {
        email: String!
        name: String!
        password: String!
        phoneNumber: String!
    }

    input AttendanceInput {
        id: ID!
        date: String!
        gpsLoc: String!
        labourId: String!
        labourName: String!
        labourImage: String!
    }
    
    type AuthData {
        userId: ID!
        typeUser: String!
        token: String!
        tokenExpiration: Int!
    }

    type RootQuery {
        supervisor: Supervisor!
        supervisors: [Supervisor!]!
        admin: Admin!
        supervisorById(supervisorId: String!): Supervisor!
        attendanceByDateAndSupervisorId: [Attendance!]
    }
    
    type RootMutation {
        createSupervisor(supervisorInput: SupervisorInput): AuthData!
        createAdmin(adminInput: AdminInput): AuthData!
        loginSupervisor(method: String!, password: String!): AuthData!
        loginAdmin(method: String!, password: String!): AuthData!
        removeSupervisor(supervisorId: String!): String!
        markAttendance(attendanceInput: AttendanceInput!): String!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)