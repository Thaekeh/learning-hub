import { SupabaseClient } from "@supabase/supabase-js";
import { FlashcardListRow } from "../../types";
import { flashcardListsTable } from "./tables";

export const getListsForUser = async (supabase: SupabaseClient): Promise<FlashcardListRow[] | null> => {
    const { data } = await supabase
		.from(flashcardListsTable)
		.select()
    return data
}

export const getListById = async (supabase: SupabaseClient, listId: string): Promise<FlashcardListRow | null> => {
    const { data } = await supabase
    .from(flashcardListsTable)
    .select()
    .eq("id", listId)
    .single();
    return data
}