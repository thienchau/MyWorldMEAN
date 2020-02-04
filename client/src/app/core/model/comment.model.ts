import {User} from './user.model';

export interface Comment {
    contain: string;
    commentUser: string;
    commentUserAvatar: string;
    createDate: string;
    user: User;
}
