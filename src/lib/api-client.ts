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
    throw new Error(errorText || "Request failed");
  }

  return response.json() as Promise<T>;
}
