import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    async getProducts() {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    async getCompanyInfo() {
        const { data, error } = await this.supabase
            .from('company_info')
            .select('*')
            .single();
        if (error) throw error;
        return data;
    }

    async addProduct(product: any) {
        const { data, error } = await this.supabase
            .from('products')
            .insert([product]);
        if (error) throw error;
        return data;
    }

    async updateProduct(id: string, product: any) {
        const { data, error } = await this.supabase
            .from('products')
            .update(product)
            .eq('id', id);
        if (error) throw error;
        return data;
    }

    async deleteProduct(id: string) {
        const { error } = await this.supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }

    async updateCompanyInfo(info: any) {
        const { data, error } = await this.supabase
            .from('company_info')
            .update(info)
            .eq('id', 1);
        if (error) throw error;
        return data;
    }

    async getCurrentUser() {
        const { data: { user } } = await this.supabase.auth.getUser();
        return user;
    }

    async signIn(email: string, pass: string) {
        return await this.supabase.auth.signInWithPassword({ email, password: pass });
    }

    async signOut() {
        await this.supabase.auth.signOut();
    }
}
