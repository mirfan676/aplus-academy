import fs from "node:fs";

const siteUrl = "https://www.aplusacademy.pk";
const key = "2047ac3b-1da6-4604-afd7-1726eecdbc3d";
const sitemapUrl = process.env.INDEXNOW_SITEMAP || `${siteUrl}/sitemap.xml`;
const keyLocation = `${siteUrl}/${key}.txt`;

const response = await fetch(sitemapUrl, {
  headers: { "User-Agent": "APlusAcademy-IndexNow/1.0" },
});

if (!response.ok) {
  throw new Error(`Could not load the live sitemap (${response.status}).`);
}

const sitemap = await response.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1].trim())
  .filter((url) => url.startsWith(`${siteUrl}/`));

if (!urls.length) {
  throw new Error("The live sitemap did not contain any A Plus Academy URLs.");
}

const submitResponse = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "www.aplusacademy.pk",
    key,
    keyLocation,
    urlList: urls,
  }),
});

if (!submitResponse.ok) {
  throw new Error(`IndexNow submission failed (${submitResponse.status}): ${await submitResponse.text()}`);
}

console.log(`IndexNow accepted ${urls.length} URLs (${submitResponse.status}).`);
