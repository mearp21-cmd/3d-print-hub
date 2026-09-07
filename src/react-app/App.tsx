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

