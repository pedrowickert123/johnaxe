import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Imagens genéricas de planta industrial — trocar pelas oficiais do cliente.
const HERO_IMGS = [
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1920&q=80",
];

const INTERVAL = 5000;

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % HERO_IMGS.length),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-coal-900 pt-16 text-white"
    >
      {/* Slideshow de fundo */}
      {HERO_IMGS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden={i !== active}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === active ? "opacity-40" : "opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-coal-900/70 via-coal-900/60 to-coal-900/90" />

      {/* Dots — indicadores do slideshow com progresso */}
      <div className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
        {HERO_IMGS.map((_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className="group flex h-7 w-3 items-center justify-center"
            >
              <motion.span
                animate={{
                  height: isActive ? 28 : 8,
                  width: isActive ? 6 : 8,
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.4)",
                }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="relative block overflow-hidden rounded-full group-hover:brightness-125"
              >
                {isActive && (
                  <motion.span
                    key={active}
                    initial={{ height: "0%" }}
                    animate={{ height: "100%" }}
                    transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                    className="absolute inset-x-0 top-0 block rounded-full bg-accent"
                  />
                )}
              </motion.span>
            </button>
          );
        })}
      </div>

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
