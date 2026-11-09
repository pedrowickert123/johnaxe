// Local RLS/storage check for publications. Run: supabase start && node supabase/tests/publications.check.cjs
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const URL = "http://127.0.0.1:54391", KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH", SECRET = "sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz";
const opts = { auth: { persistSession: false } };
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) process.exitCode = 1; };
const pdf = new Blob([`%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF`], { type: "application/pdf" });
const img = new Blob([fs.readFileSync(__dirname + "/../../src/assets/sectors/food.jpg")], { type: "image/jpeg" });

(async () => {
  const anon = createClient(URL, KEY, opts);
  const su = await anon.auth.signUp({ email: "intruder@x.com", password: "whatever123" });
  ok(!!su.error, "signup bloqueado: " + su.error?.message);

  // authenticated but not admin
  const svc = createClient(URL, SECRET, opts);
  await svc.auth.admin.createUser({ email: "user@x.com", password: "whatever123", email_confirm: true });
  const user = createClient(URL, KEY, opts);
  await user.auth.signInWithPassword({ email: "user@x.com", password: "whatever123" });
  const up0 = await user.storage.from("publications").upload("x/document.pdf", pdf, { contentType: "application/pdf" });
  ok(!!up0.error, "não-admin não sobe arquivo: " + up0.error?.message);
  const ins0 = await user.from("publications").insert({ title: "x", image_path: "a", pdf_path: "b" });
  ok(!!ins0.error, "não-admin não insere: " + ins0.error?.message);

  const admin = createClient(URL, KEY, opts);
  const li = await admin.auth.signInWithPassword({ email: "admin@johnaxe.local", password: "johnaxe123" });
  ok(!li.error, "login admin " + (li.error?.message ?? ""));
  const bad = await admin.storage.from("publications").upload("x/evil.html", new Blob(["<script>"], { type: "text/html" }), { contentType: "text/html" });
  ok(!!bad.error, "bucket rejeita html: " + bad.error?.message);

  const id = crypto.randomUUID();
  const s = admin.storage.from("publications");
  const u1 = await s.upload(`${id}/cover.jpg`, img, { contentType: "image/jpeg" });
  const u2 = await s.upload(`${id}/document.pdf`, pdf, { contentType: "application/pdf" });
  ok(!u1.error && !u2.error, "admin sobe imagem + pdf " + (u1.error?.message ?? u2.error?.message ?? ""));
  const ins = await admin.from("publications").insert({ id, title: "Relatório Técnico 2026", image_path: `${id}/cover.jpg`, pdf_path: `${id}/document.pdf` });
  ok(!ins.error, "admin insere " + (ins.error?.message ?? ""));

  const list = await anon.from("publications").select("*");
  ok(list.data?.some((r) => r.id === id), "anônimo lê lista");
  const view = await fetch(anon.storage.from("publications").getPublicUrl(`${id}/document.pdf`).data.publicUrl);
  ok(view.status === 200 && view.headers.get("content-type") === "application/pdf", `PDF abre: ${view.status} ${view.headers.get("content-type")} disp=${view.headers.get("content-disposition")}`);
  const dl = await fetch(anon.storage.from("publications").getPublicUrl(`${id}/document.pdf`, { download: "Relatório Técnico 2026.pdf" }).data.publicUrl);
  ok(/attachment/.test(dl.headers.get("content-disposition") ?? ""), "download: " + dl.headers.get("content-disposition"));

  const upd0 = await user.from("publications").update({ title: "hack" }).eq("id", id).select("id");
  ok(!upd0.error && upd0.data.length === 0, "não-admin não edita");
  const upd1 = await admin.from("publications").update({ created_at: "2000-01-01" }).eq("id", id).select("id");
  ok(!!upd1.error, "admin não altera created_at: " + upd1.error?.message);
  // edit flow: new PDF on new path, update row, remove old file
  const u3 = await s.upload(`${id}/document-v2.pdf`, pdf, { contentType: "application/pdf" });
  const upd = await admin.from("publications").update({ title: "Relatório Técnico 2026 (rev. 2)", pdf_path: `${id}/document-v2.pdf` }).eq("id", id).select("id");
  ok(!u3.error && upd.data?.length === 1, "admin edita título + troca PDF " + (u3.error?.message ?? upd.error?.message ?? ""));
  const rmOld = await s.remove([`${id}/document.pdf`]);
  ok(rmOld.data?.length === 1, "admin remove PDF antigo");
  const after = await anon.from("publications").select("title,pdf_path").eq("id", id).single();
  ok(after.data?.title.endsWith("(rev. 2)") && after.data.pdf_path.endsWith("v2.pdf"), "anônimo vê versão editada");

  const del0 = await user.from("publications").delete().eq("id", id).select();
  ok(!del0.error && del0.data.length === 0, "não-admin não exclui");
  const del = await admin.from("publications").delete().eq("id", id).select();
  ok(del.data?.length === 1, "admin exclui linha");
  const rm = await s.remove([`${id}/cover.jpg`, `${id}/document-v2.pdf`]);
  ok(rm.data?.length === 2, "admin remove arquivos: " + rm.data?.length + " " + (rm.error?.message ?? ""));

  const uid = (await svc.auth.admin.listUsers()).data.users.find((x) => x.email === "user@x.com").id;
  await svc.auth.admin.deleteUser(uid);
})();
