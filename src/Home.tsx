import { useEffect, useState, useRef } from "react";
import "./Home.css";

const projects = [
    {
        id: 1,
        title: "not cow burgers",
        type: "website development",
        description:
          "A hands-on exploration of material, repair, and experimentation. Focused on learning by doing and working directly with physical constraints.",
        cover: "/6.png",
        images: ["/1/1.jpg", "/1/2.jpg", "/1/3.jpg"],
      },

  {
    id: 2,
    type: "Website develpment",
    title: "La scuoletta",
    description:
      "Small sculptural objects and playful prototypes that explore form, character, and storytelling.",
    cover: "/2.png",
    images: ["/2/1.jpg", "/2/2.jpg", "/2/3.jpg"],
  },
  {
    id: 3,
    title: "I hope therefore I do",
    type: "Exhibition - event",
    description:
      "Colorful compositions and tactile experiments combining paper, texture, and composition.",
    cover: "/3.png",
    images: ["/3/1.jpg", "/3/2.jpg", "/3/3.jpg"],
  },
  {
    id: 4,
    title: "The hub",
    type: "event",
    description:
      "A hands-on exploration of material, repair, and experimentation. Focused on learning by doing and working directly with physical constraints.",
    cover: "/4.png",
    images: ["/1/1.jpg", "/1/2.jpg", "/1/3.jpg"],
  },
  
  {
    id: 6,
    title: "21 days",
    type: "exhibition - social change project",
    description:
      "21 days, is a card game that takes you on a self-journey to reconnect with yourself, others, and the world through small everyday practices. the game it’ s built on the idea that 21 days are enough to change your lifestyle. Completing everyday tasks makes people feel accomplished and more motivated to act. Small actions are easier to do and big change starts small. The game spans 3 weeks, each themed differently. Discovery focuses on self- awareness, Love encourages self-love and building connections, while Growth centers on embracing change for positive transformation. We designed graphics, content, and the exhibition of the game This is a project done with my friend Haymanot fozzati.",
    cover: "/1.png",
    images: [
      "/1/1.png",
      "/1/2.png",
      "/1/3.png",
      "/1/4.png",
      "/1/5.png",
      "/1/6.png",
      "/1/7.png",
    ],
  },

  {
    id: 7,
    title: "Crafting community",
    type: "social change project",
    description:
      "A hands-on exploration of material, repair, and experimentation. Focused on learning by doing and working directly with physical constraints.",
    cover: "/7.png",
    images: ["/1/1.jpg", "/1/2.jpg", "/1/3.jpg"],
    
  },
  {
    id: 8,
    title: "Period Week",
    type: "event",
    description:
      "A hands-on exploration of material, repair, and experimentation. Focused on learning by doing and working directly with physical constraints.",
    cover: "/8.png",
    images: ["/1/1.jpg", "/1/2.jpg", "/1/3.jpg"],
  },
  {
    id: 5,
    title: "Luca stars",
    type: "webside development",
    description:
      "A hands-on exploration of material, repair, and experimentation. Focused on learning by doing and working directly with physical constraints.",
    cover: "/5.png",
    images: ["/1/1.jpg", "/1/2.jpg", "/1/3.jpg"],
  },
];

// 🌸 FLOWER VARIANTS (unchanged)
const flowerVariants = [
  { gif: "/f.gif", png: "/f.png" },
  { gif: "/f2.gif", png: "/f2.png" },
  { gif: "/f3.gif", png: "/f3.png" },
];

type Flower = {
  id: number;
  x: number;
  y: number;
  grown: boolean;
  variant: {
    gif: string;
    png: string;
  };
};

type ImageInfo = {
  src: string;
  orientation: "horizontal" | "vertical";
};

export default function Home() {
  const [activeProject, setActiveProject] = useState<any>(null);
  const [pages, setPages] = useState<ImageInfo[][]>([]);
  const [activePage, setActivePage] = useState(0);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = galleryRef.current;
    if (!el) return;
  
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;           // mouse X inside gallery
    const center = rect.width / 2;
    const distanceFromCenter = x - center;
  
    const maxScrollSpeed = 6;                 // ← tweak this (feel)
    const scrollAmount =
      (distanceFromCenter / center) * maxScrollSpeed;
  
    el.scrollLeft += scrollAmount;
  };
  


  useEffect(() => {
    // set the middle image as active on load
    setActiveIndex(Math.floor(projects.length / 2));
  }, []);
  

  /* -------- FLOWERS (UNCHANGED) -------- */
  const handleBackgroundClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const target = e.target as HTMLElement;

    if (
      target.tagName === "IMG" ||
      target.closest(".popup") ||
      target.closest(".overlay")
    ) {
      return;
    }

    const container = e.currentTarget.getBoundingClientRect();
    const flowerSize = 120;

    const maxY =
      container.top + window.scrollY + container.height - flowerSize;

    const clickY = Math.min(
      e.clientY + window.scrollY,
      maxY
    );

    const variant =
      flowerVariants[
        Math.floor(Math.random() * flowerVariants.length)
      ];

    const newFlower: Flower = {
      id: Date.now(),
      x: e.clientX - container.left,
      y: clickY - container.top,
      grown: false,
      variant,
    };

    setFlowers((prev) => [...prev, newFlower]);

    setTimeout(() => {
      setFlowers((prev) =>
        prev.map((f) =>
          f.id === newFlower.id ? { ...f, grown: true } : f
        )
      );
    }, 700);
  };
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
  
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);
  
  /* -------- POPUP IMAGE GROUPING -------- */
  useEffect(() => {
    if (!activeProject) return;

    const loadImages = async () => {
      const infos: ImageInfo[] = [];

      for (const src of activeProject.images) {
        const img = new Image();
        img.src = src;
        await new Promise((res) => (img.onload = () => res(true)));

        infos.push({
          src,
          orientation:
            img.naturalWidth > img.naturalHeight
              ? "horizontal"
              : "vertical",
        });
      }

      const grouped: ImageInfo[][] = [];
      let buffer: ImageInfo[] = [];

      infos.forEach((img) => {
        if (img.orientation === "horizontal") {
          grouped.push([img]);
        } else {
          buffer.push(img);
          if (buffer.length === 2) {
            grouped.push([...buffer]);
            buffer = [];
          }
        }
      });

      if (buffer.length) grouped.push(buffer);

      setPages(grouped);
      setActivePage(0);
    };

    loadImages();
  }, [activeProject]);

  return (
    <div className="home-root" onClick={handleBackgroundClick}>
      <div className="hint">
        *this page responds to gentle curiosity — click the empty spaces
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="arc-text">
          i create experiences that make you feel
        </div>

        <h1 className="hero-name">chiara colciago</h1>

        <p className="hero-sub">
          BRIDGING THE GAP BETWEEN ARTISTIC VISION AND STRUCTURED EXECUTION OF
          PROJECTS
        </p>

        <div className="scroll-down">
          my projects
          <span>↓</span>
        </div>
      </section>

      {/* PROJECT GRID */}
      <div className="gallery-wrapper">
      <div
  className="gallery-track"
  ref={galleryRef}
  onMouseMove={handleMouseMove}
>
  {projects.map((project, index) => {
  const distance =
    activeIndex === null ? 0 : Math.abs(index - activeIndex);

  return (
    <div
      key={project.id}
      className={`gallery-item ${
        distance === 0
          ? "center"
          : distance === 1
          ? "near"
          : "far"
      }`}
      onMouseEnter={() => setActiveIndex(index)}
      onClick={() => setActiveProject(project)}
    >
      <img src={project.cover} alt={project.title} />
      <div className="gallery-overlay">
    <h3>{project.title}</h3>
    <span>{project.type}</span>
  </div>
    </div>
  );
})}
  </div>
</div>



      {/* POPUP */}
      {activeProject && (
        <div className="overlay" onClick={() => setActiveProject(null)}>
          <div className="popup a4" onClick={(e) => e.stopPropagation()}>
            <div className="popup-left">
              <h2>{activeProject.title}</h2>
              <p>{activeProject.description}</p>
            </div>

            <div className="popup-right">
  {/* A4 preview */}
  <div className="page">
    {pages[activePage]?.map((img, i) => (
      <img
        key={i}
        src={img.src}
        className={
          img.orientation === "vertical"
            ? "img-vertical"
            : "img-horizontal"
        }
        alt=""
      />
    ))}
  </div>

  {/* navigation */}
  <div className="finder-nav">
    <button
      onClick={() =>
        setActivePage((p) => Math.max(p - 1, 0))
      }
      disabled={activePage === 0}
    >
      ←
    </button>

    <button
      onClick={() =>
        setActivePage((p) =>
          Math.min(p + 1, pages.length - 1)
        )
      }
      disabled={activePage === pages.length - 1}
    >
      →
    </button>
  </div>

  {/* thumbnail strip */}
  <div className="finder-strip">
    {pages.map((page, index) => (
      <div
        key={index}
        className={`finder-thumb ${
          index === activePage ? "active" : ""
        }`}
        onClick={() => setActivePage(index)}
      >
        {page.map((img, i) => (
          <img key={i} src={img.src} alt="" />
        ))}
      </div>
    ))}
  </div>
</div>

          </div>
        </div>
      )}

      {/* 🌸 FLOWERS */}
      {flowers.map((flower) => (
        <img
          key={flower.id}
          src={flower.grown ? flower.variant.png : flower.variant.gif}
          className="flower"
          style={{
            left: flower.x,
            top: flower.y,
          }}
          alt=""
        />
      ))}
    </div>
  );
}
