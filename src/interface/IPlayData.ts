import { Database } from '@/interface/IDatabase';

type PlayData = Database['public']['Tables']['play_data']['Row'];

export default interface IPlayData extends PlayData {}
