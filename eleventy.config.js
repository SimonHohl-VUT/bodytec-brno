/* =============================================================================
   BodytecBrno — konfigurace Eleventy

   Vstup je `src/`, výstup `_site/`. Všechny cesty na výstupu jsou relativní
   (bez úvodního lomítka), aby web fungoval i v podsložce — proto tu záměrně
   NENÍ pathPrefix.
   ========================================================================== */

export default function (eleventyConfig) {
  /* --- statické soubory: kopírují se 1:1, výstupní cesty zůstávají stejné --- */
  eleventyConfig.addPassthroughCopy({
    "src/css": "css",
    "src/js": "js",
    "src/assets": "assets",
    "src/robots.txt": "robots.txt",
    "src/_redirects": "_redirects",
  });

  /* --- rozsah cen pro JSON-LD (priceRange) ---------------------------------
     Počítá se z ceníku, aby nemohl začít lhát. Za jednu lekci člověk zaplatí
     buď cenu za lekci z permanentky, nebo — u jednorázového vstupu — plnou
     cenu. Z těchto čísel se vezme nejnižší a nejvyšší.                       */
  eleventyConfig.addFilter("rozsahCen", function (polozky) {
    const ceny = (polozky || [])
      .map((p) => String(p.za_lekci || p.cena || "").replace(/\D/g, ""))
      .filter(Boolean)
      .map(Number);

    if (!ceny.length) return "";
    const min = Math.min(...ceny);
    const max = Math.max(...ceny);
    return min === max ? `${min} Kč` : `${min}–${max} Kč`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
