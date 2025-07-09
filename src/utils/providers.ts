import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({
  prompt: "consent",
});

export { googleProvider, githubProvider };
