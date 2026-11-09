import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, FileText } from "lucide-react";
import {
  fetchPublications,
  fileUrl,
  formatPublishedAt,
  isConfigured,
  type Publication,
} from "../lib/publications";

export function Publications() {
  const [items, setItems] = useState<Publication[] | null>(null);

  useEffect(() => {
    fetchPublications()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <section id="publications" className="bg-paper py-20 lg:py-24">
      <div className="container-x">
        <h2 className="tpl-title">Publicações</h2>
        <p className="tpl-sub">
          Materiais e conteúdos técnicos produzidos pela nossa equipe. Visualize
          online ou baixe em PDF.
        </p>

        {items === null && isConfigured ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-lg border border-line bg-white"
              >
                <div className="aspect-[4/3] bg-navy-100" />
                <div className="space-y-3 p-6">
                  <div className="h-2.5 w-1/3 rounded bg-navy-100" />
                  <div className="h-4 w-3/4 rounded bg-navy-100" />
                </div>
              </div>
            ))}
          </div>
        ) : !items?.length ? (
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center rounded-lg border border-dashed border-navy-200 bg-white px-6 py-12 text-center">
            <FileText className="h-6 w-6 text-navy-300" />
            <p className="mt-3 text-sm text-navy-500">
              Em breve novas publicações.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-edge transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(10,22,40,0.35)]"
              >
                <a
                  href={fileUrl(p.pdf_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-navy-50">
                    <img
                      src={fileUrl(p.image_path)}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-coal-900/0 transition-colors duration-300 group-hover:bg-coal-900/50">
                      <span className="inline-flex translate-y-2 items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-navy-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <Eye className="h-4 w-4" /> Visualizar PDF
                      </span>
                    </div>
                    <span className="absolute left-3 top-3 rounded bg-accent px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
                      PDF
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="label-caps">
                      {formatPublishedAt(p.created_at)}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-navy-900 transition-colors group-hover:text-accent">
                      {p.title}
                    </h3>
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-[13px] font-medium text-navy-500">
                      Ler publicação <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
