import { Play, Search } from "lucide-react";

const listings = [
  {
    title: "Acreage Tracts",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Hunting Land",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Cattle Ranches",
    image:
      "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&w=1200&q=80",
  },
];

const team = [
  {
    name: "Hannah Cole",
    role: "Broker",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mike Turner",
    role: "Partner",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Lena Brooks",
    role: "Agent",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kody Hale",
    role: "Land Specialist",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Jenna Ruiz",
    role: "Office Manager",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
];

const videos = [
  {
    title: "Ranch Market Report",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Cattle Property Tour",
    image:
      "https://images.unsplash.com/photo-1500595046743-ddf4d3d753fd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "How To Buy Land",
    image:
      "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Family Ranch Lifestyle",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Water Rights 101",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Selling Strategies",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Home() {
  return (
    <main className="land-page bg-[#2f211d] text-[#f3ebdf]">
      <section
        className="relative min-h-[88vh] overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14,10,8,.42), rgba(14,10,8,.58)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex h-full max-w-6xl flex-col px-6 pb-16 pt-8">
          <header className="flex items-center justify-between text-xs tracking-[0.25em] text-[#f8efe2]/85">
            <span className="font-semibold">Land Unlimited</span>
            <nav className="hidden gap-8 md:flex">
              <a href="#">Properties</a>
              <a href="#">Buyers</a>
              <a href="#">Sellers</a>
              <a href="#">Contact</a>
            </nav>
            <button className="rounded-full border border-[#f8efe2]/40 px-4 py-2 text-[10px]">
              Get In Touch
            </button>
          </header>

          <div className="mt-28 max-w-xl">
            <p className="text-xs tracking-[0.35em] text-[#f8efe2]/80">
              TEXAS LAND & RANCH REAL ESTATE
            </p>
            <h1 className="mt-4 font-serif text-5xl tracking-[0.18em] md:text-6xl">
              LAND UNLIMITED
            </h1>
            <form className="mt-8 flex w-full items-center gap-2 rounded-full border border-[#f3ebdf]/60 bg-[#f7efe6]/92 p-1 shadow-xl">
              <Search className="ml-3 h-4 w-4 text-[#4e3a2e]" />
              <input
                className="h-10 flex-1 bg-transparent px-2 text-sm text-[#3a2b23] outline-none"
                placeholder="Search county, acreage, price"
              />
              <button className="rounded-full bg-[#49352b] px-6 py-2 text-xs tracking-[0.2em] text-[#f8efe4]">
                SEARCH
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {listings.map((item) => (
            <article key={item.title} className="group overflow-hidden">
              <div
                className="h-40 w-full transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage:
                    `linear-gradient(rgba(20,14,11,.3), rgba(20,14,11,.56)), url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <h3 className="mt-3 text-center font-serif text-lg tracking-[0.12em]">
                {item.title}
              </h3>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#3a2924] py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div
            className="h-72 rounded-sm"
            style={{
              backgroundImage:
                "linear-gradient(rgba(18,12,10,.25), rgba(18,12,10,.5)), url(https://images.unsplash.com/photo-1500595046743-ddf4d3d753fd?auto=format&fit=crop&w=1500&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div>
            <p className="text-xs tracking-[0.28em] text-[#e5d9c8]/80">WHY LANDUNLIMITED</p>
            <h2 className="mt-3 font-serif text-3xl">We know ranchland by heart</h2>
            <p className="mt-4 text-sm leading-7 text-[#e9dece]/82">
              We help buyers and sellers navigate acreage, livestock operations, and
              investment tracts with confidence. Our team focuses on stewardship,
              value, and legacy so every closing feels right for your future.
            </p>
            <button className="mt-6 border border-[#e7dbc8]/70 px-5 py-2 text-xs tracking-[0.24em]">
              LEARN MORE
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-serif text-4xl">Our Team</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
          {team.map((person) => (
            <article key={person.name} className="text-center">
              <div
                className="mx-auto h-40 w-full max-w-[160px] rounded-sm"
                style={{
                  backgroundImage: `url(${person.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                }}
              />
              <h3 className="mt-3 text-sm tracking-[0.08em]">{person.name}</h3>
              <p className="text-xs text-[#d8cbb8]">{person.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,11,9,.46), rgba(16,11,9,.65)), url(https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=2000&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto grid max-w-5xl gap-8 px-6 text-center md:grid-cols-2">
          <div className="rounded-sm bg-black/20 p-8 backdrop-blur-[1px]">
            <h3 className="font-serif text-3xl">Selling a Property?</h3>
            <p className="mt-3 text-sm leading-7 text-[#ebdfd0]/85">
              Accurate pricing, modern marketing, and direct outreach to qualified land buyers.
            </p>
            <button className="mt-6 border border-[#f1e7da]/70 px-6 py-2 text-xs tracking-[0.2em]">
              LIST YOUR LAND
            </button>
          </div>
          <div className="rounded-sm bg-black/20 p-8 backdrop-blur-[1px]">
            <h3 className="font-serif text-3xl">Buying a Property?</h3>
            <p className="mt-3 text-sm leading-7 text-[#ebdfd0]/85">
              Find your ideal acreage with local experts who understand water, access, and use.
            </p>
            <button className="mt-6 border border-[#f1e7da]/70 px-6 py-2 text-xs tracking-[0.2em]">
              START SEARCHING
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-serif text-4xl">Video Gallery</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <article key={video.title} className="rounded-sm bg-[#4b3730] p-2">
              <div
                className="relative h-40 rounded-sm"
                style={{
                  backgroundImage:
                    `linear-gradient(rgba(13,9,8,.35), rgba(13,9,8,.5)), url(${video.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-[#f2e8db] bg-black/30">
                    <Play className="ml-0.5 h-4 w-4 fill-[#f2e8db] text-[#f2e8db]" />
                  </span>
                </div>
              </div>
              <p className="px-1 pb-1 pt-3 text-sm">{video.title}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#3a2924] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div
            className="mx-auto h-20 w-20 rounded-full border border-[#f1e6d7]/60"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=600&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#efe4d4]">
            &ldquo;The Land Unlimited team guided us through every step with honesty and local
            expertise. We found the exact ranch we had been searching for.&rdquo;
          </p>
          <p className="mt-4 text-xs tracking-[0.2em] text-[#dacdb8]">- JENNY M.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2">
        <div
          className="min-h-64 rounded-sm"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,11,9,.25), rgba(16,11,9,.45)), url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1500&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="flex flex-col justify-center">
          <p className="text-xs tracking-[0.28em] text-[#deceba]">HOMES + LAND</p>
          <h2 className="mt-3 font-serif text-4xl">Looking for Home?</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#e7d9c8]/85">
            From barndominiums to turnkey ranch homes, we connect you with spaces where
            your family can thrive.
          </p>
          <button className="mt-6 w-fit border border-[#ebdece]/70 px-6 py-2 text-xs tracking-[0.2em]">
            VIEW HOMES
          </button>
        </div>
      </section>

      <section className="bg-[#3b2a24] px-6 py-16 text-center">
        <h2 className="font-serif text-3xl">Receive Exclusive Listings in Your Inbox</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-[#e8dccd]/85">
          Join our weekly email and get fresh ranch listings, pricing updates, and market
          insights from local experts.
        </p>
        <form className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            className="h-12 flex-1 border border-[#e7dbc9]/40 bg-transparent px-4 text-sm outline-none"
            placeholder="Email Address"
          />
          <button className="h-12 border border-[#e7dbc9]/70 px-7 text-xs tracking-[0.2em]">
            SUBSCRIBE
          </button>
        </form>
      </section>

      <section
        className="py-20 text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,12,10,.3), rgba(18,12,10,.65)), url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="font-serif text-4xl">Work with Us</h2>
        <button className="mt-6 border border-[#f0e4d5]/80 px-8 py-3 text-xs tracking-[0.24em]">
          CONTACT LAND UNLIMITED
        </button>
      </section>

      <footer className="border-t border-[#e8dbc7]/20 bg-[#2a1d18]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-6 py-10 text-sm md:flex-row">
          <div>
            <h3 className="font-serif text-2xl">Land Unlimited</h3>
            <p className="mt-2 text-[#dbcdb8]/80">Texas Ranch & Land Real Estate</p>
            <p className="mt-4 text-[#dbcdb8]/80">(555) 867-2311</p>
            <p className="text-[#dbcdb8]/80">info@landunlimitedtx.com</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-xs tracking-[0.18em] text-[#e7dbc8]/85">
            <a href="#">PROPERTIES</a>
            <a href="#">BUYERS</a>
            <a href="#">SELLERS</a>
            <a href="#">ABOUT</a>
            <a href="#">VIDEOS</a>
            <a href="#">CONTACT</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
