<script setup lang="ts">
import { computed, ref } from 'vue'

type EventTemplate = {
  title: string
  category: string
  description: string
  stages: number
  players: string
  theme: string
  icon: string
}

type CardSet = {
  title: string
  count: number
  icon: string
  color: string
}

const search = ref('')
const activeNav = ref('Главная')
const joinCode = ref('')
const showJoin = ref(false)
const notice = ref('')

const navigation = [
  { label: 'Главная', icon: '⌂' },
  { label: 'Мои мероприятия', icon: '▣' },
  { label: 'Мои карточки', icon: '▤' },
  { label: 'Рабочее пространство', icon: '▱' },
]

const catalogNavigation = [
  { label: 'Каталог мероприятий', icon: '◉' },
  { label: 'Каталог карточек', icon: '▥' },
  { label: 'Пользователи', icon: '♧' },
]

const events: EventTemplate[] = [
  {
    title: 'География мира',
    category: 'Викторина',
    description: 'Проверьте знания о странах, столицах и интересных фактах.',
    stages: 12,
    players: '3–10 игроков',
    theme: 'landscape',
    icon: '✦',
  },
  {
    title: 'Кино и сериалы',
    category: 'Своя игра',
    description: 'Соберите команду и покажите, насколько хорошо вы знаете мир кино.',
    stages: 15,
    players: '2–8 игроков',
    theme: 'cinema',
    icon: '▶',
  },
  {
    title: 'Спорт: кто победит?',
    category: 'Рынок прогнозов',
    description: 'Делайте ставки, прогнозируйте результаты и выигрывайте.',
    stages: 8,
    players: '3–12 игроков',
    theme: 'market',
    icon: '↗',
  },
  {
    title: 'Аукцион знаний',
    category: 'Аукцион',
    description: 'Отвечайте на вопросы и делайте ставки на очки.',
    stages: 10,
    players: '2–6 игроков',
    theme: 'auction',
    icon: '♜',
  },
]

const cardSets: CardSet[] = [
  { title: 'Анатомия', count: 52, icon: '✺', color: 'violet' },
  { title: 'Физика', count: 78, icon: '⚛', color: 'green' },
  { title: 'История', count: 64, icon: '▤', color: 'orange' },
  { title: 'Английский язык', count: 120, icon: '⚑', color: 'blue' },
]

const filteredEvents = computed(() => {
  const q = search.value.trim().toLocaleLowerCase()
  if (!q) return events
  return events.filter((event) =>
    `${event.title} ${event.category} ${event.description}`.toLocaleLowerCase().includes(q),
  )
})

function notify(message: string) {
  notice.value = message
  window.setTimeout(() => {
    if (notice.value === message) notice.value = ''
  }, 3000)
}

function createEvent() {
  notify('Демо-режим: здесь откроется конструктор мероприятия.')
}

function useTemplate(event: EventTemplate) {
  notify(`Шаблон «${event.title}» выбран. Подключите API, чтобы создать мероприятие.`)
}

function openCardSet(set: CardSet) {
  notify(`Открытие набора «${set.title}» — демо-действие.`)
}

function joinGame() {
  const code = joinCode.value.trim()
  if (!code) {
    notify('Введите код игровой комнаты.')
    return
  }
  notify(`Код ${code.toUpperCase()} принят в демо-режиме. Здесь будет переход в лобби.`)
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="#" aria-label="67 cards — главная" @click.prevent="activeNav = 'Главная'">
        <span class="brand-mark"><span>◆</span><i>◆</i></span>
        <span>67 <b>cards</b></span>
      </a>

      <nav class="nav-group" aria-label="Основная навигация">
        <button
          v-for="item in navigation"
          :key="item.label"
          class="nav-link"
          :class="{ active: activeNav === item.label }"
          @click="activeNav = item.label; item.label !== 'Главная' && notify(`Раздел «${item.label}» пока в демо-режиме.`)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="nav-divider" />
      <p class="nav-caption">ОБЩЕЕ</p>
      <nav class="nav-group" aria-label="Каталоги">
        <button
          v-for="item in catalogNavigation"
          :key="item.label"
          class="nav-link"
          :class="{ active: activeNav === item.label }"
          @click="activeNav = item.label; notify(`Раздел «${item.label}» пока в демо-режиме.`)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-bottom">
        <span class="help-icon">?</span>
        <div>
          <strong>Нужна помощь?</strong>
          <p>Здесь появятся документация и поддержка проекта.</p>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <label class="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>
          <input v-model="search" type="search" placeholder="Поиск мероприятий и карточек..." aria-label="Поиск">
          <kbd>⌘ K</kbd>
        </label>
        <div class="topbar-actions">
          <button class="icon-button notification-button" aria-label="Уведомления" @click="notify('Новых уведомлений пока нет.')">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>
          </button>
          <button class="profile-button" @click="notify('Профиль пользователя — демо-режим.')">
            <span class="avatar">ЛД</span>
            <span class="profile-name">Логин Демо</span>
            <span class="chevron">⌄</span>
          </button>
        </div>
      </header>

      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow"><span class="eyebrow-dot" /> ПЛАТФОРМА ДЛЯ ИГР И ИДЕЙ</div>
          <h1>Создавайте игры.<br>Объединяйте людей.</h1>
          <p>Викторины, аукционы, рынки прогнозов и многое другое. Соберите своё интерактивное мероприятие — от идеи до финального счёта.</p>
          <div class="hero-actions">
            <button class="button button-primary" @click="createEvent"><span>＋</span> Создать мероприятие</button>
            <button class="button button-ghost" @click="showJoin = !showJoin">Присоединиться <span>↗</span></button>
          </div>
          <form v-if="showJoin" class="join-form" @submit.prevent="joinGame">
            <input v-model="joinCode" maxlength="12" placeholder="Код комнаты" aria-label="Код игровой комнаты">
            <button class="button button-primary" type="submit">Войти</button>
          </form>
          <div class="hero-footnote"><span class="tiny-check">✓</span> Игрокам не нужна регистрация</div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="art-orbit orbit-one" />
          <div class="art-orbit orbit-two" />
          <div class="floating-card question-card"><span>?</span><i>67</i></div>
          <div class="floating-card check-card"><span>✓</span></div>
          <div class="floating-card auction-card"><span>⚖</span><small>АУКЦИОН</small></div>
          <div class="floating-card chart-card"><span>▥</span></div>
          <span class="spark spark-one">✦</span><span class="spark spark-two">✧</span><span class="spark spark-three">✦</span>
        </div>
        <div class="hero-glow" />
      </section>

      <section class="quick-actions" aria-label="Быстрые действия">
        <button class="quick-card" @click="notify('Открываем создание набора карточек — демо-режим.')">
          <span class="quick-icon purple">▤</span><span class="quick-copy"><strong>Создать карточки</strong><small>Вопросы и ответы в одном месте</small></span><span class="quick-arrow">↗</span>
        </button>
        <button class="quick-card" @click="createEvent">
          <span class="quick-icon blue">✧</span><span class="quick-copy"><strong>Собрать мероприятие</strong><small>Настройте этапы и правила игры</small></span><span class="quick-arrow">↗</span>
        </button>
        <button class="quick-card" @click="showJoin = !showJoin">
          <span class="quick-icon green">⇥</span><span class="quick-copy"><strong>Войти по коду</strong><small>Присоединиться к друзьям</small></span><span class="quick-arrow">↗</span>
        </button>
      </section>

      <section class="content-section">
        <div class="section-heading">
          <div><p class="section-kicker">НАЧНИТЕ С ГОТОВОГО</p><h2>Популярные мероприятия</h2></div>
          <button class="text-link" @click="activeNav = 'Каталог мероприятий'; notify('Каталог мероприятий — демо-режим.')">Весь каталог <span>→</span></button>
        </div>
        <div v-if="filteredEvents.length" class="event-grid">
          <article v-for="event in filteredEvents" :key="event.title" class="event-card">
            <div class="event-cover" :class="event.theme">
              <span class="event-badge">{{ event.category }}</span>
              <span class="cover-symbol">{{ event.icon }}</span>
              <span class="cover-orb" />
            </div>
            <div class="event-body">
              <h3>{{ event.title }}</h3>
              <div class="event-meta"><span>▣ {{ event.stages }} этапов</span><span>♧ {{ event.players }}</span></div>
              <p>{{ event.description }}</p>
              <button class="use-button" @click="useTemplate(event)">Использовать шаблон <span>→</span></button>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">По запросу «{{ search }}» ничего не найдено. Попробуйте изменить поисковую фразу.</div>
      </section>

      <section class="content-section card-section">
        <div class="section-heading">
          <div><p class="section-kicker">ВАШИ МАТЕРИАЛЫ</p><h2>Наборы карточек</h2></div>
          <button class="text-link" @click="activeNav = 'Мои карточки'; notify('Все наборы карточек — демо-режим.')">Все наборы <span>→</span></button>
        </div>
        <div class="sets-grid">
          <button v-for="set in cardSets" :key="set.title" class="set-card" @click="openCardSet(set)">
            <span class="set-icon" :class="set.color">{{ set.icon }}</span>
            <span class="set-info"><strong>{{ set.title }}</strong><small>{{ set.count }} карточек</small></span>
            <span class="set-menu">···</span>
          </button>
        </div>
      </section>

      <footer class="page-footer">
        <span>67 cards <span class="footer-dot">•</span> Игры, которые объединяют</span>
        <span>Демо-интерфейс <span class="status-dot" /> API не подключён</span>
      </footer>
    </main>

    <Transition name="toast">
      <div v-if="notice" class="toast-message" role="status"><span>✦</span>{{ notice }}<button aria-label="Закрыть уведомление" @click="notice = ''">×</button></div>
    </Transition>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  color-scheme: dark;
  --bg: #0c1020;
  --panel: #141a2d;
  --panel-soft: #192139;
  --line: rgba(151, 168, 211, .13);
  --muted: #929db8;
  --text: #f3f5ff;
  --purple: #8b6bff;
  --blue: #5d76ff;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
button, input { font: inherit; }
button { color: inherit; }
button:focus-visible, input:focus-visible { outline: 2px solid #9a85ff; outline-offset: 3px; }
.app-shell { min-height: 100vh; background: radial-gradient(ellipse at 82% 0%, rgba(51, 65, 131, .12), transparent 35%), var(--bg); }
.sidebar { width: 252px; position: fixed; inset: 0 auto 0 0; display: flex; flex-direction: column; padding: 28px 16px 20px; background: rgba(14, 19, 35, .96); border-right: 1px solid var(--line); z-index: 5; }
.brand { display: flex; align-items: center; gap: 12px; padding: 0 12px; margin-bottom: 43px; color: var(--text); text-decoration: none; font-size: 21px; font-weight: 800; letter-spacing: -.8px; }
.brand b { font-weight: 600; }
.brand-mark { width: 32px; height: 34px; position: relative; display: grid; place-items: center; color: white; border-radius: 8px; background: linear-gradient(140deg, #a18aff, #5b45db); transform: rotate(-8deg); box-shadow: 0 7px 20px #6551df33; }
.brand-mark span { position: absolute; font-size: 19px; transform: translate(-5px,-4px); color: #a99aff; }
.brand-mark i { font-style: normal; font-size: 12px; transform: translate(3px, 3px); }
.nav-group { display: grid; gap: 6px; }
.nav-link { display: flex; align-items: center; gap: 14px; min-height: 46px; padding: 0 14px; border: 0; border-radius: 10px; background: transparent; color: #b7c1d9; text-align: left; font-size: 13px; cursor: pointer; transition: .18s ease; }
.nav-link:hover { background: #202942; color: white; }
.nav-link.active { color: white; background: linear-gradient(100deg, #344779, #28385d); box-shadow: inset 0 0 0 1px #6379bb25; }
.nav-icon { display: inline-grid; place-items: center; width: 18px; font-size: 21px; color: #9aa9cb; }
.active .nav-icon { color: #fff; }
.nav-divider { height: 1px; margin: 22px 4px 24px; background: var(--line); }
.nav-caption { margin: 0 13px 12px; font-size: 10px; letter-spacing: 1.2px; color: #75819e; }
.sidebar-bottom { display: flex; gap: 12px; align-items: flex-start; margin-top: auto; padding: 16px 8px 0; color: #aab5ce; }
.help-icon { flex: 0 0 24px; width: 24px; height: 24px; display: grid; place-items: center; border: 1px solid #7786a7; border-radius: 50%; font-size: 14px; }
.sidebar-bottom strong { display: block; color: #dbe2f4; font-size: 12px; font-weight: 600; }
.sidebar-bottom p { margin: 7px 0 0; color: #8491ad; font-size: 11px; line-height: 1.65; }
.main-content { margin-left: 252px; padding: 0 34px; max-width: 1800px; }
.topbar { height: 82px; display: flex; align-items: center; justify-content: space-between; gap: 22px; }
.search-box { width: min(510px, 58%); height: 42px; display: flex; align-items: center; gap: 10px; padding: 0 13px; border: 1px solid #ffffff08; border-radius: 10px; background: #1a2238; }
.search-box svg { width: 18px; height: 18px; fill: none; stroke: #9ca9c7; stroke-width: 1.8; flex: 0 0 auto; }
.search-box input { min-width: 0; flex: 1; background: transparent; color: white; border: 0; outline: 0; font-size: 12px; }
.search-box input::placeholder { color: #8793b0; }
.search-box kbd { color: #7885a3; font-size: 10px; white-space: nowrap; border: 1px solid #ffffff12; padding: 3px 5px; border-radius: 5px; }
.topbar-actions { display: flex; align-items: center; gap: 22px; }
.icon-button, .profile-button { border: 0; background: transparent; cursor: pointer; }
.icon-button { display: grid; place-items: center; width: 36px; height: 36px; color: #aab5cf; }
.icon-button svg { width: 20px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.profile-button { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #e5e9f7; }
.avatar { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #9c7aff, #6050df); font-size: 11px; font-weight: 700; }
.chevron { color: #9ca9c7; font-size: 17px; margin-left: 1px; }
.hero { position: relative; isolation: isolate; display: flex; min-height: 325px; overflow: hidden; border: 1px solid #7169e42b; border-radius: 20px; background: linear-gradient(112deg, #151b3d 0%, #171a3d 50%, #261d54 100%); }
.hero-copy { position: relative; z-index: 2; width: 59%; padding: 34px 27px 26px; }
.eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; color: #b5a7ff; font-size: 9px; letter-spacing: 1.4px; font-weight: 700; }
.eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #9c82ff; box-shadow: 0 0 12px #9c82ff; }
.hero h1 { margin: 0; font-size: clamp(28px, 2.7vw, 41px); line-height: 1.15; letter-spacing: -1.6px; font-weight: 800; }
.hero-copy > p { max-width: 490px; margin: 15px 0 21px; color: #b6c0dc; font-size: 13px; line-height: 1.8; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.button { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 43px; padding: 0 17px; border-radius: 9px; font-size: 12px; font-weight: 600; cursor: pointer; transition: transform .18s, filter .18s, background .18s; }
.button:hover { transform: translateY(-1px); filter: brightness(1.1); }
.button-primary { border: 1px solid #7568ff; background: linear-gradient(110deg, #6e65ff, #5b6fff); color: white; box-shadow: 0 8px 24px #5e64ff20; }
.button-primary > span { font-size: 19px; font-weight: 400; }
.button-ghost { border: 1px solid #6574ad69; background: #10173170; color: #edf0ff; }
.button-ghost span { margin-left: 7px; color: #b7aaff; }
.hero-footnote { margin-top: 17px; color: #8d9abd; font-size: 10px; }
.tiny-check { display: inline-grid; place-items: center; width: 14px; height: 14px; margin-right: 5px; border-radius: 50%; color: #80e1bd; background: #80e1bd1a; }
.hero-art { position: absolute; z-index: 1; width: 44%; height: 100%; right: 0; top: 0; }
.hero-glow { position: absolute; z-index: -1; width: 390px; height: 390px; right: 5%; top: -70px; border-radius: 50%; background: radial-gradient(circle, #6e56ff22, transparent 70%); }
.art-orbit { position: absolute; border: 1px solid #9181ff1c; border-radius: 50%; transform: rotate(-25deg); }
.orbit-one { width: 340px; height: 230px; top: 54px; left: 6%; }
.orbit-two { width: 280px; height: 190px; top: 79px; left: 13%; }
.floating-card { position: absolute; display: flex; align-items: center; justify-content: center; border: 1px solid #ffffff47; border-radius: 18px; box-shadow: 0 22px 45px #05081c70, inset 0 1px 0 #ffffff3d; backdrop-filter: blur(4px); }
.question-card { width: 126px; height: 143px; top: 36px; left: 29%; transform: rotate(-11deg); background: linear-gradient(145deg, #4f73ffed, #3449c7e8); color: #f0f4ff; }
.question-card span { font-size: 76px; line-height: 1; font-weight: 800; text-shadow: 0 4px 15px #1a2d8c77; }
.question-card i { position: absolute; right: 12px; bottom: 8px; font-size: 9px; font-style: normal; opacity: .65; }
.check-card { width: 120px; height: 111px; top: 104px; right: 17%; transform: rotate(7deg); background: linear-gradient(145deg, #36c9a7e8, #198f86e8); color: #d9fff5; }
.check-card span { font-size: 58px; font-weight: 800; }
.auction-card { width: 126px; height: 104px; top: 174px; left: 13%; transform: rotate(-1deg); flex-direction: column; gap: 3px; background: linear-gradient(145deg, #8557e8, #5036b6); color: #f0eaff; }
.auction-card span { font-size: 39px; }
.auction-card small { font-size: 8px; letter-spacing: 1.2px; font-weight: 700; }
.chart-card { width: 111px; height: 106px; top: 196px; right: 31%; transform: rotate(12deg); background: linear-gradient(145deg, #2d8bffed, #2353c5e8); color: #d9eaff; }
.chart-card span { font-size: 52px; }
.spark { position: absolute; color: #a69aff; font-size: 25px; }
.spark-one { top: 29px; right: 29%; }.spark-two { top: 76px; left: 8%; font-size: 33px; }.spark-three { bottom: 51px; right: 6%; font-size: 31px; }
.join-form { display: flex; gap: 8px; margin-top: 13px; max-width: 360px; }
.join-form input { min-width: 0; flex: 1; padding: 0 12px; color: white; background: #0e1430; border: 1px solid #606bb2; border-radius: 8px; outline: 0; }
.join-form .button { min-height: 38px; }
.quick-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 13px; margin: 18px 0 31px; }
.quick-card { display: flex; align-items: center; gap: 12px; min-width: 0; padding: 14px; border: 1px solid var(--line); border-radius: 12px; background: linear-gradient(120deg, #171f34, #131a2b); text-align: left; cursor: pointer; transition: .18s ease; }
.quick-card:hover, .set-card:hover { border-color: #8d7bff60; background-color: #1c2540; transform: translateY(-2px); }
.quick-icon { flex: 0 0 38px; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 10px; font-size: 22px; }
.quick-icon.purple { background: #7954d82b; color: #b69cff; }.quick-icon.blue { background: #3977e82b; color: #80aaff; }.quick-icon.green { background: #30bd9223; color: #68d8b5; }
.quick-copy { display: grid; gap: 5px; min-width: 0; }
.quick-copy strong { font-size: 11px; font-weight: 600; }
.quick-copy small { color: #8996b3; font-size: 10px; line-height: 1.4; }
.quick-arrow { margin-left: auto; color: #7f8db0; font-size: 16px; }
.content-section { margin-top: 0; margin-bottom: 33px; }
.section-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 17px; }
.section-kicker { margin: 0 0 5px; color: #7887aa; font-size: 9px; letter-spacing: 1.4px; font-weight: 700; }
.section-heading h2 { margin: 0; font-size: 20px; letter-spacing: -.5px; }
.text-link { display: inline-flex; align-items: center; gap: 9px; padding: 5px 0; border: 0; background: transparent; color: #9e8aff; font-size: 11px; cursor: pointer; white-space: nowrap; }
.text-link:hover { color: #c5baff; }
.text-link span { font-size: 17px; }
.event-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 13px; }
.event-card { min-width: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 13px; background: linear-gradient(150deg, #171f33, #131a2b); transition: transform .18s, border-color .18s; }
.event-card:hover { transform: translateY(-3px); border-color: #7f72ed57; }
.event-cover { height: 108px; position: relative; display: flex; align-items: flex-end; padding: 12px; overflow: hidden; isolation: isolate; }
.event-cover::before, .event-cover::after { content: ""; position: absolute; z-index: -1; }
.event-cover.landscape { background: linear-gradient(160deg, #e6b979, #7197a8 46%, #34486d); }
.landscape::before { width: 0; height: 0; left: -5%; bottom: -3px; border-left: 110px solid transparent; border-right: 110px solid transparent; border-bottom: 86px solid #263d5b; filter: drop-shadow(55px -12px 0 #506f87); }
.landscape::after { inset: 0; background: linear-gradient(0deg, #10182c6b, transparent 65%); }
.event-cover.cinema { background: radial-gradient(ellipse at 50% 10%, #8c75ff, transparent 35%), repeating-linear-gradient(90deg, #191c5d, #3039a2 9%, #191c5d 17%); }
.cinema::before { inset: 0; background: repeating-linear-gradient(90deg, transparent 0 25px, #a59bff24 26px 28px); }
.event-cover.market { background: linear-gradient(145deg, #112f37, #144b42 55%, #122a36); }
.market::before { inset: 0; opacity: .75; background: repeating-linear-gradient(165deg, transparent 0 19px, #42d1a33b 20px 21px), repeating-linear-gradient(15deg, transparent 0 27px, #ef737342 28px 29px); }
.event-cover.auction { background: radial-gradient(ellipse at 70% 30%, #d8a64f, transparent 26%), linear-gradient(135deg, #251e3a, #6d422e 60%, #17172d); }
.auction::before { width: 88px; height: 88px; right: 10%; bottom: -44px; border-radius: 50%; border: 10px solid #e5b05b40; }
.event-badge { z-index: 1; display: inline-flex; padding: 6px 10px; border: 1px solid #ffffff25; border-radius: 6px; background: #181a3bba; color: #f5f2ff; font-size: 9px; font-weight: 600; backdrop-filter: blur(6px); }
.cover-symbol { position: absolute; top: 17px; right: 19px; color: #ffffffb5; font-size: 37px; font-weight: 700; text-shadow: 0 4px 14px #080b2c77; }
.cover-orb { position: absolute; width: 100px; height: 100px; top: -60px; right: -20px; border: 1px solid #ffffff2a; border-radius: 50%; }
.event-body { padding: 13px 13px 12px; }
.event-body h3 { margin: 0 0 10px; overflow: hidden; color: #f1f3ff; font-size: 13px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.event-meta { display: flex; flex-wrap: wrap; gap: 9px; color: #98a4c0; font-size: 9px; }
.event-meta span { white-space: nowrap; }
.event-body p { min-height: 44px; margin: 12px 0 13px; color: #aab5cd; font-size: 10px; line-height: 1.6; }
.use-button { display: flex; justify-content: space-between; align-items: center; width: 100%; min-height: 35px; padding: 0 10px; border: 1px solid #ffffff05; border-radius: 7px; background: #202a43; color: #e7ebfa; font-size: 10px; font-weight: 600; cursor: pointer; transition: background .15s; }
.use-button:hover { background: #303d5e; }
.use-button span { color: #a6b1d0; font-size: 15px; }
.card-section { margin-top: 38px; }
.sets-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 13px; }
.set-card { display: flex; align-items: center; gap: 12px; min-width: 0; padding: 15px; border: 1px solid var(--line); border-radius: 12px; background: #171f33; text-align: left; cursor: pointer; transition: .18s ease; }
.set-icon { flex: 0 0 48px; width: 48px; height: 48px; display: grid; place-items: center; border-radius: 12px; font-size: 26px; font-weight: 600; }
.set-icon.violet { background: linear-gradient(140deg, #7042c3, #8e59e4); color: #f4eaff; }.set-icon.green { background: linear-gradient(140deg, #238c7b, #3ab99b); color: #e2fff6; }.set-icon.orange { background: linear-gradient(140deg, #ed6d43, #f29b50); color: #fff1e7; }.set-icon.blue { background: linear-gradient(140deg, #2763d5, #4384fa); color: #eaf2ff; }
.set-info { display: grid; gap: 6px; min-width: 0; }
.set-info strong { overflow: hidden; color: #e9edfa; font-size: 11px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.set-info small { color: #96a2bd; font-size: 10px; }
.set-menu { margin-left: auto; color: #8794b2; letter-spacing: 1px; font-size: 18px; }
.empty-state { padding: 32px; border: 1px dashed #465171; border-radius: 12px; color: #aab5cd; text-align: center; font-size: 13px; }
.page-footer { display: flex; justify-content: space-between; gap: 20px; padding: 20px 0 26px; border-top: 1px solid var(--line); color: #75819c; font-size: 10px; }
.footer-dot { padding: 0 6px; color: #a28cff; }
.status-dot { display: inline-block; width: 6px; height: 6px; margin: 0 4px; border-radius: 50%; background: #e7b15a; }
.toast-message { position: fixed; z-index: 10; right: 24px; bottom: 24px; display: flex; align-items: center; gap: 10px; max-width: min(480px, calc(100vw - 32px)); padding: 14px 16px; border: 1px solid #8272ef5e; border-radius: 12px; background: #202744; box-shadow: 0 18px 60px #0007; color: #e9eaff; font-size: 12px; line-height: 1.5; }
.toast-message > span { color: #b4a1ff; }
.toast-message button { margin-left: 8px; border: 0; background: transparent; color: #aab5ce; font-size: 20px; cursor: pointer; }
.toast-enter-active, .toast-leave-active { transition: opacity .2s, transform .2s; }.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }

@media (min-width: 1500px) { .main-content { margin-right: auto; } .hero { min-height: 340px; } .event-cover { height: 125px; } }
@media (max-width: 1250px) {
  .sidebar { width: 220px; }.main-content { margin-left: 220px; padding: 0 24px; }
  .event-grid, .sets-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .event-cover { height: 130px; }.hero-copy { width: 65%; }.hero-art { width: 40%; opacity: .8; }
  .quick-card { padding: 11px; }.quick-copy small { font-size: 9px; }
}
@media (max-width: 820px) {
  .sidebar { width: 68px; align-items: center; padding: 22px 8px; }
  .brand { padding: 0; margin-bottom: 35px; }.brand > span:last-child, .nav-link > span:last-child, .nav-caption, .nav-divider, .sidebar-bottom > div { display: none; }
  .nav-group { width: 100%; }.nav-link { justify-content: center; padding: 0; }.nav-icon { font-size: 23px; }
  .sidebar-bottom { padding: 0; justify-content: center; }.help-icon { flex: 0 0 28px; }
  .main-content { margin-left: 68px; padding: 0 18px; }.topbar { height: 72px; }.profile-name, .chevron, .notification-button, .search-box kbd { display: none; }
  .topbar-actions { gap: 5px; }.search-box { width: 100%; }.hero { min-height: 355px; }
  .hero-copy { width: 100%; padding: 29px 23px; }.hero-copy > p { max-width: 390px; }.hero-art { right: -80px; width: 52%; opacity: .25; }
  .quick-actions { grid-template-columns: 1fr; gap: 8px; margin-bottom: 28px; }.quick-card { padding: 11px 13px; }.quick-copy small { font-size: 10px; }
  .section-heading h2 { font-size: 18px; }.event-grid, .sets-grid { gap: 10px; }
}
@media (max-width: 520px) {
  .main-content { padding: 0 12px; }.topbar { gap: 10px; }.search-box { height: 39px; padding: 0 9px; }.search-box input { font-size: 11px; }
  .avatar { width: 31px; height: 31px; }.hero { min-height: 390px; border-radius: 15px; }.hero-copy { padding: 24px 17px; }
  .hero h1 { font-size: 29px; letter-spacing: -1px; }.hero-copy > p { font-size: 12px; line-height: 1.7; }.hero-actions { align-items: stretch; flex-direction: column; max-width: 250px; }.button { min-height: 42px; }
  .hero-art { width: 80%; right: -100px; opacity: .16; }.section-heading { align-items: flex-start; }.section-heading h2 { font-size: 17px; }.section-kicker { font-size: 8px; }.text-link { font-size: 10px; gap: 4px; }
  .event-grid { grid-template-columns: 1fr; }.event-cover { height: 145px; }.event-body p { min-height: 0; }.sets-grid { grid-template-columns: 1fr; }.set-card { padding: 12px; }
  .page-footer { flex-direction: column; gap: 8px; }.content-section { margin-bottom: 27px; }
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } }
</style>
