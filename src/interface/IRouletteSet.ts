import { Database } from '@/interface/IDatabase';

type RouletteSet = Database['public']['Tables']['roulette_set']['Row'];

export default interface IRouletteSet extends RouletteSet {}
