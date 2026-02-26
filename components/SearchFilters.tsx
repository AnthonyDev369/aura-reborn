"use client";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedBrand: string | null;
  setSelectedBrand: (b: string | null) => void;
  brands: string[];
  filteredProductsCount: number;
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedBrand,
  setSelectedBrand,
  brands,
  filteredProductsCount,
}: SearchFiltersProps) {
  return (
    <section className="px-8 py-12 border-b border-glassBorder">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Buscador */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar perfume, marca o nota..."
              className="w-full p-5 pr-14 bg-white border-2 border-glassBorder rounded-full text-text placeholder:text-muted/40 outline-none focus:border-accent transition-all text-base"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <svg className="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" suppressHydrationWarning>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filtros por Marca */}
        <div className="flex flex-wrap justify-center gap-3">
          {/* Botón "Todas" */}
          <button
            onClick={() => setSelectedBrand(null)}
            className={`px-6 py-3 rounded-full border-2 text-sm font-bold uppercase tracking-widest transition-all ${
              selectedBrand === null
                ? 'border-text bg-text text-white'
                : 'border-glassBorder text-text hover:border-accent'
            }`}
          >
            Todas
          </button>
          
          {/* Botones por marca */}
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand || null)}
              className={`px-6 py-3 rounded-full border-2 text-sm font-bold uppercase tracking-widest transition-all ${
                selectedBrand === brand
                  ? 'border-text bg-text text-white'
                  : 'border-glassBorder text-text hover:border-accent'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Contador de resultados */}
        {(searchQuery || selectedBrand) && (
          <p className="text-center text-muted text-sm uppercase tracking-widest mt-6">
            {filteredProductsCount} {filteredProductsCount === 1 ? 'resultado' : 'resultados'}
          </p>
        )}
      </div>
    </section>
  );
}
