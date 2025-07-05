import { Profile } from './profile.interface';
export interface Subscribers<Profile> {
  items: Profile[] | null;
  total: number;
  page: number;
  size: number;
  pages: number;
}
