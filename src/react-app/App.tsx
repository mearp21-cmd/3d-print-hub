import { useMemo, useState } from "react";
import "./App.css";

const categories = [
  { icon: "🔧", name: "Tools & DIY", count: "1,240 designs" },
  { icon: "🚗", name: "Automotive", count: "860 designs" },
  { icon: "🎮", name: "Gaming", count: "2,410 designs" },
  { icon: "🏠", name: "Home", count: "1,875 designs" },
  { icon: "🎨", name: "Models", count: "3,120 designs" },
  { icon: "⚙️", name: "Engineering", count: "940 designs" },
];

const designs = [
  {
    title: "Modular Workshop Organiser",
    creator: "PrintForge",
    category: "Tools & DIY",
    rating: "4.9",
    downloads: "8.4k",
    downloadNumber: 8400,
    tag: "Trending",
    icon: "🧰",
    access: "Free",
    age: 10,
    description:
      "A modular workshop organiser designed to keep tools, screws and small parts neatly arranged.",
  },
  {
    title: "Universal Phone Stand",
    creator: "MakerMatt",
    category: "Home",
    rating: "4.8",
    downloads: "6.1k",
    downloadNumber: 6100,
    tag: "Popular",
    icon: "📱",
    access: "Free",
    age: 8,
    description:
      "A simple adjustable phone stand suitable for desks, benches and bedside tables.",
  },
  {
    title: "Off-Road Keyring Set",
    creator: "LayerLab",
    category: "Automotive",
    rating: "5.0",
    downloads: "4.7k",
    downloadNumber: 4700,
    tag: "New",
    icon: "🚙",
    access: "Pro",
    age: 1,
    description:
      "A rugged automotive-inspired keyring collection made for 3D printing.",
  },
  {
    title: "Miniature Space Rover",
    creator: "CosmoPrints",
    category: "Models",
    rating: "4.9",
    downloads: "12.2k",
    downloadNumber: 12200,
    tag: "Featured",
    icon: "🚀",
    access: "Pro",
    age: 5,
    description:
      "A detailed miniature space rover designed as a fun display model.",
  },
  {
    title: "Controller Wall Mount",
    creator: "GameGrid",
    category: "Gaming",
    rating: "4.7",
    downloads: "3.9k",
    downloadNumber: 3900,
    tag: "Free",
    icon: "🎮",
    access: "Free",
    age: 12,
    description:
      "A compact wall mount for keeping your gaming controller safely off the desk.",
  },
  {
    title: "Precision Cable Clips",
    creator: "ProtoWorks",
    category: "Engineering",
    rating: "4.8",
    downloads: "5.3k",
    downloadNumber: 5300,
    tag: "Free",
    icon: "🔩",
    access: "Free",
    age: 15,
    description:
      "Small precision cable clips designed for clean and organised cable management.",
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [access, setAccess] = useState("All");
  const [sort, setSort] = useState("Trending");
  const [notice, setNotice] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<
    (typeof designs)[number] | null
  >(null);
  const [favourites, setFavourites] = useState<string[]>([]);

  const filteredDesigns = useMemo(() => {
    const results = designs.filter((design) => {
      const text =
        `${design.title} ${design.creator} ${design.category}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || design.category === category;

      const matchesAccess =
        access === "All" || design.access === access;

      return matchesSearch && matchesCategory && matchesAccess;
    });

    return [...results].sort((a, b) => {
      if (sort === "Most downloaded") {
        return b.downloadNumber - a.downloadNumber;
      }

      if (sort === "Highest rated") {
        return Number(b.rating) - Number(a.rating);
      }

      if (sort === "Newest") {
        return a.age - b.age;
      }

      return b.downloadNumber - a.downloadNumber;
    });
  }, [search, category, access, sort]);

  const showNotice = (message: string) => {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 2500);
  };

  const scrollToExplore = () => {
    document
      .getElementById("explore")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFavourite = (title: string) => {
    setFavourites((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title]
    );
  };

  const handleDownload = (design: (typeof designs)[number]) => {
    if (design.access === "Pro") {
      showNotice(
        "💎 This blueprint requires Pro membership. Membership payments are coming soon."
      );
      return;
    }

    showNotice(
      "⬇️ Download system will be connected when blueprint storage is added."
    );
  };

  return (
    <div className="site">

      {/* NOTIFICATION */}
      {notice && <div className="notice">{notice}</div>}

      {/* NAVIGATION */}
      <header className="navbar">
        <a href="#" className="logo">
          <span className="logoBox">3D</span>
          <span>
            PRINT <b>HUB</b>
          </span>
        </a>

        <nav>
          <a href="#explore">Explore</a>
          <a href="#categories">Categories</a>
          <a href="#creators">Creators</a>
          <a href="#membership">Membership</a>

          <button
            className="loginButton"
            onClick={() =>
              showNotice("User accounts will be connected next.")
            }
          >
            Sign in
          </button>

          <button
            className="primaryButton"
            onClick={() =>
              showNotice("Blueprint uploading is coming next.")
            }
          >
            Upload Blueprint
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">

        <div className="heroGlow"></div>

        <div className="heroText">

          <div className="eyebrow">
            THE HOME OF 3D PRINTING
          </div>

          <h1>
            Create.
            <br />
            <span>Share. Print.</span>
          </h1>

          <p>
            Discover useful designs, share your creations and turn
            your ideas into something real.
          </p>

          {/* SEARCH */}
          <div className="searchBox">

            <span className="searchIcon">⌕</span>

            <input
              type="text"
              placeholder="Search blueprints, models, tools..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <button onClick={scrollToExplore}>
              Search
            </button>

          </div>

          <div className="heroButtons">

            <button
              className="primaryButton large"
              onClick={scrollToExplore}
            >
              Explore Designs →
            </button>

            <button
              className="secondaryButton"
              onClick={() =>
                showNotice("Upload system coming next.")
              }
            >
              + Upload a Blueprint
            </button>

          </div>

          <div className="stats">

            <div>
              <strong>10K+</strong>
              <span>Designs</span>
            </div>

            <div>
              <strong>5K+</strong>
              <span>Makers</span>
            </div>

            <div>
              <strong>25K+</strong>
              <span>Downloads</span>
            </div>

          </div>

        </div>

        {/* 3D VISUAL */}
        <div className="heroVisual">

          <div className="orbit orbitOne"></div>
          <div className="orbit orbitTwo"></div>

          <div className="floatingObject objectOne">
            ⚙️
          </div>

          <div className="floatingObject objectTwo">
            🧩
          </div>

          <div className="floatingObject objectThree">
            🚀
          </div>

          <div className="mainObject">
            ⬡
          </div>

          <div className="floatingLabel labelOne">
            STL • 3MF
          </div>

          <div className="floatingLabel labelTwo">
            PRINT READY
          </div>

        </div>

      </section>

      {/* FEATURE STRIP */}
      <section className="featureStrip">

        <span>✦ FREE TO START</span>
        <span>✦ CREATOR FRIENDLY</span>
        <span>✦ PRINT-READY FILES</span>
        <span>✦ COMMUNITY POWERED</span>

      </section>

      {/* CATEGORIES */}
      <section
        className="section"
        id="categories"
      >

        <div className="sectionHeading">

          <div>
            <div className="eyebrow">
              FIND YOUR NEXT PROJECT
            </div>

            <h2>
              Explore by category
            </h2>
          </div>

          <button
            className="textButton"
            onClick={() => {
              setCategory("All");
              scrollToExplore();
            }}
          >
            View all →
          </button>

        </div>

        <div className="categoryGrid">

          {categories.map((item) => (

            <button
              className="categoryCard"
              key={item.name}
              onClick={() => {
                setCategory(item.name);
                scrollToExplore();
              }}
            >

              <span className="categoryIcon">
                {item.icon}
              </span>

              <strong>
                {item.name}
              </strong>

              <small>
                {item.count}
              </small>

              <span className="cardArrow">
                ↗
              </span>

            </button>

          ))}

        </div>

      </section>

      {/* DESIGNS */}
      <section
        className="section exploreSection"
        id="explore"
      >

        <div className="sectionHeading">

          <div>
            <div className="eyebrow">
              DISCOVER SOMETHING AWESOME
            </div>

            <h2>
              {category === "All"
                ? "Trending designs"
                : category}
            </h2>
          </div>

          <div className="exploreControls">

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              <option value="All">
                All categories
              </option>

              {categories.map((item) => (
                <option
                  key={item.name}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}

            </select>

            <select
              value={access}
              onChange={(event) =>
                setAccess(event.target.value)
              }
            >
              <option value="All">
                Free + Pro
              </option>

              <option value="Free">
                Free only
              </option>

              <option value="Pro">
                Pro only
              </option>
            </select>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
            >
              <option value="Trending">
                Trending
              </option>

              <option value="Newest">
                Newest
              </option>

              <option value="Most downloaded">
                Most downloaded
              </option>

              <option value="Highest rated">
                Highest rated
              </option>
            </select>

          </div>

        </div>

        <div className="designGrid">

          {filteredDesigns.map((design) => (

            <article
              className="designCard"
              key={design.title}
            >

              <div className="designImage">

                <span className="designTag">
                  {design.access === "Pro"
                    ? "💎 PRO"
                    : design.tag}
                </span>

                <button
                  className="heart"
                  aria-label={
                    favourites.includes(design.title)
                      ? "Remove from favourites"
                      : "Add to favourites"
                  }
                  onClick={() => {
                    const alreadyFavourite =
                      favourites.includes(design.title);

                    toggleFavourite(design.title);

                    showNotice(
                      alreadyFavourite
                        ? "Removed from favourites."
                        : "Added to favourites."
                    );
                  }}
                >
                  {favourites.includes(design.title)
                    ? "♥"
                    : "♡"}
                </button>

                <div className="designEmoji">
                  {design.icon}
                </div>

              </div>

              <div className="designDetails">

                <div className="rating">
                  ★ {design.rating}

                  <span>
                    {" "}
                    • {design.downloads} downloads
                  </span>
                </div>

                <h3>
                  {design.title}
                </h3>

                <p>
                  by <b>{design.creator}</b>
                </p>

                <button
                  className="viewButton"
                  onClick={() =>
                    setSelectedDesign(design)
                  }
                >
                  View blueprint →
                </button>

              </div>

            </article>

          ))}

        </div>

        {filteredDesigns.length === 0 && (
          <div className="empty">
            No designs found. Try another search.
          </div>
        )}

      </section>

      {/* CREATOR SECTION */}
      <section
        className="creatorSection"
        id="creators"
      >

        <div>

          <div className="eyebrow">
            MADE BY MAKERS, FOR MAKERS
          </div>

          <h2>
            Have a design?
            <br />
            <span>Put it out there.</span>
          </h2>

          <p>
            Upload your creations, build a following
            and eventually earn from your best work.
          </p>

          <button
            className="primaryButton large"
            onClick={() =>
              showNotice(
                "Creator uploads will be connected next."
              )
            }
          >
            Become a Creator →
          </button>

        </div>

        <div className="creatorGraphic">

          <div className="creatorCircle">
            ◈
          </div>

          <span>UPLOAD</span>
          <span>SHARE</span>
          <span>CREATE</span>

        </div>

      </section>

      {/* MEMBERSHIP */}
      <section
        className="section membership"
        id="membership"
      >

        <div className="sectionHeading centered">

          <div>

            <div className="eyebrow">
              SIMPLE MEMBERSHIP
            </div>

            <h2>
              Free to start.
              <br />
              <span>More power when you need it.</span>
            </h2>

            <p>
              Keep the community accessible while giving
              serious makers extra tools.
            </p>

          </div>

        </div>

        <div className="plans">

          <div className="plan">

            <div className="planLabel">
              FREE
            </div>

            <h3>
              Maker
            </h3>

            <div className="price">
              $0
              <small>
                / month
              </small>
            </div>

            <ul>
              <li>Explore blueprints</li>
              <li>Free downloads</li>
              <li>Save favourites</li>
              <li>Join the community</li>
            </ul>

            <button
              className="secondaryButton full"
              onClick={() =>
                showNotice(
                  "You're already on the free plan."
                )
              }
            >
              Get Started
            </button>

          </div>

          <div className="plan featuredPlan">

            <div className="planLabel">
              POPULAR
            </div>

            <h3>
              Pro Maker
            </h3>

            <div className="price">
              $4.99
              <small>
                / month
              </small>
            </div>

            <ul>
              <li>Extra downloads & tools</li>
              <li>Creator analytics</li>
              <li>Advanced creator profile</li>
              <li>Priority features</li>
            </ul>

            <button
              className="primaryButton full"
              onClick={() =>
                showNotice(
                  "Payments will be connected after the marketplace is ready."
                )
              }
            >
              Coming Soon
            </button>

          </div>

        </div>

      </section>

      {/* ADVERTISING */}
      <section className="advertising">

        <span>
          ADVERTISEMENT
        </span>

        <strong>
          Your brand could live here.
        </strong>

        <small>
          Non-intrusive advertising helps keep
          3D Print Hub growing.
        </small>

      </section>

      {/* BLUEPRINT DETAILS MODAL */}
      {selectedDesign && (

        <div
          className="modalOverlay"
          onClick={() =>
            setSelectedDesign(null)
          }
        >

          <div
            className="blueprintModal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modalClose"
              onClick={() =>
                setSelectedDesign(null)
              }
              aria-label="Close"
            >
              ×
            </button>

            <div className="modalVisual">

              <span className="modalTag">
                {selectedDesign.access === "Pro"
                  ? "💎 PRO"
                  : "FREE"}
              </span>

              <div className="modalEmoji">
                {selectedDesign.icon}
              </div>

            </div>

            <div className="modalContent">

              <div className="eyebrow">
                {selectedDesign.category}
              </div>

              <h2>
                {selectedDesign.title}
              </h2>

              <p className="modalCreator">
                Created by{" "}
                <b>
                  {selectedDesign.creator}
                </b>
              </p>

              <div className="modalStats">

                <span>
                  ★ {selectedDesign.rating}
                </span>

                <span>
                  ⬇ {selectedDesign.downloads}
                </span>

                <span>
                  {selectedDesign.access === "Pro"
                    ? "💎 Pro"
                    : "🆓 Free"}
                </span>

              </div>

              <p className="modalDescription">
                {selectedDesign.description}
              </p>

              <div className="fileTypes">

                <span>
                  STL
                </span>

                <span>
                  3MF
                </span>

                <span>
                  PRINT READY
                </span>

              </div>

              <button
                className="primaryButton large full"
                onClick={() =>
                  handleDownload(selectedDesign)
                }
              >
                {selectedDesign.access === "Pro"
                  ? "💎 Get Pro Access"
                  : "⬇ Download Blueprint"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* FOOTER */}
      <footer>

        <div className="footerTop">

          <div>

            <a href="#" className="logo">

              <span className="logoBox">
                3D
              </span>

              <span>
                PRINT <b>HUB</b>
              </span>

            </a>

            <p>
              Discover. Create. Print.
            </p>

          </div>

          <div className="footerLinks">

            <a href="#explore">
              Explore
            </a>

            <a href="#categories">
              Categories
            </a>

            <a href="#creators">
              Creators
            </a>

            <a href="#membership">
              Membership
            </a>

            <a href="#">
              Help
            </a>

          </div>

        </div>

        <div className="footerBottom">

          <span>
            © 2026 3D Print Hub
          </span>

          <span>
            Built for makers everywhere.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;
