import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Eye,
  FileText,
  ImagePlus,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Trash2,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import logoUrl from "../assets/logo.png";
import heroImg from "../assets/hero-main.png";
import {
  BUCKET,
  fetchPublications,
  fileUrl,
  formatPublishedAt,
  type Publication,
} from "../lib/publications";
import { supabase } from "../lib/supabase";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // matches bucket file_size_limit
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Painel — JOHN AXE";
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) =>
      setSession(s),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper p-6">
        <Alert tone="error">
          Supabase não configurado (VITE_SUPABASE_URL /
          VITE_SUPABASE_PUBLISHABLE_KEY).
        </Alert>
      </div>
    );
  }
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Loader2 className="h-6 w-6 animate-spin text-navy-400" />
      </div>
    );
  }
  return session ? <Dashboard session={session} /> : <Login />;
}

/* ---------------------------------------------------------------- Login */

function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error } = await supabase!.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setBusy(false);
    if (error) setError("E-mail ou senha inválidos.");
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-coal-900 lg:block">
        <img
          src={heroImg}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coal-900 via-coal-900/70 to-coal-900/30" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <a href="/" aria-label="Voltar ao site" className="self-start">
            <img src={logoUrl} alt="JOHN AXE" className="h-11 w-auto" />
          </a>
          <div className="max-w-md">
            <span className="block h-1 w-12 bg-accent" />
            <p className="label-caps mt-6 text-white/60">Painel de conteúdo</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white">
              Publique materiais no site em poucos cliques.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              Envie um PDF com capa e título. Ele aparece na seção Publicações,
              pronto para visualizar e baixar.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <img src={logoUrl} alt="JOHN AXE" className="h-10 w-auto lg:hidden" />
          <h2 className="mt-10 text-2xl font-semibold lg:mt-0">Entrar</h2>
          <p className="mt-1.5 text-sm text-navy-500">
            Acesso restrito à equipe JOHN AXE.
          </p>

          <div className="mt-8 space-y-5">
            <Field label="E-mail" icon={Mail}>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="voce@johnaxe.com.br"
                className={`${inputClass} pl-10`}
              />
            </Field>
            <Field label="Senha" icon={Lock}>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={`${inputClass} pl-10`}
              />
            </Field>
          </div>

          {error && (
            <div className="mt-5">
              <Alert tone="error">{error}</Alert>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-accent mt-8 w-full py-3.5 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Entrando..." : "Entrar no painel"}
          </button>

          <a
            href="/"
            className="mt-6 inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-900"
          >
            Voltar ao site <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </form>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------ Dashboard */

function Dashboard({ session }: { session: Session }) {
  const [items, setItems] = useState<Publication[] | null>(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const imagePreview = useMemo(
    () => (image ? URL.createObjectURL(image) : undefined),
    [image],
  );
  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview],
  );

  const load = () =>
    fetchPublications()
      .then(setItems)
      .catch(() => setError("Erro ao carregar publicações."));

  useEffect(() => {
    load();
  }, []);

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 4000);
  };

  const pickImage = (f: File | null) => {
    if (f && !IMAGE_TYPES.includes(f.type))
      return setError("A capa deve ser JPG, PNG ou WEBP.");
    if (f && f.size > MAX_FILE_SIZE) return setError("Imagem acima de 50 MB.");
    setError("");
    setImage(f);
  };

  const pickPdf = (f: File | null) => {
    if (f && f.type !== "application/pdf")
      return setError("O arquivo deve ser um PDF.");
    if (f && f.size > MAX_FILE_SIZE) return setError("PDF acima de 50 MB.");
    setError("");
    setPdf(f);
  };

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setImage(null);
    setPdf(null);
    setError("");
  };

  const startEdit = (p: Publication) => {
    resetForm();
    setEditing(p);
    setTitle(p.title);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const unchanged =
    editing !== null && title.trim() === editing.title && !image && !pdf;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const current = editing;
    if (!current && (!image || !pdf))
      return setError("Selecione a capa e o PDF.");

    const id = current?.id ?? crypto.randomUUID();
    // new path on every upload: replaced files never hit a stale CDN cache
    const version = Date.now().toString(36);
    const imagePath = image
      ? `${id}/cover-${version}.${image.name.split(".").pop()!.toLowerCase()}`
      : current!.image_path;
    const pdfPath = pdf ? `${id}/document-${version}.pdf` : current!.pdf_path;
    const uploaded = [image && imagePath, pdf && pdfPath].filter(
      (p): p is string => !!p,
    );
    const replaced = [
      image && current?.image_path,
      pdf && current?.pdf_path,
    ].filter((p): p is string => !!p);
    const storage = supabase!.storage.from(BUCKET);
    const row = {
      title: title.trim(),
      image_path: imagePath,
      pdf_path: pdfPath,
    };

    setBusy(true);
    setError("");
    try {
      const uploads = await Promise.all([
        image && storage.upload(imagePath, image, { contentType: image.type }),
        pdf && storage.upload(pdfPath, pdf, { contentType: "application/pdf" }),
      ]);
      const uploadError = uploads.find((u) => u && u.error)?.error;
      const { data, error } = uploadError
        ? { data: null, error: uploadError }
        : current
          ? await supabase!
              .from("publications")
              .update(row)
              .eq("id", id)
              .select("id")
          : await supabase!
              .from("publications")
              .insert({ id, ...row })
              .select("id");
      // RLS can silently match zero rows on update
      if (error || !data?.length) {
        if (uploaded.length) await storage.remove(uploaded);
        throw error ?? new Error("sem permissão para alterar.");
      }
      if (replaced.length) await storage.remove(replaced);
      resetForm();
      flash(
        current
          ? "Publicação atualizada."
          : "Publicação criada e já visível no site.",
      );
      await load();
    } catch (err) {
      setError(`Erro ao salvar: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (p: Publication) => {
    if (editing?.id === p.id) resetForm();
    // row first: if file removal fails, only orphan files remain (site stays consistent)
    const { error } = await supabase!
      .from("publications")
      .delete()
      .eq("id", p.id);
    if (error) return setError(`Erro ao excluir: ${error.message}`);
    await supabase!.storage.from(BUCKET).remove([p.image_path, p.pdf_path]);
    flash("Publicação excluída.");
    await load();
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-coal-900">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="/" aria-label="Voltar ao site">
              <img src={logoUrl} alt="JOHN AXE" className="h-9 w-auto" />
            </a>
            <span className="hidden h-6 w-px bg-white/15 sm:block" />
            <span className="label-caps hidden text-white/50 sm:block">
              Painel de conteúdo
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="/#publications"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-[13px] font-medium text-white/70 hover:text-white md:inline-flex"
            >
              Ver no site <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <span className="hidden text-[13px] text-white/40 lg:block">
              {session.user.email}
            </span>
            <button
              type="button"
              onClick={() => supabase!.auth.signOut()}
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-[13px] font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container-x py-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-caps">Conteúdo do site</p>
            <h1 className="mt-2 text-3xl font-semibold">Publicações</h1>
            <p className="mt-2 max-w-xl text-sm text-navy-500">
              Cada publicação aparece como um card com capa e título. No clique,
              o visitante abre o PDF e pode baixá-lo.
            </p>
          </div>
          {items && (
            <span className="num-mono rounded-full border border-line bg-white px-3 py-1 text-xs text-navy-600">
              {items.length} {items.length === 1 ? "publicada" : "publicadas"}
            </span>
          )}
        </div>

        {notice && (
          <div className="mt-6">
            <Alert tone="success">{notice}</Alert>
          </div>
        )}

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[400px_1fr]">
          {/* Form */}
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className={`scroll-mt-24 rounded-xl border bg-white shadow-edge transition-colors lg:sticky lg:top-24 ${
              editing ? "border-accent/40 ring-4 ring-accent/5" : "border-line"
            }`}
          >
            <div className="flex items-center gap-3 border-b border-line px-6 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent">
                {editing ? (
                  <Pencil className="h-4 w-4" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </span>
              <h2 className="flex-1 text-base font-semibold">
                {editing ? "Editar publicação" : "Nova publicação"}
              </h2>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={busy}
                  className="inline-flex items-center gap-1 text-xs font-medium text-navy-500 hover:text-navy-900"
                >
                  <X className="h-3.5 w-3.5" /> Cancelar
                </button>
              )}
            </div>

            <div className="space-y-5 p-6">
              <label className="block">
                <span className="flex justify-between text-sm font-medium text-navy-900">
                  Título
                  <span className="num-mono text-xs font-normal text-navy-400">
                    {title.length}/200
                  </span>
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="Ex.: Catálogo de projetos 2026"
                  className={`${inputClass} mt-1.5`}
                />
              </label>

              <FileDrop
                label="Imagem de capa"
                hint="JPG, PNG ou WEBP · proporção 4:3"
                accept={IMAGE_TYPES.join(",")}
                icon={ImagePlus}
                file={image}
                hasCurrent={!!editing}
                onFile={pickImage}
              >
                <div className="relative">
                  <img
                    src={
                      imagePreview ??
                      (editing ? fileUrl(editing.image_path) : undefined)
                    }
                    alt=""
                    className="aspect-[4/3] w-full rounded-md object-cover"
                  />
                  <span className="absolute bottom-2 left-2 rounded bg-coal-900/80 px-2 py-1 text-xs text-white">
                    {image ? "Nova capa" : "Clique ou arraste para trocar"}
                  </span>
                </div>
              </FileDrop>

              <FileDrop
                label="Arquivo PDF"
                hint="Até 50 MB"
                accept="application/pdf"
                icon={FileText}
                file={pdf}
                hasCurrent={!!editing}
                onFile={pickPdf}
              >
                <div className="flex w-full items-center gap-3 text-left">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                    <FileText className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-navy-900">
                      {pdf ? pdf.name : "PDF atual"}
                    </span>
                    <span className="text-xs text-navy-400">
                      {pdf ? (
                        <span className="num-mono">{formatSize(pdf.size)}</span>
                      ) : (
                        "Clique ou arraste para substituir"
                      )}
                    </span>
                  </span>
                </div>
              </FileDrop>

              {error && <Alert tone="error">{error}</Alert>}

              <button
                type="submit"
                disabled={
                  busy ||
                  !title.trim() ||
                  unchanged ||
                  (!editing && (!image || !pdf))
                }
                className="btn-accent w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editing ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {busy
                  ? "Salvando..."
                  : editing
                    ? "Salvar alterações"
                    : "Publicar no site"}
              </button>
            </div>
          </form>

          {/* List */}
          <section>
            {items === null ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse overflow-hidden rounded-xl border border-line bg-white"
                  >
                    <div className="aspect-[4/3] bg-navy-100" />
                    <div className="space-y-2 p-4">
                      <div className="h-2.5 w-1/3 rounded bg-navy-100" />
                      <div className="h-3.5 w-3/4 rounded bg-navy-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-navy-200 px-6 py-20 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-400 shadow-edge">
                  <FileText className="h-5 w-5" />
                </span>
                <p className="mt-4 font-semibold">Nenhuma publicação ainda</p>
                <p className="mt-1 max-w-xs text-sm text-navy-500">
                  Use o formulário para enviar o primeiro material. Ele aparece
                  no site na hora.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((p) => (
                  <PublicationCard
                    key={p.id}
                    item={p}
                    active={editing?.id === p.id}
                    onEdit={startEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function PublicationCard({
  item,
  active,
  onEdit,
  onDelete,
}: {
  item: Publication;
  active: boolean;
  onEdit: (p: Publication) => void;
  onDelete: (p: Publication) => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-edge transition-shadow hover:shadow-sharp ${
        active ? "border-accent ring-4 ring-accent/10" : "border-line"
      }`}
    >
      {active && (
        <span className="absolute left-3 top-3 z-10 rounded bg-accent px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
          Editando
        </span>
      )}
      <div className="aspect-[4/3] overflow-hidden bg-navy-50">
        <img
          src={fileUrl(item.image_path)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 p-4">
        <p className="label-caps">{formatPublishedAt(item.created_at)}</p>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug">
          {item.title}
        </h3>
      </div>
      <div className="grid grid-cols-3 divide-x divide-line border-t border-line text-[13px] font-medium">
        <a
          href={fileUrl(item.pdf_path)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900"
        >
          <Eye className="h-3.5 w-3.5" /> Abrir
        </a>
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="flex items-center justify-center gap-1.5 py-2.5 text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900"
        >
          <Pencil className="h-3.5 w-3.5" /> Editar
        </button>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="flex items-center justify-center gap-1.5 py-2.5 text-navy-600 transition-colors hover:bg-accent/5 hover:text-accent"
        >
          <Trash2 className="h-3.5 w-3.5" /> Excluir
        </button>
      </div>

      {confirming && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-coal-900/95 p-6 text-center animate-fade-in">
          <Trash2 className="h-6 w-6 text-accent" />
          <p className="mt-3 text-sm font-semibold text-white">
            Excluir esta publicação?
          </p>
          <p className="mt-1 text-xs text-white/60">
            O card, a capa e o PDF saem do site.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              disabled={deleting}
              onClick={() => setConfirming(false)}
              className="rounded-md border border-white/20 px-4 py-2 text-[13px] font-medium text-white hover:border-white/50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                await onDelete(item);
                setDeleting(false);
                setConfirming(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Excluir
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ UI */

const inputClass =
  "block w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-300 outline-none transition focus:border-navy-900 focus:ring-4 focus:ring-navy-900/5";

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <span className="relative mt-1.5 block">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
        {children}
      </span>
    </label>
  );
}

function FileDrop({
  label,
  hint,
  accept,
  icon: Icon,
  file,
  hasCurrent = false,
  onFile,
  children,
}: {
  label: string;
  hint: string;
  accept: string;
  icon: LucideIcon;
  file: File | null;
  /** editing: an uploaded file already exists, so the slot is never empty */
  hasCurrent?: boolean;
  onFile: (f: File | null) => void;
  children: ReactNode;
}) {
  const [over, setOver] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-navy-900">{label}</span>
        {file && (
          <button
            type="button"
            onClick={() => onFile(null)}
            className="inline-flex items-center gap-1 text-xs text-navy-400 hover:text-accent"
          >
            <X className="h-3 w-3" /> {hasCurrent ? "Manter atual" : "Remover"}
          </button>
        )}
      </div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files[0];
          if (f) onFile(f);
        }}
        className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-center transition-colors ${
          file || hasCurrent ? "p-2" : "px-4 py-7"
        } ${
          over
            ? "border-accent bg-accent/5"
            : "border-navy-200 bg-navy-50/60 hover:border-navy-400 hover:bg-navy-50"
        }`}
      >
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
        {file || hasCurrent ? (
          <span className="block w-full p-1">{children}</span>
        ) : (
          <>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy-500 shadow-edge">
              <Icon className="h-5 w-5" />
            </span>
            <span className="mt-3 text-sm text-navy-600">
              Arraste aqui ou{" "}
              <span className="font-semibold text-accent">
                escolha o arquivo
              </span>
            </span>
            <span className="mt-1 text-xs text-navy-400">{hint}</span>
          </>
        )}
      </label>
    </div>
  );
}

function Alert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-md border px-3.5 py-3 text-sm animate-fade-in ${
        tone === "error"
          ? "border-accent/20 bg-accent/5 text-accent-dark"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
