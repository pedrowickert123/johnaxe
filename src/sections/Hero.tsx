import { motion } from "framer-motion";
import heroImg from "../assets/hero-main.png";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-coal-900 pt-16 text-white"
    >
      {/* Imagem de fundo oficial */}
      <img
        src={heroImg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-coal-900/40 via-coal-900/30 to-coal-900/70" />

      <div className="container-x relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold tracking-tight text-white md:text-6xl"
          >
            Projetos Industriais
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-[16px] leading-[1.7] text-white/85 md:text-lg"
          >
            Com mais de 70.000 horas de projetos executados, nossa equipe
            multidisciplinar está preparada para atender todas as demandas com a
            mais alta qualidade e excelência.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <a href="#contato" className="btn-cta">
              Solicite um orçamento
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
