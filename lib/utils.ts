import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const glowColor = "rgba(59, 130, 246, 0.3)";
export const shadow = `0 0 5px ${glowColor}, 0 0 10px ${glowColor}, 0 0 15px ${glowColor},0 0 20px ${glowColor}`;

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return { errorMessage: error.message };
  } else {
    return { errorMessage: "An error occurred" };
  }
};
