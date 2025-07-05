import { EntityState } from '@ngrx/entity';
import { CommentsRes } from '../../../data/interfces/post.interface.ts';

export interface CommentState extends EntityState<CommentsRes | null> {}
