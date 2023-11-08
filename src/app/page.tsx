import SearchFormServer from "@/components/SearchForm/SearchFormServer";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center gap-4 justify-center bg-slate-100">
      <header className="text-center">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-primary">Dónde jugamos?</h1>
        <p className="italic text-slate-500 text-md lg:text-lg">
          Tu cancha, a tres clicks de distancia.
        </p>
      </header>
      <SearchFormServer />
    </div>
  );
}
