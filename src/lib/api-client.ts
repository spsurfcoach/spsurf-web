"use client";

import { getCurrentIdToken } from "@/lib/firebase/auth";

export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const token = await getCurrentIdToken();
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = errorText || "Request failed";
    try {
      const parsed = JSON.parse(errorText) as { error?: string; detail?: string };
      if (typeof parsed.error === "string") message = parsed.error;
      else if (typeof parsed.detail === "string") message = parsed.detail;
    } catch {
      /* keep raw message */
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
