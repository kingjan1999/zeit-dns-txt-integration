// tslint:disable-next-line: max-line-length
// stolen from https://github.com/zeit/integrations/blob/e17d4a8fabe145547212a1756ac1eaa34a77a4f6/github-connect/connect-with-github.js
import cookie from "cookie";
import { parse as parseUrl } from "url";

const { GOOGLE_CLIENT_ID, GOOGLE_CALLBACK_URL } = process.env;

module.exports = (req: any, res: any) => {
  const { query } = parseUrl(req.url, true);
  if (!query.next) {
    res.writeHead(403);
    res.end("Query param next is required");
    return;
  }

  const scopes = encodeURIComponent(
    "https://www.googleapis.com/auth/ndev.clouddns.readwrite",
  );
  const state = `state_${Math.random()}`;

  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?
	scope=${scopes}&
	include_granted_scopes=true&
	access_type=offline&
	redirect_uri=${encodeURIComponent(GOOGLE_CALLBACK_URL || "")}&
	response_type=code&
	state=${state}&
	client_id=${encodeURIComponent(GOOGLE_CLIENT_ID || "")}
   `.replace(/(\r\n|\n|\r)/gm, "");
  console.log(redirectUrl);
  const context = { next: query.next, state };

  res.writeHead(302, {
    "Location": redirectUrl,
    "Set-Cookie": cookie.serialize(
      "now-externaldns-context",
      JSON.stringify(context),
      { path: "/" },
    ),
  });
  res.end("Redirecting...");
};
