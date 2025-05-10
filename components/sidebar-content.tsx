"use client";
import { Note } from "@prisma/client";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";
interface Props {
  notes: Note[];
}
const BarSideContent = ({ notes }: Props) => {
  const [searchText, setSearchText] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const fuse = useMemo(() => {
    return new Fuse(localNotes, {
      keys: ["text"],
      threshold: 0.4,
    });
  }, [localNotes]);

  const filterdNote = searchText
    ? fuse.search(searchText).map((result) => result.item)
    : localNotes;

  const deletNoteLocally = (noteId: string) => {
    setLocalNotes((prev) => prev.filter((note) => note.id !== noteId));
  };
  return (
    <SidebarGroupContent>
      <div className="relative flex items-center">
        <Search className="absolute left-2 size-4" />
        <Input
          className="bg-muted pl-8 border border-primary-foreground"
          placeholder="Search your notes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <SidebarMenu className="mt-4">
        {filterdNote.map((note) => (
          <SidebarMenuItem key={note.id} className="group/item">
            <SelectNoteButton note={note} />

            <DeleteNoteButton
              noteId={note.id}
              deletNoteLocally={deletNoteLocally}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};
export default BarSideContent;
