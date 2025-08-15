import fetch from "node-fetch"; // skip if using Node 18+
import fs from "fs";

const publicR2Domain = "pub-ecc7eaad42c840b390028ae2614ddb1e.r2.dev"; // Use your actual public R2 domain here
const accountId = "8e58aca7ee0c31de1c271519ec7ce66e"; // your account ID
const bucketName = "retronix-live";
const apiToken = "EkLs-55TVyqNpcBq4V2BgbEgjn6iMBcTGxmNkzk6";

function encodeKey(key) {
  // Encode each segment of the path, preserving slashes
  return key
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}

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
      const publicUrl = `https://${publicR2Domain}/${encodeKey(obj.key)}`;
      links.push(publicUrl);
    });

    if (!json.result_info || !json.result_info.is_truncated) {
      break;
    }

    cursor = json.result_info.cursor;
    if (!cursor) break;
  }

  fs.writeFileSync("retronix_links.txt", links.join("\n"), "utf8");
  console.log(`✅ Your file URLs have been saved to retronix_links.txt`);
}

listObjects().catch(console.error);