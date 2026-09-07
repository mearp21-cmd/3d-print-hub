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
    tag: "Trending",
    icon: "🧰",
  },
  {
    title: "Universal Phone Stand",
    creator: "MakerMatt",
    category: "Home",
    rating: "4.8",
    downloads: "6.1k",
    tag: "Popular",
    icon: "📱",
  },
  {
    title: "Off-Road Keyring Set",
    creator: "LayerLab",
    category: "Automotive",
    rating: "5.0",
    downloads: "4.7k",
    tag: "New",
    icon: "🚙",
  },
  {
    title: "Miniature Space Rover",
    creator: "CosmoPrints",
    category: "Models",
    rating: "4.9",
    downloads: "12.2k",
    tag: "Featured",
    icon: "🚀",
  },
  {
    title: "Controller Wall Mount",
    creator: "GameGrid",
    category: "Gaming",
    rating: "4.7",
    downloads: "3.9k",
    tag: "Free",
    icon: "🎮",
  },
  {
    title: "Precision Cable Clips",
    creator: "ProtoWorks",
    category: "Engineering",
    rating: "4.8",
    downloads: "5.3k",
    tag: "Free",
    icon: "🔩",
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [notice, setNotice] = useState("");

  const filteredDesigns = useMemo(() => {
    return designs.filter((design) => {
      const text =
        `${design.title} ${design.creator} ${design.category}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || design.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

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

        </div>

        <div className="designGrid">

          {filteredDesigns.map((design) => (

            <article
              className="designCard"
              key={design.title}
            >

              <div className="designImage">

                <span className="designTag">
                  {design.tag}
                </span>

                <button
                  className="heart"
                  onClick={() =>
                    showNotice(
                      "Favourite saved. Accounts are coming soon."
                    )
                  }
                >
                  ♡
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
                    showNotice(
                      "Blueprint details and downloads are coming next."
                    )
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


