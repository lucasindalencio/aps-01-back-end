import supabase from "../config/supabase.js";
import type Category from "../models/Category.js";

async function findAll() {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

async function findById(id: string) {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function create(category: Category) {
    const { data, error } = await supabase
        .from("categories")
        .insert(category.toDatabase())
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function update(id: string, category: Category) {
    const { data, error } = await supabase
        .from("categories")
        .update(category.toDatabase())
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
        .from("categories")
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
        .from("categories")
        .select("*")
        .or(`name.ilike.%${keyword}%, description.ilike.%${keyword}%`)
        .order("display_order", { ascending: true });

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
