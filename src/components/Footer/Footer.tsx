export default function Footer() {
  return (
    <footer className="bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border text-center p-6 text-light-fg dark:text-dark-fg">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex-1 min-w-[180px] flex flex-col gap-4">
          <div className="font-bold text-lg mb-3">Сообщество</div>
          <div className="flex gap-3 text-xl justify-center">
            <a
              href="#"
              className="text-light-accent dark:text-dark-accent hover:opacity-80 transition-opacity mr-2"
              aria-label="Discord"
            >
              <i className="fab fa-discord"></i>
            </a>
            <a
              href="#"
              className="text-light-accent dark:text-dark-accent hover:opacity-80 transition-opacity mr-2"
              aria-label="Telegram"
            >
              <i className="fab fa-telegram"></i>
            </a>
            <a
              href="#"
              className="text-light-accent dark:text-dark-accent hover:opacity-80 transition-opacity mr-2"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="#"
              className="text-light-accent dark:text-dark-accent hover:opacity-80 transition-opacity mr-2"
              aria-label="Twitter"
            >
              <i className="fab fa-x-twitter"></i>
            </a>
            <a
              href="#"
              className="text-light-accent dark:text-dark-accent hover:opacity-80 transition-opacity mr-2"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="flex-[3] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div>
            <div className="font-bold text-lg mb-2">О нас</div>
            <ul className="list-none p-0 m-0 space-y-1">
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                О нас
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Вакансии
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Новости
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Условия
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Блог
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Сообщество
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Приложения
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-lg mb-2">Продукты</div>
            <ul className="list-none p-0 m-0 space-y-1">
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Exchange
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Купить криптовалюту
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Academy
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Live
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Tax
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                NFT
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-lg mb-2">Для компаний</div>
            <ul className="list-none p-0 m-0 space-y-1">
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Стать партнёром
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Заявка на листинг
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                VIP-услуги
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Labs
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-lg mb-2">Узнать больше</div>
            <ul className="list-none p-0 m-0 space-y-1">
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Учитесь и зарабатывайте
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Стоимость криптовалют
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Купить Биткоин
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Купить Эфириум
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Купить BNB
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-lg mb-2">Поддержка</div>
            <ul className="list-none p-0 m-0 space-y-1">
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Помощь 24/7
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Отзывы
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Комиссии
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                API
              </li>
              <li className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                Правила
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-light-border dark:border-dark-border pt-4 flex flex-col gap-2">
        <div>Wolf Street © {new Date().getFullYear()}</div>
        <div className="mt-2">Настройки cookie</div>
      </div>
    </footer>
  );
}
