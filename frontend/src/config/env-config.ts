import * as z from "zod";

const createClientEnv = () => {
  const EnvSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string(),
  });

  const clientEnvVars = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  };

  const parsedClientEnv = EnvSchema.safeParse(clientEnvVars);

  if (!parsedClientEnv.success) {
    throw new Error(
      `Invalid client env provided.
      The following variables are missing or invalid:
      ${Object.entries(parsedClientEnv.error.flatten().fieldErrors)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join("\n")}
  `
    );
  }

  return parsedClientEnv.data ?? {};
};

export const clientEnv = createClientEnv();
