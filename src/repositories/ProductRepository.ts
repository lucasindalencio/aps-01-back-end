import supabase from "../config/supabase.js";
import type Product from "../models/Product.js";

async function findAll() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("title", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

async function findById(id: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function create(product: Product) {
    const { data, error } = await supabase
        .from("products")
        .insert(product.toDatabase())
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function update(id: string, product: Product) {
    const { data, error } = await supabase
        .from("products")
        .update({
            ...product.toDatabase(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function remove(id: string) {
    const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function searchByKeyword(keyword: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`title.ilike.%${keyword}%, description.ilike.%${keyword}%`)
        .order("title", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

export default {
    findAll,
    findById,
    create,
    update,
    remove,
    searchByKeyword
}
