import { motion } from "framer-motion";
import {
  Factory,
  Wrench,
  Cog,
  Utensils,
  Snowflake,
  type LucideIcon,
} from "lucide-react";

type Setor = {
  title: string;
  icon: LucideIcon;
  img: string;
};

// Imagens genéricas por setor — trocar pelas oficiais do cliente.
const SETORES: Setor[] = [
  {
    title: "Petroquímico",
    icon: Factory,
    img: "https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Siderúrgico",
    icon: Wrench,
    img: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Metal mecânico",
    icon: Cog,
    img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Alimentício",
    icon: Utensils,
    img: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Frigorífico",
    icon: Snowflake,
    img: "https://images.unsplash.com/photo-1606787620819-8bdf0c44c293?auto=format&fit=crop&w=900&q=80",
  },
];

export function Atuacao() {
  return (
    <section id="atuacao" className="bg-white py-20 lg:py-24">
      <div className="container-x">
        <h2 className="tpl-title">Atuação</h2>

        <div className="mx-auto mt-12 max-w-2xl rounded-lg bg-paper p-4">
          <div className="grid grid-cols-2 gap-4">
            {SETORES.map((s, i) => (
              <motion.article
                key={s.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group relative aspect-[16/9] overflow-hidden rounded-md"
              >
                <img
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-coal-900/45 transition-colors group-hover:bg-coal-900/30" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <s.icon className="h-4 w-4" strokeWidth={2} />
                  <span className="text-sm font-medium">{s.title}</span>
                </div>
              </motion.article>
            ))}

            {/* Obras entregues */}
            <a
              href="#contato"
              className="flex aspect-[16/9] items-center justify-center rounded-md border border-line bg-white text-center transition-colors hover:border-accent"
            >
              <span className="text-base font-semibold text-navy-900">
                Obras entregues
              </span>
            </a>
          </div>
        </div>

        {/* Banda escura — métrica */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center gap-4 rounded-lg bg-coal-900 px-8 py-8 text-white md:flex-row md:gap-10">
          <span className="text-4xl font-bold text-white md:text-5xl">
            70.000+
          </span>
          <div className="text-center md:text-left">
            <p className="text-base font-semibold">
              Horas de Projetos Executados
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/70">
              Nossa experiência acumulada nos permite oferecer soluções
              eficientes e alinhadas com as melhores práticas do mercado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
