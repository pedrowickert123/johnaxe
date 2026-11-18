import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Loader2, type LucideIcon } from "lucide-react";
import { Alert } from "../components/Alert";

// ponytail: FormSubmit relays to this inbox, no backend or credentials.
// First submission sends an "Activate Form" email to this address; nothing arrives until it's clicked.
const FORM_ENDPOINT =
  "https://formsubmit.co/ajax/hamilton.godinho@johnaxe.com.br";

type Status = "idle" | "sending" | "sent" | "error";

export function Contato() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || String(data?.success) !== "true") {
        throw new Error(`contact: ${res.status}`);
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contato" className="bg-white py-20 lg:py-24">
      <div className="container-x">
        <h2 className="tpl-title-dark">Entre em Contato</h2>
        <p className="tpl-sub">
          Estamos prontos para discutir seu próximo projeto. Entre em contato
          conosco para uma conversa inicial.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Coluna esquerda — informações + mapa */}
          <div>
            <h3 className="text-lg font-semibold text-navy-900">
              Informações de Contato
            </h3>
            <div className="mt-6 space-y-5">
              <Info
                icon={Phone}
                label="Telefone"
                value="(51) 99238-2882"
                href="tel:+5551992382882"
              />
              <Info
                icon={Mail}
                label="Email"
                value="comercial@johnaxe.com.br"
                href="mailto:comercial@johnaxe.com.br"
              />
              <Info
                icon={MapPin}
                label="Endereço"
                value="Rua Tupã, 740 – Scharlau, São Leopoldo – RS, 93120-340"
                href="https://maps.google.com/?q=Rua+Tup%C3%A3,+740,+Scharlau,+S%C3%A3o+Leopoldo,+RS,+93120-340"
              />
            </div>

            <h3 className="mt-10 text-lg font-semibold text-navy-900">
              Nossa Localização
            </h3>
            <div className="mt-4 overflow-hidden rounded-lg border border-line">
              <iframe
                title="Mapa — Rua Tupã, 740, São Leopoldo"
                src="https://www.google.com/maps?q=Rua+Tup%C3%A3,+740,+Scharlau,+S%C3%A3o+Leopoldo,+RS,+93120-340&output=embed&z=16"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Coluna direita — formulário */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-lg border border-line bg-white p-7 shadow-edge lg:p-8">
              <h3 className="text-lg font-semibold text-navy-900">
                Envie uma Mensagem
              </h3>
              <form onSubmit={onSubmit} className="mt-6 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Nome completo"
                    name="name"
                    placeholder="Seu nome completo"
                    required
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    required
                  />
                  <Field
                    label="Telefone"
                    name="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                  />
                  <Field
                    label="Empresa"
                    name="company"
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div>
                  <Label>Mensagem</Label>
                  <textarea
                    name="message"
                    placeholder="Descreva seu projeto ou dúvida..."
                    rows={5}
                    required
                    className="mt-2 w-full resize-none rounded-md border border-line bg-white px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-accent"
                  />
                </div>
                <input
                  type="hidden"
                  name="_subject"
                  value="Contato pelo site John Axe"
                />
                <input type="hidden" name="_template" value="table" />
                {/* Honeypot: FormSubmit drops submissions that fill it. */}
                <input
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                {status === "sent" && (
                  <Alert tone="success">
                    Mensagem enviada. Retornaremos em breve.
                  </Alert>
                )}
                {status === "error" && (
                  <Alert tone="error">
                    Não foi possível enviar agora. Tente novamente ou escreva
                    para comercial@johnaxe.com.br.
                  </Alert>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-accent w-full disabled:opacity-60"
                >
                  {status === "sending" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {status === "sending" ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a href={href} className="flex items-start gap-4 group">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-xs font-medium uppercase tracking-wider text-navy-400">
          {label}
        </span>
        <span className="block text-sm font-medium text-navy-900 transition-colors group-hover:text-accent">
          {value}
        </span>
      </span>
    </a>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium uppercase tracking-wider text-navy-500">
      {children}
    </label>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: FieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-accent"
      />
    </div>
  );
}
