import { motion } from "framer-motion";
import {
  FileText,
  FileCheck2,
  FileCog,
  Calculator,
  ClipboardList,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type Servico = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const SERVICOS: Servico[] = [
  {
    icon: FileText,
    title: "Projeto Conceitual",
    desc: "Definição dos requisitos principais e viabilidade técnica para seu projeto industrial.",
  },
  {
    icon: FileCheck2,
    title: "Projeto Básico",
    desc: "Desenvolvimento das especificações técnicas e documentação necessária para aprovações.",
  },
  {
    icon: FileCog,
    title: "Projeto Detalhado/Executivo",
    desc: "Documentação completa com todos os detalhes para execução do projeto.",
  },
  {
    icon: Calculator,
    title: "Estimação de Orçamento Global",
    desc: "Análise detalhada de custos para planejamento financeiro preciso.",
  },
  {
    icon: ClipboardList,
    title: "Gerenciamento de Projetos",
    desc: "Supervisão completa para garantir que seu projeto seja entregue no prazo e dentro do orçamento.",
  },
  {
    icon: ShieldCheck,
    title: "Aprovação e Conformidade",
    desc: "Garantimos que todos os aspectos do projeto estejam em conformidade com normas e regulamentações.",
  },
];

export function Servicos() {
  return (
    <section id="servicos" className="bg-white py-20 lg:py-24">
      <div className="container-x">
        <h2 className="tpl-title">Nossos Serviços</h2>
        <p className="tpl-sub">
          Oferecemos uma gama completa de serviços de engenharia para projetos
          industriais, desde o conceito inicial até a implementação final.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICOS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="tpl-card"
            >
              <s.icon className="h-7 w-7 text-accent" strokeWidth={1.75} />
              <h3 className="mt-4 text-base font-semibold text-navy-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
