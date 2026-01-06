import { Injectable } from '@nestjs/common';
import { supabase } from '../lib/supabase';

export interface SearchQuery {
    year?: string;
    keyword?: string;
}

export interface Event {
    id: string;
    title: string;
    event_date: string;
    // Add other event properties as needed
}

@Injectable()
export class HistoryService {
    async getToday(): Promise<Event[] | null> {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('event_date', today);

        if (error) {
            console.error('Error fetching today events:', error);
            return null;
        }

        return data;
    }

    async search(query: SearchQuery): Promise<Event[] | null> {
        let q = supabase.from('events').select('*');

        if (query.year) {
            q = q.eq('event_date', `${query.year}-01-01`);
        }

        if (query.keyword) {
            q = q.ilike('title', `%${query.keyword}%`);
        }

        const { data, error } = await q;

        if (error) {
            console.error('Error searching events:', error);
            return null;
        }

        return data;
    }

    async bookmark(userId: string, eventId: string): Promise<{ success: boolean; error?: string }> {
        const { error } = await supabase.from('bookmarks').insert({
            user_id: userId,
            event_id: eventId,
        });

        if (error) {
            console.error('Error creating bookmark:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    }
}
