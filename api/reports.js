const { createClient } = require("@sanity/client");

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!process.env.APP_ACCESS_CODE || req.headers["x-access-code"] !== process.env.APP_ACCESS_CODE) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    if (req.method === "GET") {
      const rows = await client.fetch(
        `*[_type=="dataSheetReport"]|order(ts desc)[0...30]{"id":_id,ts,airport,d1,d2,state}`
      );
      return res.json(rows.map((r) => ({ ...r, state: safeParse(r.state) })));
    }
    if (req.method === "POST") {
      const b = req.body || {};
      const doc = {
        _type: "dataSheetReport",
        ts: Number(b.ts) || Date.now(),
        airport: String(b.airport || "").slice(0, 200),
        d1: String(b.d1 || "").slice(0, 10),
        d2: String(b.d2 || "").slice(0, 10),
        state: JSON.stringify(b.state || {}).slice(0, 100000),
      };
      const created = await client.create(doc);
      return res.json({ id: created._id });
    }
    if (req.method === "DELETE") {
      const id = String(req.query.id || "");
      if (!id) return res.status(400).json({ error: "id required" });
      await client.delete({ query: '*[_type=="dataSheetReport" && _id==$id]', params: { id } });
      return res.json({ ok: true });
    }
    return res.status(405).json({ error: "method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
};

function safeParse(s) {
  try { return JSON.parse(s || "{}"); } catch (e) { return {}; }
}
