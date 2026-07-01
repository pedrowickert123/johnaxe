import logoUrl from "../assets/logo.png";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Atuação", href: "#atuacao" },
  { label: "Serviços", href: "#servicos" },
  { label: "Equipe", href: "#equipe" },
  { label: "Clientes", href: "#clientes" },
  { label: "Contato", href: "#contato" },
];

export function Footer() {
  return (
    <footer className="bg-coal-900 text-white/70">
      <div className="container-x flex flex-col items-center gap-6 py-12 text-center">
        <a href="#home" aria-label="JOHN AXE — Projetos Industriais">
          <img src={logoUrl} alt="JOHN AXE" className="h-12 w-auto" />
        </a>

        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="text-[13px] font-medium uppercase tracking-wider text-white/70 transition-colors hover:text-white"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="text-sm text-white/50">
          <a href="tel:+5551992382882" className="hover:text-white">
            (51) 99238-2882
          </a>
          <span className="px-2">·</span>
          <a
            href="mailto:comercial@johnaxe.com.br"
            className="hover:text-white"
          >
            comercial@johnaxe.com.br
          </a>
        </div>

        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} JOHN AXE — Projetos Industriais. Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  );
}
