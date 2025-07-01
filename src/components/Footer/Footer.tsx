


export default function Footer() {
  return (
    <footer style={{ background: '#06090C', borderTop: '1px solid #75787D55', textAlign: 'center', padding: 24 }}>
      <div style={{ maxWidth: 700, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 3 }}>Сообщество</div>
          <div style={{ display: 'flex', gap: 3, fontSize: 20 }}>
            <a href="#" style={{ color: '#40BFAF', textDecoration: 'none', marginRight: 8 }} aria-label="Discord"><i className="fab fa-discord"></i></a>
            <a href="#" style={{ color: '#40BFAF', textDecoration: 'none', marginRight: 8 }} aria-label="Telegram"><i className="fab fa-telegram"></i></a>
            <a href="#" style={{ color: '#40BFAF', textDecoration: 'none', marginRight: 8 }} aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            <a href="#" style={{ color: '#40BFAF', textDecoration: 'none', marginRight: 8 }} aria-label="Twitter"><i className="fab fa-x-twitter"></i></a>
            <a href="#" style={{ color: '#40BFAF', textDecoration: 'none', marginRight: 8 }} aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div style={{ flex: 3, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>О нас</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>О нас</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Вакансии</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Новости</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Условия</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Блог</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Сообщество</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Приложения</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Продукты</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Exchange</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Купить криптовалюту</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Academy</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Live</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Tax</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>NFT</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Для компаний</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Стать партнёром</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Заявка на листинг</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>VIP-услуги</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Labs</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Узнать больше</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Учитесь и зарабатывайте</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Стоимость криптовалют</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Купить Биткоин</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Купить Эфириум</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Купить BNB</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Поддержка</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Помощь 24/7</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Отзывы</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Комиссии</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>API</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Правила</li>
            </ul>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, borderTop: '1px solid #75787D55', paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div>Wolf Street © {new Date().getFullYear()}</div>
        <div style={{ marginTop: 2 }}>Настройки cookie</div>
      </div>
    </footer>
  );
}