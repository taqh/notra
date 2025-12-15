import { authClient } from "./client";

export type AvailableAuthProvider = "google" | "github";

export async function handleSocialAuth({
  provider,
}: {
  provider: AvailableAuthProvider;
}) {
  return await authClient.signIn.social({
    provider,
  });
}

export type SignInOptions = {
  name: string;
  email: string;
  password: string;
  image?: string;
  callbackURl?: string;
};

export async function handleSignUp({ options }: { options: SignInOptions }) {
  return await authClient.signUp.email(options);
}
