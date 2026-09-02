import { plugin } from "bun";

/**
 * `server-only` багцыг Next.js өөрөө боловсруулдаг — агуулгыг нь ашигладаггүй.
 * Bun-д шууд импортлоход "Client Component-оос импортлож болохгүй" гэж шидэх тул
 * хоосон виртуал модулиар солино.
 *
 * Тест (`bun test`) болон скрипт (`bun run lib/db/seed.ts`) хоёуланд хэрэгтэй тул
 * bunfig.toml-д ДЭЭД түвшинд preload хийсэн.
 */
plugin({
  name: "server-only-stub",
  setup(build) {
    build.module("server-only", () => ({ exports: {}, loader: "object" }));
  },
});
