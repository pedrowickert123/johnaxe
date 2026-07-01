import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, type LucideIcon } from "lucide-react";

export function Contato() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    (e.currentTarget as HTMLFormElement).reset();
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
                value="Porto Alegre, RS, Brasil"
                href="https://maps.google.com/?q=Porto+Alegre+RS"
              />
            </div>

            <h3 className="mt-10 text-lg font-semibold text-navy-900">
              Nossa Localização
            </h3>
            <div className="mt-4 overflow-hidden rounded-lg border border-line">
              <iframe
                title="Mapa Porto Alegre"
                src="https://www.google.com/maps?q=Porto+Alegre,+RS,+Brasil&output=embed&z=11"
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
                    name="nome"
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
                    name="telefone"
                    placeholder="(00) 00000-0000"
                  />
                  <Field
                    label="Empresa"
                    name="empresa"
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div>
                  <Label>Mensagem</Label>
                  <textarea
                    name="mensagem"
                    placeholder="Descreva seu projeto ou dúvida..."
                    rows={5}
                    required
                    className="mt-2 w-full resize-none rounded-md border border-line bg-white px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-accent"
                  />
                </div>
                <button type="submit" className="btn-accent w-full">
                  {sent ? "Mensagem enviada" : "Enviar Mensagem"}
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
