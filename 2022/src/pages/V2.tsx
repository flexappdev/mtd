import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Info,
  Plus,
  Search,
  Shuffle,
  Grid,
  List,
  Box,
  MoreVertical,
  Mic,
  Image as ImageIcon,
  Sparkles,
  X,
  GripVertical,
  Globe,
  Loader2,
  MapPin,
  Camera,
  Wand2,
  type LucideIcon,
} from "lucide-react";

interface GuideItem {
  id: number;
  title: string;
  image: string;
  desc: string;
  fullDesc?: string;
  rating: string;
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "accent";
  className?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface DetailModalProps {
  item: GuideItem | null;
  onClose: () => void;
}

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (item: GuideItem) => void;
}

interface BoxViewProps {
  items: GuideItem[];
  title: string;
  loading?: boolean;
  onSelect: (item: GuideItem) => void;
}

interface TableViewProps {
  items: GuideItem[];
  title: string;
  onSelect: (item: GuideItem) => void;
}

interface TileViewProps {
  items: GuideItem[];
  setItems?: (items: GuideItem[]) => void;
  title: string;
  onSelect: (item: GuideItem) => void;
}

interface HeaderProps {
  activeView: "box" | "table" | "tile";
  setView: (view: "box" | "table" | "tile") => void;
  onOpenAI: () => void;
  scrolled: boolean;
}

const fetchWikiData = async (searchTerm: string): Promise<GuideItem | null> => {
  try {
    const endpoint = `https://en.wikivoyage.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(
      searchTerm,
    )}&gsrlimit=1&prop=pageimages|extracts&pithumbsize=800&exintro&explaintext`;

    const response = await fetch(endpoint);
    const data = await response.json();

    if (!data.query || !data.query.pages) return null;

    const pageId = Object.keys(data.query.pages)[0];
    const page = data.query.pages[pageId];

    return {
      id: page.pageid,
      title: page.title,
      image:
        page.thumbnail?.source ||
        "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80",
      desc:
        page.extract
          ? `${page.extract.substring(0, 150)}...`
          : "Explore the beauty and culture of this amazing destination.",
      fullDesc: page.extract,
      rating: `${Math.floor(Math.random() * 5) + 94}% Match`,
    };
  } catch (error) {
    console.error("Wiki Fetch Error:", error);
    return null;
  }
};

const fetchGalleryImages = async (title: string): Promise<string[]> => {
  try {
    const endpoint = `https://en.wikivoyage.org/w/api.php?action=query&format=json&origin=*&generator=images&titles=${encodeURIComponent(
      title,
    )}&gimlimit=20&prop=imageinfo&iiprop=url`;
    const response = await fetch(endpoint);
    const data = await response.json();

    if (!data.query || !data.query.pages) return [];

    const pages = data.query.pages as Record<string, { imageinfo?: { url?: string }[] }>;

    return Object.values(pages)
      .map((page) => page.imageinfo?.[0]?.url)
      .filter((url): url is string => Boolean(url && !url.toLowerCase().endsWith(".svg")));
  } catch (error) {
    console.error("Gallery Fetch Error:", error);
    return [];
  }
};

const STATIC_DATA: Record<string, GuideItem[]> = {
  hotels: [
    {
      id: 101,
      title: "Royal Mansour",
      image:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      rating: "99% Match",
      desc: "Absolute luxury in Marrakech with private riads.",
    },
    {
      id: 102,
      title: "La Mamounia",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      rating: "98% Match",
      desc: "Historic palace hotel with legendary gardens and opium dens of the past.",
    },
    {
      id: 103,
      title: "Kasbah Tamadot",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      rating: "97% Match",
      desc: "Richard Branson's magical retreat in the High Atlas Mountains.",
    },
  ],
  experiences: [
    {
      id: 201,
      title: "Sahara Stargazing",
      image:
        "https://images.unsplash.com/photo-1534234828563-0252172f8659?auto=format&fit=crop&w=800&q=80",
      rating: "New",
      desc: "Camp under the Milky Way in Merzouga.",
    },
    {
      id: 202,
      title: "Atlas Ballooning",
      image:
        "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=800&q=80",
      rating: "Trending",
      desc: "Sunrise flight over the foothills of the Atlas.",
    },
    {
      id: 203,
      title: "Fes Food Tour",
      image:
        "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=800&q=80",
      rating: "Popular",
      desc: "Taste authentic street food in the ancient Medina.",
    },
  ],
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  icon: Icon,
  disabled,
}: ButtonProps) => {
  const baseStyle =
    "flex items-center gap-2 px-4 py-2 rounded font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-gray-600/70 text-white hover:bg-gray-600/90 backdrop-blur-sm",
    ghost: "bg-transparent text-gray-300 hover:text-white",
    outline: "border border-gray-600 text-gray-300 hover:border-white hover:text-white",
    accent: "bg-red-600 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)]",
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      type="button"
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const DetailModal = ({ item, onClose }: DetailModalProps) => {
  const [gallery, setGallery] = useState<string[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!item) return;

    setLoadingGallery(true);
    setGallery([]);

    fetchGalleryImages(item.title).then((images) => {
      setGallery(images);
      setLoadingGallery(false);
    });
  }, [item]);

  const handleGenerateImages = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newImages = [
        "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512958789358-4dacadfc772b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534234828563-0252172f8659?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80",
      ];
      setGallery((prev) => [...newImages, ...prev]);
      setIsGenerating(false);
    }, 2500);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 p-4 md:p-8">
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#181818] rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-white hover:text-black transition"
          type="button"
        >
          <X size={24} />
        </button>

        <div className="overflow-y-auto flex-1 no-scrollbar">
          <div className="relative h-[50vh] w-full group">
            <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <h2 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">{item.title}</h2>
              <div className="flex gap-4 text-sm font-semibold text-green-400">
                <span>{item.rating}</span>
                <span className="text-gray-300">2025</span>
                <span className="border border-gray-500 px-1 text-gray-400 rounded text-xs flex items-center">HD</span>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg">{item.fullDesc || item.desc}</p>
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Tags</span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300">Nature</span>
                  <span className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300">History</span>
                  <span className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300">Photography</span>
                </div>
              </div>
              <Button variant="primary" className="w-full justify-center" icon={Play}>
                Start Tour
              </Button>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Camera className="text-red-600" /> Gallery
                </h3>
                {!loadingGallery && (
                  <button
                    onClick={handleGenerateImages}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-xs font-bold bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
                    type="button"
                  >
                    <Wand2 size={14} className={isGenerating ? "animate-spin" : "text-purple-400"} />
                    {isGenerating ? "Dreaming..." : "Generate AI Scenes"}
                  </button>
                )}
              </div>

              {loadingGallery ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-red-600" size={40} />
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                  {isGenerating && (
                    <div className="break-inside-avoid bg-gray-800 h-48 rounded-lg animate-pulse flex items-center justify-center text-gray-500 text-xs">
                      Generating...
                    </div>
                  )}

                  {gallery.length > 0 ? (
                    gallery.map((url, idx) => (
                      <div
                        key={idx}
                        className="break-inside-avoid rounded-lg overflow-hidden group cursor-pointer relative transition-all animate-in fade-in slide-in-from-bottom-4"
                      >
                        <img
                          src={url}
                          className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          alt={`Gallery ${idx}`}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))
                  ) : (
                    !isGenerating && (
                      <div className="col-span-full text-center py-12 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                        <ImageIcon className="mx-auto text-gray-600 mb-2" size={32} />
                        <p className="text-gray-500 mb-4">No standard images found.</p>
                        <Button variant="outline" onClick={handleGenerateImages} icon={Wand2}>
                          Generate Visuals with AI
                        </Button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIGeneratorModal = ({ isOpen, onClose, onGenerate }: AIGeneratorModalProps) => {
  const [step, setStep] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [logs, setLogs] = useState<{ msg: string; icon: LucideIcon }[]>([]);
  const [query, setQuery] = useState("");
  const [fetchedData, setFetchedData] = useState<GuideItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("idle");
      setLogs([]);
      setQuery("");
      setFetchedData(null);
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (!query) return;
    setStep("processing");

    const logSteps = [
      { msg: `Parsing intent for '${query}'...`, icon: Sparkles },
      { msg: "Accessing Wikivoyage global database...", icon: Globe },
    ];
    setLogs(logSteps);

    try {
      const data = await fetchWikiData(query);

      setTimeout(() => {
        setLogs((prev) => [...prev, { msg: "Synthesizing description (GPT-4o)...", icon: Mic }]);
      }, 800);

      setTimeout(() => {
        setLogs((prev) => [...prev, { msg: "Enhancing visuals & rendering 4K...", icon: ImageIcon }]);
      }, 1600);

      setTimeout(() => {
        if (data) {
          setFetchedData(data);
          setStep("complete");
          onGenerate(data);
          setTimeout(onClose, 2000);
        } else {
          setStep("error");
          setLogs((prev) => [...prev, { msg: "Failed to find valid data.", icon: X }]);
        }
      }, 2500);
    } catch (error) {
      console.error("AI Generator Error", error);
      setStep("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#181818] border border-gray-700 w-full max-w-md p-6 rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" type="button">
          <X />
        </button>

        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Sparkles className="text-red-500" /> AI Travel Architect
        </h2>
        <p className="text-xs text-gray-500 mb-6">Powered by Wikivoyage & Generative Engines</p>

        {step === "idle" && (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">Describe a destination and we will generate a curated guide.</p>
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Enter a destination..."
                className="w-full bg-[#2a2a2a] border border-gray-600 text-white p-4 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 pl-12"
              />
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            </div>
            <Button variant="accent" className="w-full justify-center py-3" onClick={handleGenerate}>
              Generate Guide
            </Button>
          </div>
        )}

        {step === "processing" && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-6">
              <Loader2 size={48} className="text-red-600 animate-spin" />
            </div>
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div
                  key={log.msg}
                  className="flex items-center gap-3 text-sm text-gray-300 animate-in slide-in-from-left-4 fade-in duration-300"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <log.icon size={16} className="text-red-400" />
                  {log.msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 text-green-500 rounded-full mb-4">
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">Content Generated!</h3>
            <p className="text-gray-400 text-sm mt-2">Added "{fetchedData?.title}" to your list.</p>
          </div>
        )}

        {step === "error" && (
          <div className="text-center py-6 text-red-400">Unable to generate content right now.</div>
        )}
      </div>
    </div>
  );
};

const BoxView = ({ items, title, loading, onSelect }: BoxViewProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="mb-8 group">
      <h2 className="text-xl font-bold text-white px-12 mb-4 group-hover:text-red-500 transition-colors duration-300">
        {title}
      </h2>

      {loading ? (
        <div className="flex gap-4 px-12 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-64 h-36 bg-gray-800 rounded-md animate-pulse flex-none" />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto px-12 pb-8 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="flex-none w-64 group/card relative cursor-pointer transition-all duration-300 hover:scale-110 hover:z-20"
              >
                <img src={item.image} alt={item.title} className="w-full h-36 object-cover rounded-md shadow-lg" />

                <div className="absolute inset-0 -inset-x-4 -inset-y-10 bg-[#181818] opacity-0 group-hover/card:opacity-100 transition-all duration-300 delay-100 rounded-lg shadow-2xl flex flex-col z-20 invisible group-hover/card:visible overflow-hidden">
                  <div className="h-32 w-full relative">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent" />
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="bg-white text-black rounded-full p-1.5 hover:bg-gray-200 transition">
                          <Play size={12} fill="currentColor" />
                        </div>
                        <div className="border-2 border-gray-500 rounded-full p-1.5 text-gray-300 hover:border-white hover:text-white transition">
                          <Plus size={12} />
                        </div>
                      </div>
                      <div className="bg-gray-800 p-1.5 rounded-full">
                        <MoreVertical size={12} />
                      </div>
                    </div>

                    <h3 className="font-bold text-white">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-500 font-bold">{item.rating}</span>
                      <span className="border border-gray-600 px-1 rounded text-[10px] text-gray-400">HD</span>
                    </div>
                    <div className="flex gap-2 text-[10px] text-gray-400">
                      <span>Relaxing</span> • <span>Culture</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TableView = ({ items, title, onSelect }: TableViewProps) => (
  <div className="px-12 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
    <div className="bg-[#181818] rounded-lg overflow-hidden shadow-xl border border-gray-800">
      <table className="w-full text-left text-gray-400">
        <thead className="bg-[#222] text-gray-200 uppercase text-xs tracking-wider">
          <tr>
            <th className="p-4">Destination</th>
            <th className="p-4">Match Score</th>
            <th className="p-4">Description</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onSelect(item)}
              className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors group cursor-pointer"
            >
              <td className="p-4 text-white font-bold flex items-center gap-4">
                <div className="relative w-16 h-10 rounded overflow-hidden">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={item.title}
                  />
                </div>
                {item.title}
              </td>
              <td className="p-4">
                <span className="text-green-400 font-bold">{item.rating}</span>
              </td>
              <td className="p-4 text-sm max-w-md truncate opacity-80 group-hover:opacity-100">{item.desc}</td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-3 text-gray-500">
                  <ImageIcon size={16} className="group-hover:text-white transition-colors" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TileView = ({ items, setItems, title, onSelect }: TileViewProps) => {
  const [draggedItem, setDraggedItem] = useState<GuideItem | null>(null);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!setItems) return;
    setDraggedItem(items[index]);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.5";
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = "1";
    setDraggedItem(null);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!setItems || !draggedItem) return;
    e.preventDefault();
    const draggedOverItem = items[index];
    if (draggedItem === draggedOverItem) return;

    const newItems = items.filter((item) => item !== draggedItem);
    newItems.splice(index, 0, draggedItem);
    setItems(newItems);
  };

  return (
    <div className="px-12 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        {title}
        <span className="text-xs font-normal bg-gray-800 px-2 py-1 rounded text-gray-400">Drag to Reorder</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable={Boolean(setItems)}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            onClick={() => onSelect(item)}
            className="bg-[#181818] rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all cursor-pointer active:cursor-grabbing group shadow-lg"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded hover:bg-red-600 transition-colors cursor-move">
                <GripVertical size={16} className="text-white" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/60 to-transparent">
                <h3 className="text-white font-bold text-lg drop-shadow-md">{item.title}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-400 text-xs mb-4 line-clamp-3 leading-relaxed">{item.desc}</p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <div className="flex gap-3">
                  <span className="text-gray-400 hover:text-white" title="View Gallery">
                    <ImageIcon size={16} />
                  </span>
                </div>
                <span className="text-green-500 text-xs font-bold border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded">
                  {item.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Header = ({ activeView, setView, onOpenAI, scrolled }: HeaderProps) => (
  <header
    className={`fixed top-0 w-full z-40 transition-all duration-500 px-4 md:px-12 py-4 flex items-center justify-between ${
      scrolled ? "bg-[#141414]/95 backdrop-blur-md shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"
    }`}
  >
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-1 cursor-pointer">
        <span className="text-red-600 text-4xl font-extrabold tracking-tighter">MTD</span>
      </div>
      <nav className="hidden lg:flex gap-6 text-sm text-gray-300 font-medium">
        <a href="#" className="text-white font-bold hover:text-gray-300 transition">
          Home
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          Places
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          Hotels
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          Experiences
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          My List
        </a>
      </nav>
    </div>

    <div className="flex items-center gap-4 md:gap-6">
      <div className="hidden md:flex bg-black/40 border border-gray-600 rounded-md p-1 gap-1 backdrop-blur-sm">
        <button
          onClick={() => setView("box")}
          className={`p-1.5 rounded transition ${
            activeView === "box" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
          }`}
          title="Netflix View"
          type="button"
        >
          <Box size={18} />
        </button>
        <button
          onClick={() => setView("table")}
          className={`p-1.5 rounded transition ${
            activeView === "table" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
          }`}
          title="List View"
          type="button"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => setView("tile")}
          className={`p-1.5 rounded transition ${
            activeView === "tile" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
          }`}
          title="Tile Grid"
          type="button"
        >
          <Grid size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Search className="text-white cursor-pointer hover:text-gray-300" size={22} />

        <button
          onClick={onOpenAI}
          className="group flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 px-3 py-1.5 rounded text-white text-xs font-bold hover:from-red-600 hover:to-red-500 transition shadow-lg"
          type="button"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span className="hidden sm:inline">AI CREATOR</span>
        </button>

        <div className="relative group cursor-pointer">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-8 h-8 rounded" alt="User" />
        </div>
      </div>
    </div>
  </header>
);

const V2Page = () => {
  const [viewMode, setViewMode] = useState<"box" | "table" | "tile">("box");
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GuideItem | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const [featuredPlaces, setFeaturedPlaces] = useState<GuideItem[]>([]);
  const [myList, setMyList] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      const initialQueries = [
        "Marrakech",
        "Chefchaouen",
        "Sahara Desert",
        "Fes",
        "Essaouira",
        "Casablanca",
        "Ouarzazate",
      ];

      const promises = initialQueries.map((q) => fetchWikiData(q));
      const results = await Promise.all(promises);

      const validResults = results.filter((r): r is GuideItem => r !== null);
      setFeaturedPlaces(validResults);
      setLoading(false);
    };

    void loadInitialData();

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAIResult = (newItem: GuideItem) => {
    setMyList((prev) => [newItem, ...prev]);
    setViewMode("tile");
  };

  const getRandomPlace = () => {
    const all = [...featuredPlaces, ...STATIC_DATA.hotels, ...STATIC_DATA.experiences];
    if (all.length > 0) {
      const randomItem = all[Math.floor(Math.random() * all.length)];
      setSelectedItem(randomItem);
    }
  };

  return (
    <div className="bg-[#141414] min-h-screen text-white font-sans flex flex-col overflow-x-hidden selection:bg-red-600 selection:text-white">
      <Header activeView={viewMode} setView={setViewMode} onOpenAI={() => setAIModalOpen(true)} scrolled={scrolled} />

      <div className="relative h-[85vh] w-full">
        <div className="absolute inset-0">
          <img
            src={
              featuredPlaces[0]?.image ||
              "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=90"
            }
            className="w-full h-full object-cover transition-opacity duration-1000"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent" />
          <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-[#141414] to-transparent" />
        </div>

        <div className="absolute top-[30%] left-4 md:left-12 max-w-2xl pr-4">
          <div className="flex items-center gap-2 mb-4 text-gray-300 font-bold tracking-widest uppercase text-sm animate-in fade-in slide-in-from-left-8 duration-700">
            <span className="text-red-600 text-2xl font-black">N</span> <span className="pt-1">Original Series</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold leading-none drop-shadow-2xl mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            {(featuredPlaces[0]?.title || "Morocco").toUpperCase()}
          </h1>
          <p className="text-lg md:text-xl text-shadow-md mb-8 line-clamp-3 text-gray-200 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 max-w-lg">
            {featuredPlaces[0]?.desc ||
              "Journey into the heart of North Africa. Experience silence, starlight, and ancient traditions in this immersive documentary series."}
          </p>

          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Button
              icon={Play}
              className="px-8 py-3 text-lg hover:scale-105 transition-transform"
              onClick={() => featuredPlaces[0] && setSelectedItem(featuredPlaces[0])}
            >
              Play
            </Button>
            <Button
              variant="secondary"
              icon={Info}
              className="px-8 py-3 text-lg hover:scale-105 transition-transform"
              onClick={() => featuredPlaces[0] && setSelectedItem(featuredPlaces[0])}
            >
              More Info
            </Button>
          </div>
        </div>
      </div>

      <main className="relative z-10 -mt-24 space-y-2 pb-20">
        {myList.length > 0 && (
          <div className="animate-in fade-in duration-500">
            {viewMode === "box" && <BoxView title="My Generated Guides" items={myList} onSelect={setSelectedItem} />}
            {viewMode === "table" && <TableView title="My Generated Guides" items={myList} onSelect={setSelectedItem} />}
            {viewMode === "tile" && (
              <TileView title="My Generated Guides" items={myList} setItems={(items) => setMyList(items)} onSelect={setSelectedItem} />
            )}
          </div>
        )}

        {viewMode === "box" ? (
          <>
            <BoxView title="Trending Destinations (Wikivoyage)" items={featuredPlaces} loading={loading} onSelect={setSelectedItem} />
            <BoxView title="Luxury Hotels & Riads" items={STATIC_DATA.hotels} onSelect={setSelectedItem} />
            <BoxView title="Curated Experiences" items={STATIC_DATA.experiences} onSelect={setSelectedItem} />
          </>
        ) : (
          <>
            {viewMode === "table" && (
              <TableView title="All Destinations & Stays" items={[...featuredPlaces, ...STATIC_DATA.hotels]} onSelect={setSelectedItem} />
            )}
            {viewMode === "tile" && (
              <TileView
                title="All Items"
                items={[...featuredPlaces, ...STATIC_DATA.hotels]}
                onSelect={setSelectedItem}
              />
            )}
          </>
        )}
      </main>

      <footer className="bg-black text-gray-400 py-12 px-12 border-t border-gray-800 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <span className="hover:underline cursor-pointer">Audio Description</span>
            <span className="hover:underline cursor-pointer">Legal Notices</span>
            <span className="hover:underline cursor-pointer">Gift Cards</span>
            <span className="hover:underline cursor-pointer">Help</span>
          </div>
          <Button variant="outline" icon={Shuffle} onClick={getRandomPlace}>
            Random Destination
          </Button>
        </div>
        <div className="text-xs mt-8 text-gray-600 flex justify-between items-end">
          <div>
            <p>© 2025 Morocco Top Destinations.</p>
            <p className="mt-1">Powered by Wikivoyage API.</p>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={14} />
            <span>Explore More</span>
          </div>
        </div>
      </footer>

      <AIGeneratorModal isOpen={isAIModalOpen} onClose={() => setAIModalOpen(false)} onGenerate={handleAIResult} />

      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default V2Page;
