
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { hashPassword } from "../../../lib/hash";
import { validateEmail, passwordRegex } from "../../../lib/validators";
import axios, { AxiosError } from "axios";

type Data = { ok: boolean; message?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const { email, password, firstName, lastName, phone } = req.body;

  if (!email || !password) return res.status(400).json({ ok: false, message: "Email and password required" });
  if (!validateEmail(email)) return res.status(400).json({ ok: false, message: "Invalid email" });
  if (!passwordRegex.test(password)) return res.status(400).json({ ok: false, message: "Password does not meet requirements" });

  // Check existing
  const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (existing) return res.status(409).json({ ok: false, message: "User exists" });

  try {
    const hashed = await hashPassword(password);

    // Create contact in Bitrix via webhook
    const bitrixUrl = process.env.BITRIX_WEBHOOK_URL;
    let bitrixId: string | null = null;

    if (bitrixUrl) {
      try {
        const resp = await axios.post(bitrixUrl, {
          method: "crm.contact.add",
          params: {
            fields: {
              NAME: firstName || "",
              LAST_NAME: lastName || "",
              EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
              PHONE: phone ? [{ VALUE: phone, VALUE_TYPE: "WORK" }] : undefined,
            },
            params: { REGISTER_SONET_EVENT: "Y" },
          },
        });

        const data = resp.data as { result?: string | number };
        if (data && data.result) {
          bitrixId = String(data.result);
        }
      } catch (error) {
        const err = error as AxiosError;
        console.error("Bitrix webhook error:", err.response?.data || err.message);
        
      }
    }

    const stmt = db.prepare(
      "INSERT INTO users (email, password, firstName, lastName, phone, bitrix_id) VALUES (?, ?, ?, ?, ?, ?)"
    );
    stmt.run(email, hashed, firstName || "", lastName || "", phone || "", bitrixId);

    return res.status(201).json({ ok: true, message: "Registered" });
  } catch (error) {
    const err = error as AxiosError;
    console.error("Server error:", err.response?.data || err.message);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}

