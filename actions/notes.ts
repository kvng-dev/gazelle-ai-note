"use server";

import { model } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { getUser } from "@/utils/supabase/server";

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a note");

    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });
    if (!existingNote) {
      throw new Error(`Note with id ${noteId} does not exist`);
    }

    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[]
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to ask questions");

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { text: true, createdAt: true, updatedAt: true },
    });

    if (notes.length === 0) {
      return "You don't have any notes yet.";
    }

    const formattedNotes = notes
      .map(
        (note, idx) => `
<strong>Note ${idx + 1}:</strong><br>
Text: ${note.text}<br>
Created at: ${note.createdAt.toUTCString()}<br>
Last updated: ${note.updatedAt.toUTCString()}<br>
`
      )
      .join("<br>");

    const messages: { role: "user" | "model"; parts: { text: string }[] }[] = [
      {
        role: "user",
        parts: [
          {
            text: `
You are a helpful assistant that answers questions about a user's notes.
Assume all questions are related to the user's notes.
Keep answers clear, concise, and use valid, structured HTML.
Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> as appropriate.
Avoid wrapping the entire response in one <p> if it's multi-paragraph.
Do NOT include inline styles, JavaScript, or custom attributes.

Here are the user's notes:
${formattedNotes}
`,
          },
        ],
      },
    ];

    newQuestions.forEach((question, index) => {
      messages.push({
        role: "user",
        parts: [{ text: question }],
      });
      if (responses[index]) {
        messages.push({
          role: "model",
          parts: [{ text: responses[index] }],
        });
      }
    });

    const result = await model.generateContent({
      contents: messages,
    });

    const summary = result.response.text().trim();
    return summary || "An error has occurred.";
  } catch (error) {
    return handleError(error);
  }
};
