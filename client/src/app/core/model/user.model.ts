export interface User {
    _id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    email: string;
    phone: number;
    gender: string;
    followed: boolean;
    numFollower: number;
    cover: string;
    street: string;
    city: string;
    zipCode: string;
    lang: string;
    dob: string;
}
