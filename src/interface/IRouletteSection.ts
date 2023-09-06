import { Database } from '@/interface/IDatabase';

type RouletteSection = Database['public']['Tables']['roulette_section']['Row'];

export default interface IRouletteSection extends RouletteSection {}
