import fetch from "node-fetch"; // optional in Node 18+
import fs from "fs";

const accountId = "8e58aca7ee0c31de1c271519ec7ce66e";
const bucketName = "retronix-live";
const apiToken = "EkLs-55TVyqNpcBq4V2BgbEgjn6iMBcTGxmNkzk6";

async function listObjects() {
  let cursor = null;
  const links = [];

  while (true) {
    const url = new URL(`https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects`);
    if (cursor) url.searchParams.append("cursor", cursor);

    const res = await fetch(url.toString(), {
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (!json.success) {
      console.error("API Error:", json.errors);
      return;
    }

    if (!Array.isArray(json.result)) {
      console.error("Unexpected API response format:", JSON.stringify(json, null, 2));
      return;
    }

    json.result.forEach(obj => {
      const encodedKey = encodeURIComponent(obj.key);
      links.push(`https://pub-${accountId}.r2.dev/${encodedKey}`);
    });

    if (!json.result_info || !json.result_info.is_truncated) break;
    cursor = json.result_info.cursor;
    if (!cursor) break;
  }

  fs.writeFileSync("retronix_links.txt", links.join("\n"), "utf8");
  console.log(`✅ Links saved to retronix_links.txt`);
}

listObjects().catch(console.error);