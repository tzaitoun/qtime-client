import { string, object } from 'yup';

const schemaStudent = object().shape({
	email: string().required().email('The email is not a valid email address'),
	password: string().required().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
		, 'The password must have: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'),
	firstName: string().trim().required().max(30),
	lastName: string().trim().required().max(30),
	studentId: string().trim().required().max(30),
	university: string().trim().required().max(30)
});

const schemaInstructor = object().shape({
	email: string().required().email('The email is not a valid email address'),
	password: string().required().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
		, 'password must have: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'),
	firstName: string().trim().required().max(30),
	lastName: string().trim().required().max(30),
	university: string().trim().required().max(30)
});

export default { schemaStudent, schemaInstructor };