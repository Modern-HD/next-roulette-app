import { Database } from '@/interface/IDatabase';

type User = Database['public']['Tables']['user']['Row'];

export default interface IUser extends User {}
