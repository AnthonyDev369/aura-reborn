"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import type { Perfume, ImportSettings } from "@/lib/types";

export function useProducts() {
  const [products, setProducts] = useState<Perfume[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [importSettings, setImportSettings] = useState<ImportSettings | null>(null);

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort() as string[];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("perfumes").select("*").eq("active", true);
        if (data) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    async function loadImportSettings() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("import_settings")
          .select("*")
          .limit(1)
          .maybeSingle();
        if (data) setImportSettings(data);
      } catch (e) {
        console.error("Error cargando import settings:", e);
      }
    }

    fetchProducts();
    loadImportSettings();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedBrand) {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.brand?.toLowerCase() || "").includes(query) ||
          (p.description?.toLowerCase() || "").includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedBrand, products]);

  return {
    products,
    filteredProducts,
    loading,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    brands,
    importSettings,
  };
}
