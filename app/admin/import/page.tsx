"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";

export default function ImportPage() {
  const router = useRouter();
  const [productUrl, setProductUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleImportUrl() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/scrape-product?url=${encodeURIComponent(productUrl)}`);
      const data = await response.json();

      if (data.error) {
        setResult(`❌ Error: ${data.error}`);
      } else if (data.success) {
        setResult(
          `✅ Importación completada!\n\n` +
          `Total encontrados: ${data.total}\n` +
          `Importados exitosamente: ${data.imported}\n` +
          `Errores: ${data.errors}\n\n` +
          `Productos importados:\n${data.details.imported.join('\n')}`
        );
      } else {
        setResult('❌ Error desconocido');
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg py-32 px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-16 pb-8 border-b border-glassBorder">
          <div className="h-1 w-12 bg-accent/30 rounded-full mb-4" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-serif text-text mb-4 tracking-tight">
                Importación Masiva
              </h1>
              <p className="text-muted text-sm uppercase tracking-widest">
                GiftExpress • Jomashop • Catálogo Completo
              </p>
            </div>
            <button
              onClick={() => router.push("/admin")}
              className="px-6 py-3 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all text-sm uppercase tracking-widest font-bold"
            >
              ← Volver
            </button>
          </div>
        </div>

        <div className="bg-white border border-glassBorder p-8 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Download className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-serif text-text">Importar Página Completa</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-muted text-xs uppercase tracking-widest mb-2 block">
                URL de Categoría o Marca
              </label>
              <input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://www.giftexpress.com/brand/armaf.html"
                className="w-full p-4 bg-bg border border-glassBorder rounded-xl text-text placeholder:text-muted/40 outline-none focus:border-accent transition-all"
              />
              <p className="text-muted text-xs mt-2 leading-relaxed">
                Pega la URL de una categoría completa. Ejemplo:<br/>
                • https://www.giftexpress.com/brand/armaf.html<br/>
                • https://www.jomashop.com/perfumes.html
              </p>
            </div>

            <button
              onClick={handleImportUrl}
              disabled={!productUrl || loading}
              className="w-full bg-text text-white font-bold py-5 rounded-xl uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Importando... (Puede tardar 1-2 minutos)
                </>
              ) : (
                <>
                  <Download className="h-6 w-6" />
                  Importar Todos los Productos
                </>
              )}
            </button>

            {result && (
              <div className={`p-6 rounded-2xl ${
                result.includes('✅') 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <pre className={`text-sm font-medium whitespace-pre-wrap ${
                  result.includes('✅') ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result}
                </pre>
              </div>
            )}
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <p className="text-blue-700 font-bold text-base mb-5">
            💡 Cómo funciona la Importación Masiva:
          </p>
          
          <ol className="text-blue-600 text-sm space-y-3 list-decimal list-inside">
            <li className="leading-relaxed">
              <strong>Encuentra una categoría o marca</strong> en GiftExpress/Jomashop
              <p className="text-xs text-blue-500 ml-6 mt-1">
                Ejemplo: https://www.giftexpress.com/brand/armaf.html
              </p>
            </li>
            <li className="leading-relaxed">
              <strong>Copia la URL completa</strong> de esa página
            </li>
            <li className="leading-relaxed">
              <strong>Pégala arriba</strong> en el campo de URL
            </li>
            <li className="leading-relaxed">
              <strong>Click "Importar Todos los Productos"</strong>
            </li>
            <li className="leading-relaxed">
              El sistema:
              <ul className="text-xs text-blue-500 ml-6 mt-1 space-y-1">
                <li>• Extrae TODOS los productos de esa página</li>
                <li>• Calcula precio ÍKHOR automáticamente (fórmula híbrida)</li>
                <li>• Los añade con stock 0 (pre-orden)</li>
                <li>• En 1-2 minutos tienes 100+ productos listos</li>
              </ul>
            </li>
          </ol>

          <div className="mt-6 p-5 rounded-xl bg-white border border-blue-200">
            <p className="text-text font-bold text-sm mb-2">
              📊 Recomendación:
            </p>
            <p className="text-blue-600 text-sm">
              Importa categoría por categoría (Armaf, Chanel, Dior, etc.) para mantener el catálogo organizado.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
