import * as z from "zod";

const createClientEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
  });

  const clientEnvVars = {
    API_URL: process.env.API_URL,
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
  } else {
    console.log("Client env is valid");
  }

  return parsedClientEnv.data ?? {};
};

export const clientEnv = createClientEnv();
