import { supabase } from '../lib/supabase';
import type { Equipment } from '../types';

export interface Country {
    id: number;
    name: string;
    code: string; // ISO 3
    code2: string; // ISO 2 - mapped from code_2
    region: string;
    capital: string;
    continent: string;
    latitude?: number;
    longitude?: number;
    population?: number;
    areaKm2?: number; // mapped from area_km2
    languages?: string[];
    currencyCode?: string; // mapped from currency_code
    currencyName?: string; // mapped from currency_name
    militaryBudgetUsd?: number; // mapped from military_budget_usd
    activeMilitary?: number; // mapped from active_military
    reserveMilitary?: number; // mapped from reserve_military
    militaryRank?: number; // mapped from military_rank
    flagUrl: string; // mapped from flag_url
    coatOfArmsUrl?: string; // mapped from coat_of_arms_url
    description?: string;
    militaryDescription?: string; // mapped from military_description
    alliance?: string;
}

export const countryService = {
    async getAllCountries(): Promise<Country[]> {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .order('name');

        if (error) throw error;
        return (data || []).map(mapCountryFromDB);
    },

    async getCountry(countryId: string | number): Promise<Country> {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .eq('id', countryId)
            .single();

        if (error) throw error;
        return mapCountryFromDB(data);
    },

    async getCountriesByRegion(region: string): Promise<Country[]> {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .eq('region', region);

        if (error) throw error;
        return (data || []).map(mapCountryFromDB);
    },

    async getCountriesByContinent(continent: string): Promise<Country[]> {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .eq('continent', continent);

        if (error) throw error;
        return (data || []).map(mapCountryFromDB);
    },

    async getCountryEquipment(countryId: string | number): Promise<any[]> {
        const { data, error } = await supabase
            .from('country_equipment')
            .select(`
                quantity,
                status,
                equipment:equipment_id (
                    id,
                    name,
                    code,
                    description,
                    image_path,
                    category:category_id (
                        name
                    )
                )
            `)
            .eq('country_id', countryId);

        if (error) {
            console.error('Error fetching country equipment:', error);
            return [];
        }

        return (data || []).map((item: any) => ({
            id: item.equipment.id,
            name: item.equipment.name,
            code: item.equipment.code,
            description: item.equipment.description,
            imageUrl: item.equipment.image_path, // Correct mapping from snake_case
            categoryName: item.equipment.category?.name || 'Unknown',
            quantity: item.quantity,
            status: item.status
        }));
    },

    async getCountryStats(countryId: string | number): Promise<any> {
        const { count, error } = await supabase
            .from('country_equipment')
            .select('*', { count: 'exact', head: true })
            .eq('country_id', countryId);

        if (error) return { totalEquipment: 0 };

        return {
            totalEquipment: count || 0
        };
    },

    async searchCountries(searchTerm: string): Promise<Country[]> {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .or(`name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%`);

        if (error) throw error;
        return (data || []).map(mapCountryFromDB);
    },

    async addEquipmentToCountry() { return null; },
    async removeEquipmentFromCountry() { return null; }
};

function mapCountryFromDB(dbRecord: any): Country {
    return {
        id: dbRecord.id,
        name: dbRecord.name,
        code: dbRecord.code,
        code2: dbRecord.code_2,
        region: dbRecord.region,
        capital: dbRecord.capital,
        continent: dbRecord.continent,
        population: dbRecord.population,
        areaKm2: dbRecord.area_km2,
        currencyCode: dbRecord.currency_code,
        currencyName: dbRecord.currency_name,
        militaryBudgetUsd: dbRecord.military_budget_usd,
        activeMilitary: dbRecord.active_military,
        reserveMilitary: dbRecord.reserve_military,
        militaryRank: dbRecord.military_rank,
        flagUrl: dbRecord.flag_url,
        coatOfArmsUrl: dbRecord.coat_of_arms_url,
        description: dbRecord.description,
        militaryDescription: dbRecord.military_description,
        alliance: dbRecord.alliance || 'Non-Aligned'
    };
}
