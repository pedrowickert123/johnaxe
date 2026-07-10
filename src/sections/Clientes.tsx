import { motion } from "framer-motion";
import aeroporto from "../assets/clients/aeroporto.png";
import altus from "../assets/clients/altus.png";
import braskem from "../assets/clients/braskem.png";
import betanin from "../assets/clients/betanin.png";
import gerdau from "../assets/clients/gerdau.png";
import guardian from "../assets/clients/guardian.png";
import iff from "../assets/clients/iff.png";
import intertechne from "../assets/clients/intertechne.png";
import stihl from "../assets/clients/stihl.png";
import yara from "../assets/clients/yara.png";

const CLIENTES = [
  { name: "Porto Alegre Airport", logo: aeroporto },
  { name: "Altus", logo: altus },
  { name: "Braskem", logo: braskem },
  { name: "Frigorífico Betanin", logo: betanin },
  { name: "Gerdau", logo: gerdau },
  { name: "Guardian Glass", logo: guardian },
  { name: "IFF", logo: iff },
  { name: "Intertechne", logo: intertechne },
  { name: "STIHL", logo: stihl },
  { name: "YARA", logo: yara },
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
              key={c.name}
              className="flex h-24 items-center justify-center overflow-hidden rounded-lg border border-line bg-paper p-2 text-center shadow-edge transition-shadow hover:shadow-sharp"
            >
              <img
                src={c.logo}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
