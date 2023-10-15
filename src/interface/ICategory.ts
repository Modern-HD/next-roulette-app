import { Database } from '@/interface/IDatabase';

type Category = Database['public']['Tables']['category']['Row'];

export default interface ICategory extends Category {}
