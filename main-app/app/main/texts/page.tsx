"use client";
import { TextRow } from "types/Texts";
import { getRouteForSingleText } from "utils/routing/texts";
import { useConfirm } from "hooks/useConfirm";
import { deleteText, getTexts, setTextName } from "utils/supabase/texts";
import { useEffect, useState } from "react";
import { RowType, SimpleTable } from "components/table/SimpleTable";
import { NameModal } from "components/modals/NameModal";
import { useSupabase } from "components/supabase-provider";

export default function Texts() {
  const [texts, setTexts] = useState<TextRow[]>([]);
  const { isConfirmed } = useConfirm();

  const { supabase } = useSupabase();

  useEffect(() => {
    getTexts(supabase).then((texts) => {
      setTexts(texts);
    });
  }, []);

  const handleDeleteCallback = async (id: string) => {
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteText(supabase, id);
      const newTexts = await getTexts(supabase);
      setTexts(newTexts);
    }
  };

  const refetchTexts = async () => {
    const newTexts = await getTexts(supabase);
    setTexts(newTexts);
  };

  const simpleMappedItems = (items: TextRow[] | null) => {
    if (!items) return [];
    return items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        type: RowType.text,
      };
    });
  };

  const [renameModalSettings, setRenameModalSettings] = useState<{
    isOpen: boolean;
    callback: (name: string) => void;
    name?: string;
  }>({
    isOpen: false,
    callback: () => {},
    name: "",
  });

  return (
    <>
      {renameModalSettings.isOpen && (
        <NameModal
          title={"Rename"}
          isOpen={renameModalSettings.isOpen}
          initalName={renameModalSettings.name}
          onOpenChange={() =>
            setRenameModalSettings({
              isOpen: false,
              name: "",
              callback: () => {},
            })
          }
          onConfirm={(name) => {
            renameModalSettings.callback(name);
            setRenameModalSettings({
              isOpen: false,
              name: "",
              callback: () => {},
            });
          }}
        />
      )}
      <div className="container mx-auto mt-12 max-w-screen-lg">
        <SimpleTable
          items={simpleMappedItems(texts)}
          openHrefFunction={(id) => getRouteForSingleText(id)}
          editCallback={(id) => {
            setRenameModalSettings({
              isOpen: true,
              name: texts.find((text) => text.id === id)?.name,
              callback: async (name) => {
                await setTextName(supabase, id, name);
                refetchTexts();
              },
            });
          }}
          deleteCallback={handleDeleteCallback}
        ></SimpleTable>
      </div>
    </>
  );
}
