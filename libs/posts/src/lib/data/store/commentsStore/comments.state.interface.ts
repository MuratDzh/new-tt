import { EntityState } from '@ngrx/entity';
import { CommentsRes } from '../../interfaces/post.interface';


export interface CommentState extends EntityState<CommentsRes | null> {}
