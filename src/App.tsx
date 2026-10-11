import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

const programs = [
  {
    number: "01",
    title: "Strength",
    description: "Build power with progressive training and expert coaching.",
    image:
      "https://images.unsplash.com/photo-1722925541142-5db2668ca492?auto=format&fit=crop&w=1200&q=85",
    position: "center 35%",
  },
  {
    number: "02",
    title: "Conditioning",
    description: "Move faster, last longer, and unlock next-level endurance.",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=85",
    position: "center",
  },
  {
    number: "03",
    title: "Personal training",
    description: "A plan built around your body, your goals, and your schedule.",
    image:
      "https://images.unsplash.com/photo-1683587023194-a24e5b6549b0?auto=format&fit=crop&w=1200&q=85",
    position: "center 20%",
  },
];

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg
    aria-hidden="true"
    className={`h-4 w-4 transition-transform ${diagonal ? "-rotate-45" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const Bolt = () => (
  <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 32 32">
    <path d="M18.6 2 7 18h8l-1.6 12L25 14h-8l1.6-12Z" fill="currentColor" />
  </svg>
);



function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.14 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`reveal ${className}`} ref={elementRef}>
      {children}
    </div>
  );
}

type EnquiryForm = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  membership: string;
  preferred_start_date: string;
  preferred_contact_method: string;
  message: string;
};

const emptyEnquiry: EnquiryForm = {
  name: "",
  email: "",
  phone: "",
  interest: "Strength",
  membership: "Free Starter Session",
  preferred_start_date: "",
  preferred_contact_method: "Email",
  message: "",
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquiry, setEnquiry] = useState<EnquiryForm>(emptyEnquiry);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const closeMenu = () => setMenuOpen(false);

  const handleEnquirySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      setFormStatus("error");
      setFormError("Enquiry form is not configured yet. Please try again later.");
      return;
    }

    setFormStatus("submitting");
    try {
      const response = await fetch(\`\${supabaseUrl}/rest/v1/enquiries\`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: \`Bearer \${supabaseKey}\`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          ...enquiry,
          preferred_start_date: enquiry.preferred_start_date || null,
        }),
      });
      if (!response.ok) {
        throw new Error("We couldn't save your enquiry. Please try again in a moment.");
      }
      setFormStatus("success");
      setEnquiry({ ...emptyEnquiry });
    } catch (error) {
      setFormStatus("error");
      setFormError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-stone-100 text-zinc-950">
      <section id="top" className="relative min-h-[760px] bg-zinc-950 text-white md:min-h-screen">
        <img
          alt="Athlete training with battle ropes"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] opacity-80"
          src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=2200&q=90"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.96)_0%,rgba(9,9,11,0.72)_42%,rgba(9,9,11,0.05)_78%),linear-gradient(0deg,rgba(9,9,11,0.65)_0%,transparent_45%)]" />

        <header className="relative z-20 border-b border-white/15">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:h-24 md:px-10">
            <a className="flex items-center gap-2 text-xl font-black uppercase tracking-tight" href="#top" onClick={closeMenu}>
              <span className="text-orange-500"><Bolt /></span>
              Forge
            </a>
            <nav aria-label="Main navigation" className="hidden items-center gap-9 text-xs font-bold uppercase tracking-[0.18em] md:flex">
              <a className="transition-colors hover:text-orange-500" href="#programs">Programs</a>
              <a className="transition-colors hover:text-orange-500" href="#why-us">Why Forge</a>
              <a className="transition-colors hover:text-orange-500" href="#membership">Membership</a>
              <a className="transition-colors hover:text-orange-500" href="#contact">Contact</a>
            </nav>
            <a className="hidden items-center gap-3 bg-orange-500 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-950 transition-colors hover:bg-orange-400 md:flex" href="#membership">
              Start today <Arrow />
            </a>
            <button
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              className="grid h-11 w-11 place-items-center border border-white/30 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
            >
              <span className="flex w-5 flex-col gap-1.5">
                <span className={`h-0.5 bg-white transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-0.5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 bg-white transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
          {menuOpen && (
            <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-white/15 bg-zinc-950 p-5 text-sm font-bold uppercase tracking-widest md:hidden">
              {[
                ["Programs", "#programs"],
                ["Why Forge", "#why-us"],
                ["Membership", "#membership"],
                ["Contact", "#contact"],
              ].map(([item, href]) => (
                <a className="border-b border-white/10 py-4" href={href} key={item} onClick={closeMenu}>
                  {item}
                </a>
              ))}
            </nav>
          )}
        </header>

        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-end px-5 pb-16 pt-32 md:min-h-[calc(100vh-96px)] md:items-center md:px-10 md:py-20">
          <div className="max-w-4xl">
            <div className="hero-kicker mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-500">
              <span className="h-px w-9 bg-orange-500" />
              Built for more
            </div>
            <h1 className="font-display hero-title text-[clamp(4.5rem,12vw,10rem)] uppercase leading-[0.76] tracking-[-0.055em]">
              <span className="hero-line block">Earn your</span>
              <span className="hero-line hero-line-delay block text-orange-500">strength.</span>
            </h1>
            <div className="hero-copy mt-10 flex flex-col gap-8 md:flex-row md:items-end md:gap-14">
              <p className="max-w-md text-base leading-7 text-zinc-300 md:text-lg">
                Serious coaching. Unmatched energy. A community that refuses to settle. This is where your strongest self begins.
              </p>
              <a className="group flex w-fit items-center gap-5 bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-950 transition-colors hover:bg-orange-500" href="#membership">
                Claim your free session
                <span className="group-hover:translate-x-1"><Arrow /></span>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 z-10 hidden border-l border-t border-white/15 bg-zinc-950/70 px-10 py-5 backdrop-blur-sm lg:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Open today</p>
          <p className="mt-1 font-display text-xl uppercase tracking-wide">5:00 AM — 11:00 PM</p>
        </div>
        <div className="spin-badge absolute bottom-32 right-12 z-10 hidden h-28 w-28 place-items-center rounded-full border border-white/25 xl:grid">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 120 120">
            <defs>
              <path d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" id="circlePath" />
            </defs>
            <text className="fill-white text-[9px] font-bold uppercase tracking-[0.2em]">
              <textPath href="#circlePath">Forge your best • Forge your best • </textPath>
            </text>
          </svg>
          <span className="text-orange-500"><Bolt /></span>
        </div>
      </section>

      <section className="bg-orange-500 py-5 text-zinc-950">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[...Array(2)].flatMap((_, group) =>
            ["No excuses", "Expert coaching", "Real results", "Your strongest era"].map((text, index) => (
              <div className="flex items-center gap-8" key={`${group}-${index}`}>
                <span className="font-display text-2xl uppercase tracking-wide md:text-3xl">{text}</span>
                <Bolt />
              </div>
            )),
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36" id="programs">
        <Reveal className="mb-14 grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <p className="eyebrow">Train with purpose</p>
            <h2 className="font-display mt-4 max-w-3xl text-6xl uppercase leading-[0.88] tracking-[-0.04em] md:text-8xl">
              Find your <span className="text-orange-500">edge.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-zinc-600 md:justify-self-end">
            Every program is engineered to create measurable progress—whether you&apos;re starting fresh or chasing a new personal best.
          </p>
        </Reveal>

        <Reveal className="program-grid grid gap-4 lg:grid-cols-3">
          {programs.map((program) => (
            <article className="program-card group relative min-h-[520px] overflow-hidden bg-zinc-900 text-white" key={program.title}>
              <img
                alt={`${program.title} training`}
                className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                src={program.image}
                style={{ objectPosition: program.position }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/15" />
              <div className="relative flex h-full min-h-[520px] flex-col justify-between p-7">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-[0.2em] text-orange-500">{program.number}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/40 transition-colors group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-zinc-950">
                    <Arrow diagonal />
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-4xl uppercase leading-none tracking-tight md:text-5xl">{program.title}</h3>
                  <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-300">{program.description}</p>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </section>

      <section className="border-y border-zinc-300 bg-white">
        <Reveal className="mx-auto grid max-w-7xl divide-y divide-zinc-200 px-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-10">
          {[
            ["1,800+", "Members stronger"],
            ["96%", "Hit their first milestone"],
            ["4.9", "Average member rating"],
          ].map(([value, label]) => (
            <div className="stat-item group py-10 md:px-10 md:py-14 first:md:pl-0" key={label}>
              <p className="font-display text-6xl leading-none tracking-tight transition-colors group-hover:text-orange-500 md:text-7xl">{value}</p>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</p>
              <span className="mt-6 block h-1 w-10 origin-left bg-orange-500 transition-transform duration-500 group-hover:scale-x-200" />
            </div>
          ))}
        </Reveal>
      </section>

      <section className="bg-zinc-950 text-white" id="why-us">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[520px] lg:min-h-[760px]">
            <img
              alt="Modern strength training space"
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1597076537061-a6b58163aa45?auto=format&fit=crop&w=1600&q=85"
            />
            <div className="absolute inset-0 bg-zinc-950/20" />
            <div className="absolute bottom-6 left-6 bg-orange-500 p-6 text-zinc-950 md:bottom-10 md:left-10 md:p-8">
              <p className="font-display text-5xl leading-none md:text-7xl">12+</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em]">Expert coaches</p>
            </div>
          </div>
          <div className="flex items-center px-5 py-20 md:px-14 md:py-24 lg:px-20">
            <Reveal className="max-w-xl">
              <p className="eyebrow">More than a gym</p>
              <h2 className="font-display mt-5 text-6xl uppercase leading-[0.88] tracking-[-0.04em] md:text-8xl">
                Built to make you <span className="text-orange-500">better.</span>
              </h2>
              <div className="mt-12 divide-y divide-white/15 border-y border-white/15">
                {[
                  ["Coaching that sees you", "Our coaches know your name, your goals, and exactly how to help you get there."],
                  ["Equipment that performs", "Premium strength and conditioning equipment, maintained without compromise."],
                  ["Community that pushes", "Train alongside people who show up, work hard, and bring the best out of you."],
                ].map(([title, text], index) => (
                  <div className="grid grid-cols-[auto_1fr] gap-5 py-7" key={title}>
                    <span className="font-display text-lg text-orange-500">0{index + 1}</span>
                    <div>
                      <h3 className="font-display text-2xl uppercase tracking-wide">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-stone-100 px-5 py-24 md:px-10 md:py-36" id="membership">
        <div className="pointer-events-none absolute -right-8 top-0 font-display text-[14rem] uppercase leading-none text-zinc-950/[0.035] md:text-[24rem]">Go</div>
        <Reveal className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">Your first move</p>
            <h2 className="font-display mt-5 text-6xl uppercase leading-[0.86] tracking-[-0.04em] md:text-8xl lg:text-9xl">
              One session.<br />
              <span className="text-orange-500">Zero cost.</span>
            </h2>
            <p className="mt-8 max-w-lg text-lg leading-8 text-zinc-600">
              Come meet your coach, see the space, and experience a workout built around you. No pressure. No fine print.
            </p>
          </div>
          <div className="border border-zinc-300 bg-white p-7 shadow-[12px_12px_0_0_#f97316] md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">Free starter session includes</p>
            <ul className="mt-7 space-y-5">
              {["60-minute coaching session", "Movement and goal assessment", "Personalized training roadmap"].map((item) => (
                <li className="flex items-center gap-4 text-sm font-bold" key={item}>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-500">
                    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16">
                      <path d="m3 8 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <form className="mt-9 space-y-4" onSubmit={handleEnquirySubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">
                  Full name *
                  <input autoComplete="name" className="mt-2 w-full border border-zinc-300 bg-stone-50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-zinc-950 outline-none transition focus:border-orange-500" name="name" maxLength={120} required value={enquiry.name} onChange={(event) => setEnquiry({ ...enquiry, name: event.target.value })} placeholder="Your name" />
                </label>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">
                  Email address *
                  <input autoComplete="email" className="mt-2 w-full border border-zinc-300 bg-stone-50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-zinc-950 outline-none transition focus:border-orange-500" type="email" name="email" maxLength={254} required value={enquiry.email} onChange={(event) => setEnquiry({ ...enquiry, email: event.target.value })} placeholder="you@example.com" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">
                  Phone number
                  <input autoComplete="tel" className="mt-2 w-full border border-zinc-300 bg-stone-50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-zinc-950 outline-none transition focus:border-orange-500" type="tel" name="phone" maxLength={40} value={enquiry.phone} onChange={(event) => setEnquiry({ ...enquiry, phone: event.target.value })} placeholder="Your phone number" />
                </label>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">
                  Training goal
                  <select className="mt-2 w-full border border-zinc-300 bg-stone-50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-zinc-950 outline-none transition focus:border-orange-500" name="interest" value={enquiry.interest} onChange={(event) => setEnquiry({ ...enquiry, interest: event.target.value })}>
                    <option>Strength</option>
                    <option>Conditioning</option>
                    <option>Personal training</option>
                    <option>Weight management</option>
                    <option>General Enquiry</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">
                  Preferred start date
                  <input className="mt-2 w-full border border-zinc-300 bg-stone-50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-zinc-950 outline-none transition focus:border-orange-500" type="date" name="preferred_start_date" value={enquiry.preferred_start_date} onChange={(event) => setEnquiry({ ...enquiry, preferred_start_date: event.target.value })} />
                </label>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">
                  Preferred contact
                  <select className="mt-2 w-full border border-zinc-300 bg-stone-50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-zinc-950 outline-none transition focus:border-orange-500" name="preferred_contact_method" value={enquiry.preferred_contact_method} onChange={(event) => setEnquiry({ ...enquiry, preferred_contact_method: event.target.value })}>
                    <option>Email</option>
                    <option>Phone</option>
                    <option>WhatsApp</option>
                  </select>
                </label>
              </div>
              <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">
                Anything we should know?
                <textarea className="mt-2 min-h-24 w-full resize-y border border-zinc-300 bg-stone-50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-zinc-950 outline-none transition focus:border-orange-500" name="message" maxLength={5000} value={enquiry.message} onChange={(event) => setEnquiry({ ...enquiry, message: event.target.value })} placeholder="Your goals, questions, or preferred session time" />
              </label>
              <button className="group flex w-full items-center justify-between bg-zinc-950 px-6 py-5 text-left text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-orange-500 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={formStatus === "submitting"}>
                {formStatus === "submitting" ? "Sending your enquiry…" : "Book my free session"}
                <span className="group-hover:translate-x-1"><Arrow /></span>
              </button>
              {formStatus === "success" && <p role="status" className="border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-800">Thanks! Your enquiry has been sent successfully.</p>}
              {formStatus === "error" && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{formError}</p>}
            </form>
            <p className="mt-4 text-center text-[11px] text-zinc-500">No commitment required. Your enquiry is securely saved so the Forge team can follow up.</p>
          </div>
        </Reveal>
      </section>

      <footer className="bg-zinc-950 px-5 pb-8 pt-20 text-white md:px-10" id="contact">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-white/15 pb-16 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <a className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight" href="#top">
                <span className="text-orange-500"><Bolt /></span> Forge
              </a>
              <p className="mt-6 max-w-sm text-sm leading-6 text-zinc-400">A training ground for people who want more from themselves—and a community that helps them earn it.</p>
            </div>
            <div>
              <p className="footer-label">Visit</p>
              <div className="mt-5 text-sm leading-7 text-zinc-300">
                <p>Personal coaching. Real progress.</p>
                <a className="mt-2 inline-flex text-orange-500 hover:text-orange-400" href="#membership">Book a free starter session <Arrow /></a>
              </div>
            </div>
            <div>
              <p className="footer-label">Connect</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-zinc-300">
                <a className="hover:text-orange-500" href="#membership">Membership enquiries</a>
                <span>We aim to reply within one business day.</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600 md:flex-row md:justify-between">
            <p>© 2025 Forge Training Club</p>
            <p>Built for more</p>
          </div>
        </div>
      </footer>


    </main>
  );
}