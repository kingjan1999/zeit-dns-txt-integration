// stolen from
// https://github.com/zeit/integrations/blob/e17d4a8fabe145547212a1756ac1eaa34a77a4f6/github-connect/github-callback.js
import cookie from "cookie";
import { parse as parseURL } from "url";

function send(res: any, statusCode: number, content: string) {
  res.writeHead(statusCode);
  res.end(content);
}

module.exports = (req: any, res: any) => {
  const query = parseURL(req.url, true).query;
  const { code, state } = query;
  const cookies = cookie.parse(req.headers.cookie);
  const context = JSON.parse(cookies["now-externaldns-context"] || "{}");

  if (!code || !state) {
    return send(res, 403, "No code or state found");
  }

  if (state !== context.state) {
    return send(res, 403, "Invalid state");
  }

  // TODO: Validate next is a front URL before redirecting

  res.writeHead(302, {
    "Location": `${context.next}?google_code=${code}`,
    "Set-Cookie": cookie.serialize("now-externaldns-context", "", { path: "/" }),
  });

  res.end("Redirecting...");
};
