import { motion } from "framer-motion";

// Placeholders de texto — substituir pelos logos oficiais (SVG/PNG) de cada cliente.
const CLIENTES = [
  "YARA",
  "Guardian Glass",
  "IFF",
  "Braskem",
  "STIHL",
  "Altus",
  "Belium",
  "JBS",
  "Komputo",
  "Intertechne",
  "Porto Alegre Airport",
];

export function Clientes() {
  return (
    <section id="clientes" className="bg-white py-20 lg:py-24">
      <div className="container-x">
        <h2 className="tpl-title">Principais Clientes</h2>
        <p className="tpl-sub">
          Conheça algumas das empresas que confiam em nossa expertise para seus
          projetos industriais.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
        >
          {CLIENTES.map((c) => (
            <div
              key={c}
              className="flex h-24 items-center justify-center rounded-lg border border-line bg-paper px-4 text-center shadow-edge transition-shadow hover:shadow-sharp"
            >
              <span className="text-sm font-semibold tracking-wide text-navy-500 lg:text-base">
                {c}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
