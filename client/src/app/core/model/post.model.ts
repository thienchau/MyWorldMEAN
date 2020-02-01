import {User} from './user.model';
import {Comment} from './comment.model';
import {Media} from './media.model';


export interface Post {
    id: string;
    content: string;
    user: User;
    createDate: string;
    likeNum: number;
    liked: boolean;
    commentNum: number;
    comments: Comment[];
    medias: Media[];
}
