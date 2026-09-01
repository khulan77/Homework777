import { Manuu } from "@/components/manuu/Manuu";
import { NumberViz } from "@/components/shagai/Shagai";
import { ButtonLink } from "@/components/ui/Button";
import { DialogueDemo } from "./DialogueDemo";

/**
 * Landing page — ЭЦЭГ ЭХЭД зориулагдана.
 * Хүүхэд энд ирэхгүй: тэд /khuuhed руу шууд ордог.
 * Тиймээс өнгө аяс нь хүүхдийн дэлгэцээс өөр — тайван, бодит.
 */
export default function Page() {
  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2.5">
          <span className="flex items-center gap-2.5 font-display text-xl font-bold">
            <span className="w-9"><Manuu size="sm" /></span>
            Мануу
          </span>
          <span className="hidden gap-6 text-[14.5px] text-ink-2 md:flex">
            <a href="#yalgaa" className="hover:text-ink">Ялгаа</a>
            <a href="#shagai" className="hover:text-ink">Шагай</a>
            <a href="#etseg" className="hover:text-ink">Эцэг эхэд</a>
            <a href="#une" className="hover:text-ink">Үнэ</a>
          </span>
          <ButtonLink href="/khuuhed" size="md">Туршиж үзэх</ButtonLink>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <header className="relative overflow-hidden bg-gradient-to-b from-sky-hi to-sky-lo">
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 pb-14 pt-16 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="mb-3.5 block text-[11.5px] font-semibold uppercase tracking-[0.19em] text-blue-dk">
              1–5-р ангийн хүүхдэд · Монгол хэлээр
            </span>
            <h1 className="max-w-[15ch] text-[clamp(32px,5.6vw,54px)] font-bold text-[#1B2E3E]">
              Даалгавраа хийхэд хажууд нь суух найз
            </h1>
            <p className="mt-5 max-w-[46ch] text-[19px] text-[#3E5768]">
              Мануу хариуг мэддэг ч <b>хэлж өгдөггүй</b>. Асуулт асууж, алхам
              алхмаар чиглүүлж, хүүхдээр өөрөөр нь бодуулна.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/khuuhed">Үнэгүй туршиж үзэх</ButtonLink>
              <ButtonLink href="#yalgaa" variant="ghost">Хэрхэн ажилладаг вэ?</ButtonLink>
            </div>
            <p className="mt-3.5 text-[13.5px] text-[#5B7285]">
              Эцэг эх бүртгүүлнэ · Картын мэдээлэл шаардахгүй · 2 минутад бэлэн
            </p>
          </div>
          <div className="grid justify-items-center gap-3">
            <p className="max-w-[260px] rounded-[20px] border-2 border-white bg-white px-4 py-3 text-[15.5px] font-medium text-[#1B2E3E] shadow-lg">
              Сайн уу! Би Мануу 🐱 Өнөөдөр ямар даалгавар хийх вэ?
            </p>
            <Manuu size="lg" waving />
          </div>
        </div>
      </header>

      {/* ─── ASUUDAL ─── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <span className="mb-3.5 block text-[11.5px] font-semibold uppercase tracking-[0.19em] text-blue">
          Танил зураг
        </span>
        <p className="font-display text-[clamp(48px,9vw,84px)] font-bold leading-none tabular text-blue">
          19:40
        </p>
        <h2 className="mt-3 max-w-[19ch] text-[clamp(27px,4.2vw,40px)] font-bold">
          Та дөнгөж ажлаасаа ирлээ. Дэвтэр хоосон хэвээр.
        </h2>
        <div className="mt-8 grid gap-3.5 md:grid-cols-3">
          <Pain emo="😔" q="«Ээж ээ, би үүнийг ойлгохгүй байна»">
            Та тайлбарлахыг хүсэж байгаа ч ядарсан. Гуравдугаар удаагаа хэлэхэд
            дуу чинь өөрчлөгдөж эхэлнэ.
          </Pain>
          <Pain emo="⏳" q="Хүүхэд 20 минут ганцаараа суулаа">
            Гацсандаа биш — асуух хүн байхгүйдээ. Дараа нь «би чаддаггүй юм байна»
            гэж бодож эхэлнэ.
          </Pain>
          <Pain emo="📘" q="Аргачлал нь таны сурсанаас өөр">
            Та зөв хариуг мэдэж байгаа ч багшийн заасан аргаар тайлбарлаж чадахгүй.
          </Pain>
        </div>
        <p className="mt-8 max-w-[56ch] text-[19px]">
          Мануу энэ 40 минутыг тайван болгоно. Хариу өгснөөрөө биш —{" "}
          <b>хүүхэдтэй хамт бодсоноороо</b>.
        </p>
      </section>

      {/* ─── YALGAA ─── */}
      <section id="yalgaa" className="bg-card-2 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <span className="mb-3.5 block text-[11.5px] font-semibold uppercase tracking-[0.19em] text-blue">
            Хамгийн чухал ялгаа
          </span>
          <h2 className="max-w-[19ch] text-[clamp(27px,4.2vw,42px)] font-bold">
            Мануу хариуг хэлдэггүй
          </h2>
          <p className="mt-4 max-w-[56ch] text-[18px] text-ink-2">
            Хүүхэд «24 + 18 хэд вэ?» гэж асуухад ихэнх AI «42» гэж хариулна. Тэр
            мөчид суралцах үйл явц дуусна. Мануу өөр замаар явна:
          </p>
          <DialogueDemo />
          <div className="mt-6 max-w-[62ch] rounded-2xl border border-line border-l-[5px] border-l-grass bg-card p-5 text-[16px] text-ink-2">
            Энэ бол <b className="text-ink">scaffolding</b> — сайн багш нарын хийдэг зүйл.
            Хүүхэд <b className="text-ink">гурав дахь удаагаа</b> гацвал Мануу тайлбарлаж
            өгөөд, дараа нь ижил төрлийн шинэ бодлого өгнө.
          </div>
        </div>
      </section>

      {/* ─── SHAGAI ─── */}
      <section id="shagai" className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
        <div>
          <span className="mb-3.5 block text-[11.5px] font-semibold uppercase tracking-[0.19em] text-blue">
            Тоо гэдэг хийсвэр зүйл биш
          </span>
          <h2 className="max-w-[19ch] text-[clamp(27px,4.2vw,40px)] font-bold">
            Тоог гараараа барьж болдог юм шиг
          </h2>
          <p className="mt-4 max-w-[56ch] text-[18px] text-ink-2">
            Бага ангийн хүүхэд «24» гэдэг цифрийг харахад юу ч мэдрэхгүй. Харин{" "}
            <b className="text-ink">2 тавиур ба 4 шагай</b> гэж харвал аравтын орон
            гэж юу болохыг нүдээрээ ойлгоно.
          </p>
          <p className="mt-3.5 max-w-[56ch] text-[18px] text-ink-2">
            Монгол хүүхэд шагайгаар тоолж, тоглож өсдөг. Бид гадны блок зээлээгүй —
            гарт нь аль хэдийн танил зүйлийг ашигласан.
          </p>
          <p className="mt-4 text-[13.5px] text-muted">
            👆 Тавиур дээр дарж үзээрэй — нэг нэгээр нь тоолж өгнө.
          </p>
        </div>
        <div>
          <div className="flex flex-wrap items-end justify-center gap-3 rounded-3xl bg-gradient-to-b from-earth to-[#9A7C48] px-5 pb-8 pt-7 shadow-xl">
            <NumberViz value={24} />
          </div>
          <p className="mt-5 text-center font-display text-2xl font-bold">
            24 = 2 тавиур + 4 шагай
          </p>
        </div>
      </section>

      {/* ─── ETSEG EH ─── */}
      <section id="etseg" className="bg-card-2 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <span className="mb-3.5 block text-[11.5px] font-semibold uppercase tracking-[0.19em] text-blue">
            Эцэг эхэд
          </span>
          <h2 className="max-w-[19ch] text-[clamp(27px,4.2vw,42px)] font-bold">
            Бид юуг зориудаар хийхгүй вэ
          </h2>
          <div className="mt-8 grid gap-3.5 md:grid-cols-2">
            <Trust icon="⏰" title="Дэлгэцийн цагийг та тогтооно">
              Цаг дуусахад Мануу «одоо амарцгаая» гэж өөрөө зогсооно. Дараагийн
              даалгавар санал болгохгүй.
            </Trust>
            <Trust icon="🔒" title="Хувийн мэдээлэл цуглуулахгүй">
              Нэр, анги, төрсөн сар — тэгээд л болоо. Хаяг, сургууль асуухгүй.
              Даалгаврын зураг 30 хоногийн дараа устана.
            </Trust>
            <Trust icon="📋" title="Хуулах боломжгүй">
              Эцсийн хариуг Мануу дэлгэцэнд бичихгүй — хүүхэд өөрөө оруулна.
              Тайланд «хэдийг нь өөрөө бодсон» гэдэг харагдана.
            </Trust>
            <Trust icon="💬" title="Хүүхдээ тагнахгүй">
              Та тойм харна, бүтэн яриаг биш. Хүүхэд чөлөөтэй алдаа гаргаж чаддаг
              байх ёстой — тэр л сурах гол нөхцөл.
            </Trust>
          </div>
        </div>
      </section>

      {/* ─── UNE ─── */}
      <section id="une" className="mx-auto max-w-6xl px-5 py-20">
        <span className="mb-3.5 block text-[11.5px] font-semibold uppercase tracking-[0.19em] text-blue">
          Үнэ
        </span>
        <h2 className="max-w-[22ch] text-[clamp(27px,4.2vw,40px)] font-bold">
          Хувийн багшийн нэг цагийн үнээр — сар бүтэн
        </h2>
        <div className="mt-8 grid items-center gap-5 md:grid-cols-[1fr_1.08fr]">
          <div className="grid gap-3.5 rounded-3xl border-2 border-line bg-card p-7">
            <span className="font-display text-xl font-bold">Танилцах</span>
            <span className="font-display text-4xl font-bold">Үнэгүй</span>
            <Feats items={["Өдөрт 5 бодлого", "1 хүүхэд", "Математик", "Долоо хоногийн тойм"]} />
            <ButtonLink href="/khuuhed" variant="ghost">Эхлэх</ButtonLink>
          </div>
          <div className="relative grid gap-3.5 rounded-3xl border-2 border-grass bg-card p-7 shadow-xl">
            <span className="absolute -top-3 left-6 rounded-full bg-grass px-3 py-1 text-[10.5px] font-bold tracking-[0.12em] text-white">
              САНАЛ БОЛГОХ
            </span>
            <span className="font-display text-xl font-bold">Гэр бүл</span>
            <span className="font-display text-4xl font-bold">
              ₮15,000 <small className="font-sans text-[15px] font-medium text-muted">/ сар</small>
            </span>
            <Feats
              items={[
                "Хязгааргүй бодлого",
                "3 хүртэл хүүхэд",
                "Математик ба Монгол хэл",
                "Дэвтрийн зургаар даалгавар оруулах",
                "Мануу ярина (дуут тайлбар)",
              ]}
            />
            <ButtonLink href="/khuuhed">14 хоног үнэгүй туршина</ButtonLink>
          </div>
        </div>
        <p className="mt-5 text-center text-[14.5px] text-muted">
          Хэдийд ч цуцалж болно. Qpay, банкны картаар төлнө.
        </p>
      </section>

      <footer className="border-t border-line py-9 text-[14px] text-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-5 px-5">
          <span>Мануу · Монгол хүүхдэд зориулсан гэрийн даалгаврын найз</span>
          <span>Нууцлал · Үйлчилгээний нөхцөл</span>
        </div>
      </footer>
    </>
  );
}

function Pain({ emo, q, children }: { emo: string; q: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 rounded-[20px] border border-line bg-card p-6 shadow-[0_4px_0_rgb(27_46_62/0.08)]">
      <span className="text-[26px]">{emo}</span>
      <p className="text-[16.5px] font-semibold italic text-ink">{q}</p>
      <p className="text-[15px] text-ink-2">{children}</p>
    </div>
  );
}

function Trust({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-start gap-4 rounded-[20px] border border-line bg-card p-5.5 p-6">
      <span className="grid h-12 w-12 place-items-center rounded-[14px] border border-line bg-card-2 text-[22px]">
        {icon}
      </span>
      <span>
        <span className="mb-1 block text-[17px] font-semibold">{title}</span>
        <span className="block text-[14.5px] text-ink-2">{children}</span>
      </span>
    </div>
  );
}

function Feats({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 text-[15px] text-ink-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2.5">
          <span className="font-bold text-grass-dk">✓</span>
          {i}
        </li>
      ))}
    </ul>
  );
}
