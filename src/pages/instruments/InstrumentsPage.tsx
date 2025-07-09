import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import InstrumentFilters from "./InstrumentFilters";
import btcIcon from "../../image/crypto/bitcoin.svg";
import ethIcon from "../../image/crypto/ethereum.svg";
import usdtIcon from "../../image/crypto/usdt.svg";
import tonIcon from "../../image/crypto/ton.svg";
import InstrumentsList from "./InstrumentsList";

const instruments = [
  { name: "Bitcoin", symbol: "BTC", type: "crypto", description: "Криптовалюта №1 по капитализации.", price: 40000, icon: btcIcon },
  { name: "Ethereum", symbol: "ETH", type: "crypto", description: "Ведущая платформа для смарт-контрактов.", price: 2500, icon: ethIcon },
  { name: "Tether", symbol: "USDT", type: "stablecoin", description: "Популярный стейблкоин, привязанный к доллару.", price: 1, icon: usdtIcon },
  { name: "Toncoin", symbol: "TON", type: "crypto", description: "Блокчейн-платформа от Telegram.", price: 5, icon: tonIcon },
];

const TYPE_FILTERS = [
  { label: "Все", value: "all" },
  { label: "Криптовалюта", value: "crypto" },
  { label: "Стейблкоин", value: "stablecoin" },
];

const SORT_OPTIONS = [
  { label: "По алфавиту (A-Z)", value: "alpha-asc" },
  { label: "По алфавиту (Z-A)", value: "alpha-desc" },
  { label: "По цене (сначала дешёвые)", value: "price-asc" },
  { label: "По цене (сначала дорогие)", value: "price-desc" },
];

export default function InstrumentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("alpha-asc");
  const [show, setShow] = useState(false);
  const [cardsVisible, setCardsVisible] = useState<number>(0);

  useEffect(() => {
    setShow(true);
    // Определяем, первый ли это рендер
    const isFirstRender = !show;
    if (filtered.length > 0) {
      if (isFirstRender) {
        setCardsVisible(0);
        filtered.forEach((_, i) => {
          setTimeout(() => setCardsVisible(v => Math.max(v, i + 1)), 50 + i * 30);
        });
      } else {
        setCardsVisible(filtered.length);
      }
    }
    // eslint-disable-next-line
  }, [filter, sort, search]);

  // Фильтрация
  let filtered = instruments.filter((item) => {
    const matchesType = filter === "all" || item.type === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Сортировка
  filtered = filtered.slice().sort((a, b) => {
    if (sort === "alpha-asc") return a.name.localeCompare(b.name);
    if (sort === "alpha-desc") return b.name.localeCompare(a.name);
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg text-light-fg dark:text-dark-fg font-sans">
      <Header
        scrolled={false}
        NAV={[]}
        setSearchPos={() => {}}
        activeSection={""}
        headerVisible={true}
        setSearchOpen={() => {}}
        searchOpen={false}
      />
      <main className={`flex-1 w-full max-w-3xl mx-auto px-4 py-16 transition-all duration-700 ease-in-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transform`}>
        <h1 className="text-4xl font-extrabold text-light-accent dark:text-dark-accent mb-10 text-center tracking-wide">
          Доступные инструменты
        </h1>
        <InstrumentFilters
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
          search={search}
          setSearch={setSearch}
          typeOptions={TYPE_FILTERS}
          sortOptions={SORT_OPTIONS}
        />
        {/* Список инструментов */}
        <InstrumentsList instruments={filtered} cardsVisible={cardsVisible} />
      </main>
      <Footer />
    </div>
  );
} 