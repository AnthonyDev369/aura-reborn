"use client";

import { useEffect, useState } from "react";

const citiesEC = [
  "Quito", "Riobamba", "Cumbayá", "Tumbaco", "Los Chillos",
  "Guayaquil", "Samborondón", "Vía a la Costa",
  "Cuenca", "Manta", "Salinas", "Montañita",
  "Loja", "Ambato", "Ibarra", "Machala",
];

export function useSocialProof() {
  const [showToast, setShowToast] = useState(false);
  const [randomCity, setRandomCity] = useState("Quito");

  useEffect(() => {
    const timeout = setTimeout(() => setShowToast(true), 7000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const city = citiesEC[Math.floor(Math.random() * citiesEC.length)];
      setRandomCity(city);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return { showToast, setShowToast, randomCity };
}
