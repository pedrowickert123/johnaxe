import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoUrl from "../assets/logo.png";

const LEFT_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Atuação", href: "#atuacao" },
  { label: "Serviços", href: "#servicos" },
];

const RIGHT_ITEMS = [
  { label: "Equipe", href: "#equipe" },
  { label: "Clientes", href: "#clientes" },
  { label: "Publicações", href: "#publications" },
  { label: "Contato", href: "#contato" },
];

const ALL_ITEMS = [...LEFT_ITEMS, ...RIGHT_ITEMS];

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="text-[13px] font-medium uppercase tracking-wider text-white/80 transition-colors hover:text-white"
    >
      {label}
    </a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-coal-900/95 backdrop-blur">
      <nav className="container-x flex h-16 items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* Links esquerda */}
        <ul className="hidden items-center gap-8 lg:flex">
          {LEFT_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink {...item} />
            </li>
          ))}
        </ul>

        {/* Logo central */}
        <a
          href="#home"
          className="flex items-center justify-center"
          aria-label="JOHN AXE — Projetos Industriais"
        >
          <img src={logoUrl} alt="JOHN AXE" className="h-10 w-auto" />
        </a>

        {/* Links direita */}
        <ul className="hidden items-center justify-end gap-8 lg:flex">
          {RIGHT_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink {...item} />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white lg:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-coal-900 lg:hidden"
          >
            <ul className="container-x flex flex-col py-3">
              {ALL_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/10 py-3 text-[14px] font-medium uppercase tracking-wider text-white/80 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
