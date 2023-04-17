// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { encode } from "@/lib/jwt";
import { serialize } from "cookie";

export default (req, res) => {
  const { method } = req;
  const { email, password } = req.body;

  if (method !== "POST") return res.status(404).end();

  if (!email || !password)
    return res.status(400).json({
      error: "Missing required params",
    });

  const user = authenticateUser(email, password);

  if (user) {
    res.setHeader(
      "Set-Cookie",
      serialize("my_auth", user, { path: "/", httpOnly: true })
    );
    return res.json({ success: true });
  } else {
    return res
      .status(401)
      .json({ success: false, error: "Wrong email or password" });
  }
};

function authenticateUser(email, password) {
  const validEmail = "js@some.com";
  const validPassword = "goodpassword";

  if (email === validEmail && password && validEmail)
    return encode({
      id: "fajwlejflawnwlwfjeklfwjlf",
      name: "js",
      email: "js@some.com",
    });

  return null;
}
