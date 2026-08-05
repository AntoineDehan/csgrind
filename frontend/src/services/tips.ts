import { z } from "zod";
import {
  tipSchema,
  type CreateTipInput,
  type Tip,
} from "@backend/schemas/tip.schema";
import { apiFetch } from "../lib/api";

export type { Tip };

export async function getTips(): Promise<Tip[]> {
  const data = await apiFetch<unknown>("/tips");
  return z.array(tipSchema).parse(data);
}

export async function createTip(data: CreateTipInput): Promise<Tip> {
  const created = await apiFetch<unknown>("/tips", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return tipSchema.parse(created);
}

export async function deleteTip(id: string): Promise<void> {
  await apiFetch<void>(`/tips/${id}`, { method: "DELETE" });
}
