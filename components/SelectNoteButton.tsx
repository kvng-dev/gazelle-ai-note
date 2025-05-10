"use client";
import useNote from "@/hooks/use-note";
import { Note } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";

interface Props {
  note: Note;
}
const SelectNoteButton = ({ note }: Props) => {
  const noteId = useSearchParams().get("noteId") || "";
  const { noteText: selectedNoteText } = useNote();
  const [shouldUseGlobalNoteText, setShouldUseGlobalNoteText] = useState(false);
  const [localNoteText, setLocalNoteText] = useState(note.text);

  const blankNote = "EMPTY NOTE";
  let noteText = localNoteText || blankNote;

  useEffect(() => {
    if (noteId === note.id) {
      setShouldUseGlobalNoteText(true);
    } else {
      setShouldUseGlobalNoteText(false);
    }
  }, [noteId, note.id]);

  useEffect(() => {
    if (shouldUseGlobalNoteText) setLocalNoteText(selectedNoteText);
  }, [selectedNoteText, shouldUseGlobalNoteText]);
  if (shouldUseGlobalNoteText) {
    noteText = selectedNoteText || blankNote;
  }
  return (
    <SidebarMenuButton
      asChild
      className={`items-start gap-0 pr-12 ${
        note.id === noteId ? "bg-sidebar-accent/50" : ""
      }`}
    >
      <Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col">
        <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap">
          {noteText}
        </p>
        <p className="text-muted-foreground text-xs">
          {note.updatedAt.toLocaleDateString()}
        </p>
      </Link>
    </SidebarMenuButton>
  );
};
export default SelectNoteButton;
