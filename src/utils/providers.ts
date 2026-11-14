import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const githubProvider = new GithubAuthProvider();

export { googleProvider, githubProvider };
