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
                    ),
                    manufacturer,
                    year,
                    country
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
            imageUrl: item.equipment.image_path,
            categoryName: item.equipment.category?.name || 'Unknown',
            quantity: item.quantity,
            status: item.status,
            manufacturer: item.equipment.manufacturer,
            year: item.equipment.year,
            origin: item.equipment.country
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

    // ---- ADMIN / INSTRUCTOR CRUD ----

    async createCountry(country: Partial<Country>, flagFile?: File, coatFile?: File): Promise<Country> {
        let flagUrl = country.flagUrl;
        let coatUrl = country.coatOfArmsUrl;

        // Upload Flag
        if (flagFile) {
            const fileName = `flags/${Date.now()}_${flagFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('equipment-images') // Reusing existing bucket or create new 'flags' bucket. Let's reuse for simplicity if not restricted.
                .upload(fileName, flagFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('equipment-images')
                .getPublicUrl(fileName);

            flagUrl = publicUrl;
        }

        // Upload Coat
        if (coatFile) {
            const fileName = `coats/${Date.now()}_${coatFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('equipment-images')
                .upload(fileName, coatFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('equipment-images')
                .getPublicUrl(fileName);

            coatUrl = publicUrl;
        }

        const { data, error } = await supabase
            .from('countries')
            .insert({
                name: country.name,
                code: country.code,
                code_2: country.code2,
                region: country.region,
                capital: country.capital,
                continent: country.continent,
                population: country.population,
                area_km2: country.areaKm2,
                currency_code: country.currencyCode,
                currency_name: country.currencyName,
                military_budget_usd: country.militaryBudgetUsd,
                active_military: country.activeMilitary,
                reserve_military: country.reserveMilitary,
                military_rank: country.militaryRank,
                flag_url: flagUrl,
                coat_of_arms_url: coatUrl,
                description: country.description,
                military_description: country.militaryDescription,
                alliance: country.alliance
            })
            .select()
            .single();

        if (error) throw error;
        return mapCountryFromDB(data);
    },

    async updateCountry(id: number, updates: Partial<Country>, flagFile?: File, coatFile?: File): Promise<Country> {
        let flagUrl = updates.flagUrl;
        let coatUrl = updates.coatOfArmsUrl;

        if (flagFile) {
            const fileName = `flags/${Date.now()}_${flagFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('equipment-images')
                .upload(fileName, flagFile);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage
                .from('equipment-images')
                .getPublicUrl(fileName);
            flagUrl = publicUrl;
        }

        if (coatFile) {
            const fileName = `coats/${Date.now()}_${coatFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('equipment-images')
                .upload(fileName, coatFile);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage
                .from('equipment-images')
                .getPublicUrl(fileName);
            coatUrl = publicUrl;
        }

        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.code !== undefined) dbUpdates.code = updates.code;
        if (updates.code2 !== undefined) dbUpdates.code_2 = updates.code2;
        if (updates.region !== undefined) dbUpdates.region = updates.region;
        if (updates.capital !== undefined) dbUpdates.capital = updates.capital;
        if (updates.continent !== undefined) dbUpdates.continent = updates.continent;
        if (updates.population !== undefined) dbUpdates.population = updates.population;
        if (updates.areaKm2 !== undefined) dbUpdates.area_km2 = updates.areaKm2;
        if (updates.currencyCode !== undefined) dbUpdates.currency_code = updates.currencyCode;
        if (updates.currencyName !== undefined) dbUpdates.currency_name = updates.currencyName;
        if (updates.militaryBudgetUsd !== undefined) dbUpdates.military_budget_usd = updates.militaryBudgetUsd;
        if (updates.activeMilitary !== undefined) dbUpdates.active_military = updates.activeMilitary;
        if (updates.reserveMilitary !== undefined) dbUpdates.reserve_military = updates.reserveMilitary;
        if (updates.militaryRank !== undefined) dbUpdates.military_rank = updates.militaryRank;
        if (flagUrl !== undefined) dbUpdates.flag_url = flagUrl;
        if (coatUrl !== undefined) dbUpdates.coat_of_arms_url = coatUrl;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.militaryDescription !== undefined) dbUpdates.military_description = updates.militaryDescription;
        if (updates.alliance !== undefined) dbUpdates.alliance = updates.alliance;

        const { data, error } = await supabase
            .from('countries')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return mapCountryFromDB(data);
    },

    async deleteCountry(id: number): Promise<void> {
        const { error } = await supabase
            .from('countries')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
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
        alliance: dbRecord.alliance || 'Non-Aligned',
        latitude: dbRecord.latitude,
        longitude: dbRecord.longitude
    };
}
