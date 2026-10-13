import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="hidden">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the{" "}
            <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
              page.tsx
            </code>{" "}
            file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert h-[14px] w-4"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={14}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-12 text-white shadow-xl sm:px-10 md:py-16">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">DK LAO · INDUSTRIAL 4S</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">ທຸກໂມດູນທຸລະກິດ ເຊື່ອມຕໍ່ຈາກຈຸດດຽວ</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">ຈາກສິນຄ້າ, ບໍລິການຊ່າງ, ການເຊົ່າ, ຈົນເຖິງການຈັດການກອງລົດລູກຄ້າ. ເລືອກໂມດູນທີ່ຕ້ອງການ ແລະ ສືບຕໍ່ວຽກໄດ້ທັນທີ.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/store" className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-400">ເລືອກຊື້ອາໄຫຼ່ →</Link>
              <Link href="/client-dashboard" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">ເຂົ້າສູນ Fleet →</Link>
            </div>
          </div>
        </section>

        <section className="py-10" aria-labelledby="modules-heading">
          <h2 id="modules-heading" className="text-2xl font-black text-slate-900 dark:text-white">ໂມດູນຂອງລະບົບ</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ເຂົ້າຫາຂໍ້ມູນ ແລະ ຂັ້ນຕອນງານທີ່ກ່ຽວຂ້ອງໄດ້ຈາກທຸກໜ້າ.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { href: "/store", title: "ສິນຄ້າ ແລະ ອາໄຫຼ່", label: "Store & Parts", detail: "ຄົ້ນຫາສິນຄ້າ ແລະ ສົ່ງຄຳສັ່ງຊື້ B2B." },
              { href: "/services", title: "ບໍລິການ 4S", label: "Sales · Service · Spares · Solutions", detail: "ຂໍລາຄາ, ນັດໝາຍຊ່າງ, ແລະ ວາງແຜນ PM." },
              { href: "/services/rental", title: "ເຊົ່າລົດຟອກລີບ", label: "Fleet Rental", detail: "ເບິ່ງແພັກເກັດເຊົ່າ ແລະ ຂໍໃບສະເໜີລາຄາ." },
              { href: "/services/resource-center", title: "ສູນຂໍ້ມູນ", label: "Resource Center", detail: "ຄູ່ມືກວດເຊັກ ແລະ ເອກະສານສຳລັບອົງກອນ." },
              { href: "/client-dashboard", title: "ສູນຈັດການ Fleet", label: "Client Fleet Dashboard", detail: "ເບິ່ງລາຍການລົດ ແລະ ເຊື່ອມຕໍ່ໄປ Service/Parts." },
            ].map((module) => (
              <Link key={module.href} href={module.href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg dark:border-white/10 dark:bg-slate-900">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{module.label}</span>
                <h3 className="mt-2 font-bold text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">{module.title} <span aria-hidden="true">→</span></h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{module.detail}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
