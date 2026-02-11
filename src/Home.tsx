import { useEffect, useState, useRef } from "react";
import "./Home.css";

const projects = [

  {
    id: 2,
    type: "Website develpment",
    title: "La scuoletta",
    link: "https://www.lascuoletta.it/", // 👈 add this
    popupDesktop: "/4p.png",
    popupMobile: "/4m.png",     description:
      "Small sculptural objects and playful prototypes that explore form, character, and storytelling.",
    cover: "/2.png",
    images: ["/2/1.jpg", "/2/2.jpg", "/2/3.jpg"],
  },
  {
    id: 3,
    title: "I hope therefore I do",
    type: "Exhibition - event",
    popupDesktop: "/2p.png",
    popupMobile: "/2m.png",       description:
      "Colorful compositions and tactile experiments combining paper, texture, and composition.",
    cover: "/3.png",
    images: ["/3/1.jpg", "/3/2.jpg", "/3/3.jpg"],
  },
  {
    id: 4,
    title: "The hub",
    type: "event",
    link: "https://www.vaxjobladet.se/2024-05-22/de-efterlyser-fler-motesplatser-pa-campus-i-vaxjo/", // 👈 add this
    popupDesktop: "/3p.png",
    popupMobile: "/3m.png",      description:
      "A hands-on exploration of material, repair, and experimentation. Focused on learning by doing and working directly with physical constraints.",
    cover: "/4.png",
    images: ["/1/1.jpg", "/1/2.jpg", "/1/3.jpg"],
  },
  
  {
    id: 6,
    title: "21 days",
    type: "exhibition - social change project",
    description:"",
    cover: "/1.png",
    popupDesktop: "/1p.png",
    popupMobile: "/1m.png",    
  },

  {
    id: 7,
    title: "Crafting community",
    type: "social change project",
    popupDesktop: "/5p.png",
    popupMobile: "/5m.png",   // 👈 ONE CANVA IMAGE

    description:
      "A hands-on exploration of material, repair, and experimentation. Focused on learning by doing and working directly with physical constraints.",
    cover: "/7.png",
    images: ["/1/1.jpg", "/1/2.jpg", "/1/3.jpg"],
    
  },

  {
    id: 5,
    popupDesktop: "/6p.png",
    popupMobile: "/6m.png",      link: "https://www.lucastargallery.com/", // 👈 add this    // 👈 ONE CANVA IMAGE
    title: "Luca stars",
    type: "webside development",
    description:
      "A hands-on exploration of material, repair, and experimentation. Focused on learning by doing and working directly with physical constraints.",
    cover: "/5.png",
    images: ["/1/1.jpg", "/1/2.jpg", "/1/3.jpg"],
  },
  {
    id: 8,
    cover: "/8.png",
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
  
    // ❌ Ignore clicks on interactive elements
    if (
      target.tagName === "IMG" ||
      target.closest(".gallery-item") ||
      target.closest(".gallery-track") ||
      target.closest(".gallery-wrapper") ||
      target.closest(".popup") ||
      target.closest(".overlay")
    ) {
      return;
    }
  
    const FLOWER_SIZE = 120;
    const BOTTOM_DECORATION_HEIGHT = 140; // must match CSS
  
    const pageHeight = document.documentElement.scrollHeight;
  
    const maxY =
      pageHeight -
      BOTTOM_DECORATION_HEIGHT -
      FLOWER_SIZE;
  
    const clickY = Math.min(e.pageY, maxY);
  
    const variant =
      flowerVariants[
        Math.floor(Math.random() * flowerVariants.length)
      ];
  
    const newFlower: Flower = {
      id: Date.now(),
      x: e.pageX,     // ✅ page-based
      y: clickY,      // ✅ clamped
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

// 👇 If project has a preferred start image, open on that page
if (activeProject.startImage) {
  const index = grouped.findIndex((page) =>
    page.some((img) => img.src === activeProject.startImage)
  );
  setActivePage(index >= 0 ? index : 0);
} else {
  setActivePage(0);
}

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
          i create experiences that you can feel
        </div>

        <img
  src="/chiara.png"
  alt="Chiara Colciago"
  className="hero-title-image"
/>

        <p className="hero-sub">
          BRIDGING THE GAP BETWEEN ARTISTIC VISION AND STRUCTURED EXECUTION OF
          PROJECTS
        </p>

        <div className="scroll-down">
  <span className="scroll-text">my projects</span>
  <span className="scroll-arrow">↓</span>
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
    <div
      className={`popup ${
        activeProject.popupImage ? "popup-image-only" : "popup-default"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ✅ IMAGE-ONLY POPUP */}
      {/* ✅ IMAGE-ONLY POPUP */}
{activeProject.popupDesktop && activeProject.popupMobile ? (
  activeProject.link ? (
    <a
      href={activeProject.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet={activeProject.popupMobile}
        />
        <img
          src={activeProject.popupDesktop}
          alt={activeProject.title}
          className="popup-full-image"
        />
      </picture>
    </a>
  ) : (
    <picture>
      <source
        media="(max-width: 768px)"
        srcSet={activeProject.popupMobile}
      />
      <img
        src={activeProject.popupDesktop}
        alt={activeProject.title}
        className="popup-full-image"
      />
    </picture>
  )
) : activeProject.popupImage ? (
  activeProject.link ? (
    <a
      href={activeProject.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={activeProject.popupImage}
        alt={activeProject.title}
        className="popup-full-image"
      />
    </a>
  ) : (
    <img
      src={activeProject.popupImage}
      alt={activeProject.title}
      className="popup-full-image"
    />
  )
) : (

        /* ⬅️ fallback (if you ever want text-based projects again) */
        <>
          <div className="popup-left">
            <h2>{activeProject.title}</h2>
            <p>{activeProject.description}</p>
          </div>

          <div className="popup-right">
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
          </div>
        </>
      )}
    </div>
  </div>
)}


<footer className="site-footer">
    <p>Email me ;)</p>
  <a href="mailto:kiracolci@gmail.com">
    kiracolci@gmail.com
  </a>
</footer>




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
