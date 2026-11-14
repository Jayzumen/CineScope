import test from "node:test";
import assert from "node:assert/strict";
import { authErrorMessage } from "../src/lib/authErrors.ts";
test("auth errors are actionable, quiet on cancel, and private on reset", () => {
  const err = (code) => Object.assign(new Error("x"), { code });
  assert.equal(
    authErrorMessage(err("auth/popup-closed-by-user"), "login"),
    null,
  );
  assert.equal(authErrorMessage(err("auth/user-not-found"), "reset"), null);
  assert.match(
    authErrorMessage(
      err("auth/account-exists-with-different-credential"),
      "login",
    ),
    /different sign-in method/,
  );
  assert.match(authErrorMessage(err("auth/weird"), "reset"), /reset link/);
  assert.match(
    authErrorMessage(new Error("plain"), "login"),
    /Could not sign in/,
  );
});
