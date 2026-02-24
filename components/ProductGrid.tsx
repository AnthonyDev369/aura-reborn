"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import type { Perfume } from "@/lib/types";

interface ProductGridProps {
  loading: boolean;
  products: Perfume[];
  filteredProducts: Perfume[];
  searchQuery: string;
  selectedBrand: string | null;
  onProductClick: (product: Perfume) => void;
  onClearFilters: () => void;
}

export default function ProductGrid({
  loading,
  products,
  filteredProducts,
  searchQuery,
  selectedBrand,
  onProductClick,
  onClearFilters,
}: ProductGridProps) {
  const displayProducts = searchQuery || selectedBrand ? filteredProducts : products;

  return (
    <>
      <section className="px-8 py-40">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/50 h-[600px] rounded-[50px] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {displayProducts.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => onProductClick(product)}
                  className="cursor-pointer group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      duration: 1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <ProductCard perfume={product} />
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sin resultados */}
      {(searchQuery || selectedBrand) && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted text-lg uppercase tracking-widest mb-4">
            No se encontraron productos
          </p>
          <button
            onClick={onClearFilters}
            className="px-6 py-3 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all text-sm uppercase tracking-widest font-bold"
          >
            Limpiar Filtros
          </button>
        </div>
      )}
    </>
  );
}
