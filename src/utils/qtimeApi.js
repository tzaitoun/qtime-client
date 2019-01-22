import axios from 'axios';

let baseUrl;
if (process.env.NODE_ENV === 'production') {
    baseUrl = 'http://ec2-3-17-24-58.us-east-2.compute.amazonaws.com';
} else {
    baseUrl = 'http://localhost:3000';
}

function setupHeader(token) {
    const config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    return config;
}

export function createStudentAccount(student, token) {
    return axios.post(baseUrl + '/students/signup', student, setupHeader(token));
}

export function createInstructorAccount(instructor, token) {
    return axios.post(baseUrl + '/instructors/signup', instructor, setupHeader(token));
}

export function getStudentCourses(token) {
    return axios.get(baseUrl + '/students/me/courses', setupHeader(token));
}

export function getInstructorCourses(token) {
    return axios.get(baseUrl + '/instructors/me/courses', setupHeader(token));
}

export function createCourse(course, token) {
    return axios.post(baseUrl + '/courses', course, setupHeader(token));
}

export function joinCourse(joinCode, token) {
    return axios.post(baseUrl + '/courses/join', joinCode, setupHeader(token));
}