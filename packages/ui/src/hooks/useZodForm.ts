import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export function useZodForm<T extends z.ZodSchema>(schema: T) {
  return useForm({
    resolver: zodResolver(schema),
  });
}
