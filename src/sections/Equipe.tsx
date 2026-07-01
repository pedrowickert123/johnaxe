import { motion } from "framer-motion";
import {
  Zap,
  Cpu,
  Gauge,
  Building2,
  Hammer,
  Fan,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

type Disciplina = {
  icon: LucideIcon;
  title: string;
};

const DISCIPLINAS: Disciplina[] = [
  { icon: Zap, title: "Elétrica" },
  { icon: Cpu, title: "Automação" },
  { icon: Gauge, title: "Instrumentação" },
  { icon: Building2, title: "Arquitetura" },
  { icon: Hammer, title: "Civil" },
  { icon: Fan, title: "Mecânica/HVAC" },
  { icon: FlaskConical, title: "Química - Ambiental" },
];

export function Equipe() {
  return (
    <section id="equipe" className="bg-coal-900 py-20 lg:py-24">
      <div className="container-x">
        <h2 className="tpl-title">Equipe multidisciplinar</h2>
        <p className="tpl-sub text-white/60">
          Com profissionais altamente qualificados em várias disciplinas,
          podemos oferecer soluções completas e integradas para qualquer projeto
          industrial.
        </p>

        <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2 md:grid-cols-3">
          {DISCIPLINAS.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col items-center gap-3 rounded-lg bg-white px-4 py-6 text-center"
            >
              <d.icon className="h-7 w-7 text-accent" strokeWidth={1.75} />
              <span className="text-sm font-semibold text-navy-900">
                {d.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
