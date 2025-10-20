(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function s(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(o){if(o.ep)return;o.ep=!0;const l=s(o);fetch(o.href,l)}})();const z="modulepreload",O=function(n,a){return new URL(n,a).href},_={},E=function(a,s,r){let o=Promise.resolve();if(s&&s.length>0){const d=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),g=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));o=Promise.allSettled(s.map(i=>{if(i=O(i,r),i in _)return;_[i]=!0;const e=i.endsWith(".css"),t=e?'[rel="stylesheet"]':"";if(!!r)for(let x=d.length-1;x>=0;x--){const u=d[x];if(u.href===i&&(!e||u.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${i}"]${t}`))return;const h=document.createElement("link");if(h.rel=e?"stylesheet":z,e||(h.as="script"),h.crossOrigin="",h.href=i,g&&h.setAttribute("nonce",g),document.head.appendChild(h),e)return new Promise((x,u)=>{h.addEventListener("load",x),h.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${i}`)))})}))}function l(d){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=d,window.dispatchEvent(c),!c.defaultPrevented)throw d}return o.then(d=>{for(const c of d||[])c.status==="rejected"&&l(c.reason);return a().catch(l)})},j=`<!-- /src/partials/globals/header.html -->

<!-- HEADER fixo (acompanha a página) + spacer dinâmico -->
<header id="site-header" class="fixed left-0 right-0 top-2 sm:top-4 z-[60] w-full flex justify-center px-4">
  <div
    data-header-shell
    class="w-full max-w-[1358px] flex items-center justify-between py-4 px-6 sm:py-5 sm:px-8 lg:py-6 lg:px-10
           rounded-3xl border border-black/5 bg-white/90 backdrop-blur-md
           shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.06)]
           dark:border-white/10 dark:bg-[#0E1A2B]/85 transition-all duration-300 ease-in-out">

    <!-- LOGO -->
    <a href="/" class="flex items-center">
      <img src="home/logo.png" alt="AguaPrev"
          class="h-16 w-auto select-none transition-all duration-300" />
    </a>


    <!-- 🔥 AÇÕES do MENU ANTIGO (idioma compacto + tema + hambúrguer) -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Idioma compacto -->
      <div class="relative">
        <button
          id="lang-compact"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/15
                 text-sm text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/5
                 focus:outline-none focus:ring-2 focus:ring-[#0A5C67] focus:ring-offset-2 dark:focus:ring-offset-[#0E1A2B]
                 transition-all duration-200"
          aria-haspopup="true" aria-expanded="false">
          <span class="font-medium" data-i18n="Header.cta_lang">PT-BR</span>
          <svg viewBox="0 0 20 20" class="w-4 h-4" fill="currentColor"><path d="M5.5 7.5l4.5 4.5 4.5-4.5"></path></svg>
        </button>

        <div id="lang-compact-menu"
             class="hidden absolute right-0 mt-2 w-36 rounded-xl border border-gray-200 dark:border-white/15
                    bg-white/95 dark:bg-[#0E1A2B]/95 backdrop-blur-xl shadow-lg overflow-hidden z-50">
          <button class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10" data-lang="pt-BR">Português (BR)</button>
          <button class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10" data-lang="en">English</button>
          <button class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10" data-lang="es">Español</button>
        </div>
      </div>

      <!-- Tema -->
      <button id="theme-toggle"
              class="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10
                     focus:outline-none focus:ring-2 focus:ring-[#0A5C67] focus:ring-offset-2 dark:focus:ring-offset-[#0E1A2B]
                     transition-all duration-200"
              aria-label="Alternar modo escuro">
        <svg id="icon-sun" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="w-5 h-5 hidden dark:block">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg id="icon-moon" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="w-5 h-5 dark:hidden">
          <path d="M21 12.79A9 9 0 0 1 12.21 3 7 7 0 0 0 12 17a7 7 0 0 0 9-4.21z"/>
        </svg>
      </button>

      <!-- Hambúrguer (abre overlay) -->
      <button id="menu-toggle"
              class="ml-1 p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10
                     focus:outline-none focus:ring-2 focus:ring-[#0A5C67] focus:ring-offset-2 dark:focus:ring-offset-[#0E1A2B]
                     transition-all duration-200"
              aria-label="Abrir menu" aria-expanded="false" aria-controls="menu-overlay">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- OVERLAY MENU (o seu antigo: nav + cartões + idioma grande) -->
  <div id="menu-overlay" class="hidden fixed inset-0 z-[70]">
    <div class="absolute inset-0 bg-black/45 backdrop-blur-sm"></div>

    <div data-overlay-panel
         class="relative mx-auto mt-8 w-[min(92vw,1100px)] rounded-3xl overflow-hidden
                border border-white/15 bg-white/90 dark:bg-[#0B182B]/90
                shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]">

      <!-- topo -->
      <div class="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-black/5 dark:border-white/10">
        <div class="flex items-center gap-3">
          <img src="home/logo.png" alt="" class="h-8 w-auto select-none" />
        </div>
        <div class="flex items-center gap-2">
          <!-- Tema no overlay -->
          <button id="theme-toggle-overlay"
                  class="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10
                         focus:outline-none focus:ring-2 focus:ring-[#0A5C67]">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 0 1 12.21 3 7 7 0 0 0 12 17a7 7 0 0 0 9-4.21z"/></svg>
          </button>
          <button id="menu-close"
                  class="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10
                         focus:outline-none focus:ring-2 focus:ring-[#0A5C67]">
            <span class="sr-only">Fechar</span>
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- conteúdo -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-8 p-6 sm:p-10">
        <!-- Navegação -->
        <nav class="md:col-span-3">
          <ul class="space-y-2 text-2xl sm:text-3xl font-semibold">
            <li><a href="#app-hero" class="group block rounded-2xl px-4 py-3 hover:bg-black/[.04] dark:hover:bg-white/5">
              <span class="bg-gradient-to-r from-[#0A5C67] to-[#6BAAC9] bg-clip-text text-transparent group-hover:opacity-90 transition"
                    data-i18n="Header.Nav.home">Início</span></a></li>
            <li><a href="#app-how" class="group block rounded-2xl px-4 py-3 hover:bg-black/[.04] dark:hover:bg-white/5">
              <span class="text-gray-800 dark:text-gray-100 group-hover:text-[#6BAAC9]"
                    data-i18n="Header.Nav.how">Como Funciona</span></a></li>
            <li><a href="#app-highlights" class="group block rounded-2xl px-4 py-3 hover:bg-black/[.04] dark:hover:bg-white/5">
              <span class="text-gray-800 dark:text-gray-100 group-hover:text-[#6BAAC9]"
                    data-i18n="Header.Nav.features">Recursos</span></a></li>
            <li><a href="#app-partners" class="group block rounded-2xl px-4 py-3 hover:bg-black/[.04] dark:hover:bg-white/5">
              <span class="text-gray-800 dark:text-gray-100 group-hover:text-[#6BAAC9]"
                    data-i18n="Header.Nav.partners">Parceiros</span></a></li>
            <li><a href="#app-faq" class="group block rounded-2xl px-4 py-3 hover:bg-black/[.04] dark:hover:bg-white/5">
              <span class="text-gray-800 dark:text-gray-100 group-hover:text-[#6BAAC9]"
                    data-i18n="Header.Nav.faq">FAQ</span></a></li>
          </ul>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a href="login.html"
               class="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold
                      bg-[#0A5C67] text-white hover:brightness-110 shadow-sm"
               data-i18n="Header.cta">Login</a>
            <a href="../../como-funciona/como-contribuir/"
               class="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold
                      border border-[#0A5C67]/60 text-[#0A5C67] hover:bg-[#0A5C67]/5
                      dark:border-white/40 dark:text-white dark:hover:bg-white/10">Docs</a>
          </div>
        </nav>

        <!-- Cartões + idioma (overlay) -->
        <div class="md:col-span-2 space-y-6">
          <div class="grid grid-cols-2 gap-3">
            <a href="#app-map-preview"
               class="rounded-2xl border border-black/5 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5 hover:shadow-md transition">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Preview</p>
              <p class="text-base font-semibold text-[#0A5C67] dark:text-white">Mapa e Forecast</p>
            </a>
            <a href="#app-usecases"
               class="rounded-2xl border border-black/5 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5 hover:shadow-md transition">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Para quem é</p>
              <p class="text-base font-semibold text-[#0A5C67] dark:text-white">Casos de uso</p>
            </a>
          </div>

          <!-- Idioma (dropdown amplo) -->
          <div class="rounded-2xl border border-black/5 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Idioma</p>
            <div class="relative">
              <button id="lang-dropdown"
                      class="w-full flex items-center justify-between gap-2 rounded-xl px-4 py-3
                             border border-gray-200 dark:border-white/15
                             text-gray-800 dark:text-gray-100 bg-white/60 dark:bg-white/10
                             hover:bg-white dark:hover:bg-white/5">
                <span id="lang-current" class="font-semibold">Português (BR)</span>
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 7.5l4.5 4.5 4.5-4.5"></path></svg>
              </button>
              <div id="lang-menu"
                   class="hidden absolute left-0 right-0 mt-2 rounded-xl border border-gray-200 dark:border-white/15
                          bg-white/95 dark:bg-[#0E1A2B]/95 backdrop-blur-xl shadow-lg overflow-hidden z-10">
                <button class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/10" data-lang="pt-BR">Português (BR)</button>
                <button class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/10" data-lang="en">English</button>
                <button class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/10" data-lang="es">Español</button>
              </div>
            </div>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400">© 2025 AguaPrev — Universidade de Brasília</p>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- Spacer reservado pelo JS para o header fixo -->
<div id="header-spacer" style="height: var(--header-spacer, 112px);"></div>
`,G=`<!-- /src/partials/globals/footer.html -->\r
<footer id="footer" class="w-full mt-24">\r
  <section class="relative max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10">\r
\r
    <!-- painel -->\r
    <div class="relative overflow-hidden rounded-[26px] bg-white/80 dark:bg-white/5 backdrop-blur ap-footer-panel">\r
      <!-- borda gradiente sutil -->\r
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-[26px] ap-gradient-border"></div>\r
\r
      <!-- textura suave dentro do painel -->\r
      <div aria-hidden="true" class="absolute inset-0 ap-soft-noise"></div>\r
\r
      <!-- faixa luminosa decorativa -->\r
      <!--<div aria-hidden="true" class="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[72%] h-40 rounded-full ap-glow"></div> -->\r
\r
      <div class="relative z-10 py-8 sm:py-10 px-6 sm:px-8 lg:px-10">\r
        <!-- LINHA 1: LOGO (linha única, à esquerda) -->\r
        <div class="w-full flex items-center justify-start">\r
          <a href="/" class="inline-flex items-center">\r
            <img src="home/logo.png" alt="AguaPrev" class="h-10 w-auto select-none" />\r
          </a>\r
        </div>\r
\r
        <!-- LINHA 2: OPÇÕES (grid centralizado) -->\r
        <nav class="mt-8 w-full">\r
          <div class="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">\r
            <!-- Produto -->\r
            <div>\r
              <h4 class="text-sm font-semibold text-[#031E21] dark:text-white tracking-wide">Produto</h4>\r
              <ul class="mt-3 grid gap-2">\r
                <li><a class="footer-link" href="#app-how"><span>Como funciona</span></a></li>\r
                <li><a class="footer-link" href="#app-highlights"><span>Recursos</span></a></li>\r
                <li><a class="footer-link" href="#app-map-preview"><span>Mapa & Forecast</span></a></li>\r
                <li><a class="footer-link" href="/docs/"><span>Docs</span></a></li>\r
              </ul>\r
            </div>\r
            <!-- Institucional -->\r
            <div>\r
              <h4 class="text-sm font-semibold text-[#031E21] dark:text-white tracking-wide">Institucional</h4>\r
              <ul class="mt-3 grid gap-2">\r
                <li><a class="footer-link" href="#"><span>Sobre</span></a></li>\r
                <li><a class="footer-link" href="#"><span>Contato</span></a></li>\r
              </ul>\r
            </div>\r
            <!-- Legal -->\r
            <div>\r
              <h4 class="text-sm font-semibold text-[#031E21] dark:text-white tracking-wide">Legal</h4>\r
              <ul class="mt-3 grid gap-2">\r
                <li><a class="footer-link" href="#"><span>Termos de uso</span></a></li>\r
                <li><a class="footer-link" href="#"><span>Privacidade</span></a></li>\r
                <li><a class="footer-link" href="#"><span>Licenças</span></a></li>\r
              </ul>\r
            </div>\r
          </div>\r
        </nav>\r
      </div>\r
    </div>\r
\r
    <!-- COPYRIGHT (central) -->\r
    <div class="mt-6 py-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-black/5 dark:border-white/10">\r
      © <span id="footer-year"></span> AguaPrev — Universidade de Brasília\r
    </div>\r
  </section>\r
</footer>\r
\r
`,V=`<!-- /src/partials/globals/social-floating.html -->\r
<div id="social-floating" class="ap-social" aria-live="polite">\r
  <!-- pilha de ícones (fica oculta até abrir) -->\r
  <div class="ap-social__stack" id="social-links" aria-hidden="true">\r
    <!-- Troque os href pelos perfis reais do AguaPrev -->\r
    <a class="ap-social__item" href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">\r
      <!-- LinkedIn -->\r
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">\r
        <path fill="#0A66C2" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5Z"/>\r
        <path fill="#0A66C2" d="M.5 8.5h4V24h-4V8.5Zm7.5 0h3.84v2.11h.05c.53-.95 1.85-1.95 3.8-1.95 4.07 0 4.81 2.68 4.81 6.16V24h-4v-6.8c0-1.62-.03-3.7-2.25-3.7-2.25 0-2.59 1.76-2.59 3.58V24h-3.86V8.5Z"/>\r
      </svg>\r
    </a>\r
\r
    <a class="ap-social__item" href="https://twitter.com/" target="_blank" rel="noopener" aria-label="X (Twitter)">\r
      <!-- X -->\r
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">\r
        <path fill="#0F1419" d="M18.9 2H22l-6.9 7.9L23.3 22H16L10.9 15.9 5 22H2l7.4-8.5L.9 2h7.4l4.5 5.9L18.9 2Z"/>\r
      </svg>\r
    </a>\r
\r
    <a class="ap-social__item" href="https://t.me/" target="_blank" rel="noopener" aria-label="Telegram">\r
      <!-- Telegram -->\r
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">\r
        <path fill="#2AABEE" d="M22.5 3.2 1.8 11.2c-1 .4-.9 1.9.1 2.2l5.3 1.6 1.9 6c.3 1 1.6 1.1 2.1.2l2.8-4.5 5.4 4.4c.9.7 2.2.2 2.4-1l2.9-14.7c.2-1.1-.8-2-1.9-1.6Z"/>\r
        <path fill="#fff" d="M18.2 7.2 8.7 15.1l-.3 4.1 1.9-3 7.9-9Z"/>\r
      </svg>\r
    </a>\r
\r
    <a class="ap-social__item" href="https://www.reddit.com/" target="_blank" rel="noopener" aria-label="Reddit">\r
      <!-- Reddit -->\r
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">\r
        <circle cx="12" cy="12" r="10" fill="#FF4500"/>\r
        <circle cx="8.5" cy="12" r="1.3" fill="#fff"/>\r
        <circle cx="15.5" cy="12" r="1.3" fill="#fff"/>\r
        <path stroke="#fff" stroke-width="1.6" stroke-linecap="round" d="M8 15c1.1 1 2.1 1.2 4 .2 2.1 1.1 3.2.9 4-.2"/>\r
        <circle cx="18.2" cy="8.2" r="1.3" fill="#fff"/>\r
      </svg>\r
    </a>\r
\r
    <a class="ap-social__item" href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp">\r
      <!-- WhatsApp -->\r
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">\r
        <path fill="#25D366" d="M20.5 3.5A11 11 0 0 0 3.6 20.4L2 22l1.8-.5a11 11 0 1 0 16.7-18Z"/>\r
        <path fill="#fff" d="M7.8 17.2c4.3 2.6 7.7 1.8 9.2-1.8.3-.7.1-1.4-.5-1.7l-1.6-.7c-.5-.2-1.1 0-1.4.4l-.4.8c-.2.4-.7.5-1.1.3-1.2-.6-2.1-1.4-2.7-2.6-.2-.4-.1-.9.3-1.1l.8-.4c.4-.2.6-.8.4-1.3L10.1 6c-.3-.6-1-.8-1.7-.5-3.7 1.6-4.4 5-1.8 9.3l1.2 2.4Z"/>\r
      </svg>\r
    </a>\r
\r
    <a class="ap-social__item" href="https://br.pinterest.com/" target="_blank" rel="noopener" aria-label="Pinterest">\r
      <!-- Pinterest -->\r
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">\r
        <circle cx="12" cy="12" r="10" fill="#E60023"/>\r
        <path fill="#fff" d="M12.3 7C9.7 7 8 8.6 8 10.9c0 1.2.7 2.1 1.7 2.1.8 0 1.3-.6 1.2-1.4-.1-.9-.5-1.8.1-2.4.4-.4 1.3-.4 1.8.1.7.6 1 1.6 1 2.5 0 2.1-1 3.7-2.6 3.7-.5 0-1-.2-1.4-.6l-.4 1.6-.2.8-.6 2c.5.1 1.1.2 1.7.2 3.7 0 6.1-2.7 6.1-6.3 0-3.3-2.3-5.3-5.1-5.3Z"/>\r
      </svg>\r
    </a>\r
\r
    <a class="ap-social__item" href="https://www.quora.com/" target="_blank" rel="noopener" aria-label="Quora">\r
      <!-- Quora -->\r
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">\r
        <circle cx="12" cy="12" r="10" fill="#B92B27"/>\r
        <path fill="#fff" d="M12 6.8c-3 0-5.1 2.1-5.1 5.2s2.1 5.2 5.1 5.2c.9 0 1.7-.2 2.4-.6l1.3 1.8c.3.4.8.6 1.2.3.4-.2.5-.8.2-1.2l-1.1-1.6c1-1 1.5-2.4 1.5-3.9 0-3.1-2.1-5.2-5.5-5.2Zm0 8.6c-2 0-3.4-1.5-3.4-3.4S10 8.6 12 8.6s3.4 1.5 3.4 3.4S14 15.4 12 15.4Z"/>\r
      </svg>\r
    </a>\r
\r
    <a class="ap-social__item" href="https://line.me/" target="_blank" rel="noopener" aria-label="LINE">\r
      <!-- LINE -->\r
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">\r
        <circle cx="12" cy="12" r="10" fill="#06C755"/>\r
        <path fill="#fff" d="M7 11.2C7 9 9 7.2 11.7 7.2c2.8 0 4.7 1.8 4.7 4s-1.9 4-4.7 4h-.2l-2.4 1.7c-.3.2-.7 0-.7-.4l.1-1.8C7.7 13.9 7 12.7 7 11.2Z"/>\r
      </svg>\r
    </a>\r
\r
    <!-- Copiar link do site -->\r
    <button class="ap-social__item" type="button" id="social-copy" aria-label="Copiar link">\r
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">\r
        <path stroke="#111827" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M14 7h3a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3v-3M10 16H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v3"/>\r
      </svg>\r
    </button>\r
  </div>\r
\r
  <!-- Botão principal (abre/fecha) -->\r
  <button class="ap-social__fab" id="social-toggle" aria-label="Abrir redes sociais" aria-expanded="false" aria-controls="social-links">\r
    <!-- ícone share -->\r
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">\r
      <path stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12M12 3l-4 4M12 3l4 4M6 13v4a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-4"/>\r
    </svg>\r
  </button>\r
</div>\r
`,U=`<!-- /src/partials/home/hero.html -->
<section id="hero" class="relative z-0">
  <div class="relative w-full max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10 pt-14 sm:pt-16 lg:pt-20 pb-14">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

      <!-- TEXTO -->
      <div class="lg:col-span-6 xl:col-span-5">
        <span
          class="inline-flex items-center gap-2 text-xs font-medium
                 px-3 py-1 rounded-full bg-white/70 text-[#0A5C67] border border-black/5
                 dark:bg-white/10 dark:text-white dark:border-white/10"
          data-i18n="Hero.badge">
          Previsão Hídrica do DF
        </span>

        <h1
          class="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight
                 text-[#031E21] dark:text-white"
          data-i18n="Hero.title">
          Antecipe cheias e escassez com<br class="hidden sm:block" />
          mapas e previsões confiáveis
        </h1>

        <p
          class="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-prose"
          data-i18n="Hero.subtitle">
          O <strong>AguaPrev</strong> integra dados hidrometeorológicos e modelos de previsão
          para oferecer <em>insights acionáveis</em> a gestores, produtores e cidadãos no Distrito Federal.
        </p>

        <!-- CTAs -->
        <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href="login.html"
            class="inline-flex justify-center items-center gap-2
                   rounded-2xl px-6 py-3 text-base font-semibold
                   bg-[#0A5C67] text-white shadow hover:shadow-md hover:brightness-110
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A5C67]
                   dark:focus:ring-offset-[#0E1A2B]"
            data-i18n="Hero.cta_primary">
            Abrir Dashboard
          </a>

          <a
            href="#app-how"
            class="inline-flex justify-center items-center gap-2
                   rounded-2xl px-6 py-3 text-base font-semibold
                   border border-[#0A5C67] text-[#0A5C67] bg-transparent
                   hover:bg-[#0A5C67]/5
                   dark:border-white/70 dark:text-white dark:hover:bg-white/10
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A5C67]
                   dark:focus:ring-offset-[#0E1A2B]"
            data-i18n="Hero.cta_secondary">
            Como funciona
          </a>
        </div>

        <ul class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <li data-i18n="Hero.trust_1">Dados ANA/INMET/Adasa</li>
          <li class="hidden sm:block">•</li>
          <li data-i18n="Hero.trust_2">Atualização diária</li>
          <li class="hidden sm:block">•</li>
          <li data-i18n="Hero.trust_3">Modelos validados</li>
        </ul>
      </div>

      <!-- ILUSTRAÇÃO -->
      <div class="lg:col-span-6 xl:col-span-7">
        <div
          class="relative aspect-[16/11] w-full rounded-3xl overflow-hidden
                 bg-white/70 dark:bg-white/5 backdrop-blur
                 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]"
          data-hero-visual>
          <img
            src="home/hero/mapa_preview.png"
            alt="Prévia do mapa e previsão hídrica do AguaPrev"
            class="h-full w-full object-cover" />

          <!-- Card flutuante -->
          <div
            class="absolute bottom-4 right-4 sm:bottom-6 sm:right-6
                   rounded-2xl backdrop-blur-md bg-white/70 dark:bg-[#0E1A2B]/70
                   px-4 py-3 shadow-md border border-black/5 dark:border-white/10
                   max-w-[85%] sm:max-w-[60%]"
            data-hero-float>
            <p class="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300 mb-1" data-i18n="Hero.float_title">
              TENDÊNCIA 7 DIAS — BACIA DESCOBERTO
            </p>
            <div class="flex items-center gap-3">
              <svg viewBox="0 0 120 30" class="h-8 w-24 md:w-32" aria-hidden="true">
                <polyline fill="none" stroke="currentColor" stroke-width="2"
                          points="0,20 20,18 40,15 60,17 80,10 100,12 120,8"
                          class="text-[#0A5C67] dark:text-[#6BAAC9]" />
              </svg>
              <div class="text-sm text-gray-700 dark:text-gray-200">
                <strong>+12%</strong>
                <span class="ml-1" data-i18n="Hero.float_label">volume esperado</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Anchors -->
        <div class="mt-6 flex flex-wrap gap-4 text-sm">
          <a href="#app-map-preview" class="underline decoration-dotted underline-offset-2 text-gray-600 dark:text-gray-300" data-i18n="Hero.anchor_map">Ver mapa/forecast</a>
          <a href="#app-usecases" class="underline decoration-dotted underline-offset-2 text-gray-600 dark:text-gray-300" data-i18n="Hero.anchor_usecases">Casos de uso</a>
          <a href="/docs/" class="underline decoration-dotted underline-offset-2 text-gray-600 dark:text-gray-300" data-i18n="Hero.anchor_docs">Documentação</a>
        </div>
      </div>

    </div>
  </div>
</section>
`,Z=`<!-- /src/partials/home/trust-strip.html -->\r
<section id="trust-strip" class="relative z-[1] ap-overlap-up">\r
  <div class="w-full max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10">\r
    <div class="ap-card px-6 sm:px-8 py-6 sm:py-7">\r
      <ul class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">\r
        <li class="flex flex-col">\r
          <span class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold"\r
                data-i18n="Trust.data_sources_label">Fontes de dados</span>\r
          <span class="mt-1 text-lg font-semibold text-[#0A5C67] dark:text-white"\r
                data-i18n="Trust.data_sources_value">ANA • INMET • Adasa</span>\r
        </li>\r
        <li class="flex flex-col">\r
          <span class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold"\r
                data-i18n="Trust.update_label">Atualização</span>\r
          <span class="mt-1 text-lg font-semibold text-[#0A5C67] dark:text-white"\r
                data-i18n="Trust.update_value">Diária</span>\r
        </li>\r
        <li class="flex flex-col">\r
          <span class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold"\r
                data-i18n="Trust.validation_label">Validação</span>\r
          <span class="mt-1 text-lg font-semibold text-[#0A5C67] dark:text-white"\r
                data-i18n="Trust.validation_value">Modelos revisados</span>\r
        </li>\r
      </ul>\r
    </div>\r
  </div>\r
</section>\r
\r
`,Y=`<!-- /src/partials/home/highlights-pills.html -->\r
<section id="highlights" class="w-full">\r
  <div class="w-full max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10 py-10">\r
    <!-- items-start evita esticar os cards -->\r
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-start">\r
\r
      <!-- Pill 1 -->\r
      <article\r
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10\r
               bg-white/60 dark:bg-white/5 backdrop-blur p-5 cursor-pointer\r
               hover:shadow-lg hover:-translate-y-0.5 transition"\r
        data-highlight role="button" tabindex="0" aria-expanded="false">\r
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">\r
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M19 17V7l-8 4-8-4"/></svg>\r
        </div>\r
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="Highlights.p1_title">Previsão 7/14 dias</h3>\r
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="Highlights.p1_desc">\r
          Tendências de volume/nível com atualização diária para bacias do DF.\r
        </p>\r
        <div data-highlight-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">\r
          Gráficos por bacia, comparação 7×14 dias e variação diária — mock por enquanto.\r
        </div>\r
      </article>\r
\r
      <!-- Pill 2 -->\r
      <article\r
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10\r
               bg-white/60 dark:bg-white/5 backdrop-blur p-5 cursor-pointer\r
               hover:shadow-lg hover:-translate-y-0.5 transition"\r
        data-highlight role="button" tabindex="0" aria-expanded="false">\r
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">\r
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01"/><circle cx="12" cy="12" r="9"/></svg>\r
        </div>\r
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="Highlights.p2_title">Alertas inteligentes</h3>\r
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="Highlights.p2_desc">\r
          Notificações por bacia/região quando limiares críticos são previstos.\r
        </p>\r
        <div data-highlight-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">\r
          Limiar por bacia, simulação e agendamentos de envio (mock).\r
        </div>\r
      </article>\r
\r
      <!-- Pill 3 -->\r
      <article\r
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10\r
               bg-white/60 dark:bg-white/5 backdrop-blur p-5 cursor-pointer\r
               hover:shadow-lg hover:-translate-y-0.5 transition"\r
        data-highlight role="button" tabindex="0" aria-expanded="false">\r
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">\r
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15l-5-5L5 21"/><path d="M17 21H3V7"/></svg>\r
        </div>\r
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="Highlights.p3_title">Mapas temáticos</h3>\r
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="Highlights.p3_desc">\r
          Camadas de precipitação, vazão e risco, com filtros por período.\r
        </p>\r
        <div data-highlight-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">\r
          Camadas com opacidade ajustável e paletas amigáveis — mock.\r
        </div>\r
      </article>\r
\r
      <!-- Pill 4 -->\r
      <article\r
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10\r
               bg-white/60 dark:bg-white/5 backdrop-blur p-5 cursor-pointer\r
               hover:shadow-lg hover:-translate-y-0.5 transition"\r
        data-highlight role="button" tabindex="0" aria-expanded="false">\r
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">\r
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v6H4z"/><path d="M4 14h16v6H4z"/></svg>\r
        </div>\r
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="Highlights.p4_title">API & Export</h3>\r
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="Highlights.p4_desc">\r
          Acesso programático e downloads para análise externa.\r
        </p>\r
        <div data-highlight-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">\r
          Endpoints REST (mock), export CSV/GeoJSON e chaves rotacionáveis.\r
        </div>\r
      </article>\r
\r
    </div>\r
  </div>\r
</section>\r
`,$=`<!-- /src/partials/home/section-map-preview.html -->\r
<section id="map-preview" class="w-full">\r
  <div class="w-full max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10 py-10">\r
    <div class="flex items-end justify-between gap-4 mb-5">\r
      <div>\r
        <h2\r
          class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white"\r
          data-i18n="Map.title"\r
        >\r
          Mapa & Forecast\r
        </h2>\r
\r
        <!-- Explicação rápida do que é mostrado -->\r
        <p\r
          class="mt-1 text-gray-600 dark:text-gray-300 text-sm"\r
          data-i18n="Map.subtitle"\r
        >\r
          Selecione a região para ver o mapa e a tendência em 7 dias. As linhas\r
          indicam a variação ao longo da semana; os valores ao lado mostram o\r
          último ponto disponível.\r
        </p>\r
      </div>\r
\r
      <!-- seletor de região -->\r
      <div class="relative">\r
        <button id="region-toggle"\r
          class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold\r
                 border border-gray-200 dark:border-white/15 bg-white/70 dark:bg-white/10\r
                 text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-white/5">\r
          <span id="region-current" data-i18n="Map.region.df">DF — Geral</span>\r
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.5 7.5l4.5 4.5 4.5-4.5"/></svg>\r
        </button>\r
        <div id="region-menu"\r
             class="hidden absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-white/15\r
                    bg-white/95 dark:bg-[#0E1A2B]/95 backdrop-blur-xl shadow-lg overflow-hidden z-10">\r
          <button class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/10" data-region="DF — Geral" data-i18n="Map.region.df">DF — Geral</button>\r
          <button class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/10" data-region="Bacia Descoberto" data-i18n="Map.region.desc">Bacia Descoberto</button>\r
          <button class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/10" data-region="Bacia Paranoá" data-i18n="Map.region.paranoa">Bacia Paranoá</button>\r
          <button class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/10" data-region="Bacia São Bartolomeu" data-i18n="Map.region.sb">Bacia São Bartolomeu</button>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">\r
      <!-- card do mapa -->\r
      <div class="lg:col-span-8">\r
        <div class="rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-white/5 backdrop-blur"\r
             data-map-card aria-label="Mapa com camadas temáticas">\r
          <!-- Placeholder visual do mapa (mantém estética enquanto o mapa real não é montado) -->\r
          <svg viewBox="0 0 1200 700" class="w-full h-[360px] sm:h-[420px]" role="img" aria-label="Mapa da região selecionada">\r
            <defs>\r
              <linearGradient id="mp-g1" x1="0" y1="0" x2="1" y2="1">\r
                <stop offset="0" stop-color="#E6F4F5"/><stop offset="1" stop-color="#ffffff"/>\r
              </linearGradient>\r
            </defs>\r
            <rect width="1200" height="700" fill="url(#mp-g1)"></rect>\r
            <g opacity="0.25" stroke="#0A5C67" stroke-width="2" fill="none">\r
              <path d="M100 160 C 300 140, 420 160, 620 210 S 920 300, 1100 240"/>\r
              <path d="M80 360 C 260 300, 460 360, 660 330 S 920 320, 1120 360"/>\r
              <path d="M120 520 C 300 500, 520 560, 740 520 S 980 480, 1100 520"/>\r
            </g>\r
            <g fill="#0A5C67">\r
              <circle cx="240" cy="210" r="8"/><circle cx="560" cy="230" r="8"/><circle cx="820" cy="270" r="8"/><circle cx="1020" cy="240" r="8"/>\r
              <circle cx="380" cy="360" r="8"/><circle cx="680" cy="340" r="8"/><circle cx="940" cy="360" r="8"/><circle cx="520" cy="540" r="8"/>\r
            </g>\r
          </svg>\r
        </div>\r
        <!-- legenda curta do mapa (opcional) -->\r
        <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">\r
          <span class="font-medium" data-i18n="Map.legend">Legenda:</span>\r
          <span data-i18n="Map.legend_text">Linhas indicam iso-curvas e os pontos marcam estações/locais de referência.</span>\r
        </p>\r
      </div>\r
\r
      <!-- card de séries (sparkline + valores) -->\r
      <div class="lg:col-span-4">\r
        <div class="rounded-3xl ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5"\r
             data-series-card>\r
          <h3 class="font-semibold text-[#031E21] dark:text-white mb-3" data-i18n="Map.series_title">Tendência (7 dias)</h3>\r
\r
          <div class="space-y-4">\r
            <!-- item -->\r
            <div class="flex items-center justify-between gap-3">\r
              <div class="min-w-24">\r
                <p class="text-sm text-gray-500 dark:text-gray-400" data-i18n="Map.metric_precip">Precipitação</p>\r
                <p class="text-base font-semibold text-[#031E21] dark:text-white">\r
                  <span data-metric="precip">—</span> mm\r
                </p>\r
              </div>\r
              <svg viewBox="0 0 120 30" class="h-8 w-28" aria-hidden="true">\r
                <polyline fill="none" stroke="currentColor" stroke-width="2"\r
                  points="0,20 20,18 40,15 60,17 80,10 100,12 120,8"\r
                  class="text-[#0A5C67] dark:text-[#6BAAC9]"/>\r
              </svg>\r
            </div>\r
\r
            <!-- item -->\r
            <div class="flex items-center justify-between gap-3">\r
              <div class="min-w-24">\r
                <p class="text-sm text-gray-500 dark:text-gray-400" data-i18n="Map.metric_flow">Vazão</p>\r
                <p class="text-base font-semibold text-[#031E21] dark:text-white">\r
                  <span data-metric="flow">—</span> m³/s\r
                </p>\r
              </div>\r
              <svg viewBox="0 0 120 30" class="h-8 w-28" aria-hidden="true">\r
                <polyline fill="none" stroke="currentColor" stroke-width="2"\r
                  points="0,12 20,15 40,14 60,10 80,12 100,18 120,20"\r
                  class="text-[#0A5C67] dark:text-[#6BAAC9]"/>\r
              </svg>\r
            </div>\r
\r
            <!-- item -->\r
            <div class="flex items-center justify-between gap-3">\r
              <div class="min-w-24">\r
                <p class="text-sm text-gray-500 dark:text-gray-400" data-i18n="Map.metric_storage">Armazenamento</p>\r
                <p class="text-base font-semibold text-[#031E21] dark:text-white">\r
                  <span data-metric="storage">—</span> %\r
                </p>\r
              </div>\r
              <svg viewBox="0 0 120 30" class="h-8 w-28" aria-hidden="true">\r
                <polyline fill="none" stroke="currentColor" stroke-width="2"\r
                  points="0,16 20,12 40,10 60,12 80,14 100,12 120,8"\r
                  class="text-[#0A5C67] dark:text-[#6BAAC9]"/>\r
              </svg>\r
            </div>\r
          </div>\r
\r
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400" data-i18n="Map.series_hint">\r
            As mini-curvas mostram a tendência dos últimos 7 dias; o número ao lado é o valor mais recente.\r
          </p>\r
\r
          <a href="/dashboard/"\r
             class="mt-6 inline-flex items-center justify-center w-full rounded-xl px-4 py-2 font-semibold\r
                    bg-[#0A5C67] text-white hover:brightness-110"\r
             data-i18n="Map.cta">Abrir no Dashboard</a>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>\r
`,W=`<!-- /src/partials/home/section-how-it-works.html -->\r
<section id="how" class="w-full">\r
  <div class="w-full max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10 py-12">\r
    <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white" data-i18n="How.title">\r
      Como funciona\r
    </h2>\r
    <p class="mt-1 text-gray-600 dark:text-gray-300 text-sm max-w-prose" data-i18n="How.subtitle">\r
      Pipeline simplificado (mock): coleta diária, processamento por modelos e entrega no dashboard.\r
    </p>\r
\r
    <!-- items-start evita esticar; cada card fica com sua própria altura -->\r
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">\r
      <!-- etapa 1 -->\r
      <article\r
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5\r
               cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"\r
        data-step>\r
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">\r
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18"/><path d="M12 3v18"/></svg>\r
        </div>\r
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="How.s1_title">Coleta</h3>\r
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="How.s1_desc">\r
          Integra dados ANA, INMET e Adasa; normaliza e valida diariamente.\r
        </p>\r
        <div data-step-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">\r
          Dados são agregados automaticamente, tratados e armazenados antes de processar as previsões.\r
        </div>\r
      </article>\r
\r
      <!-- etapa 2 -->\r
      <article\r
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5\r
               cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"\r
        data-step>\r
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">\r
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>\r
        </div>\r
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="How.s2_title">Modelagem</h3>\r
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="How.s2_desc">\r
          Gera previsões 7/14 dias para nível, precipitação e vazão — com métricas de confiança.\r
        </p>\r
        <div data-step-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">\r
          Modelos hidrológicos e ML calibrados para as bacias do DF simulam tendências e incertezas.\r
        </div>\r
      </article>\r
\r
      <!-- etapa 3 -->\r
      <article\r
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5\r
               cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"\r
        data-step>\r
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">\r
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M9 5l7 7-7 7"/></svg>\r
        </div>\r
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="How.s3_title">Entrega</h3>\r
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="How.s3_desc">\r
          Disponibiliza no dashboard, API e alertas (mock) para gestores e cidadãos.\r
        </p>\r
        <div data-step-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">\r
          Publicação diária no dashboard do AguaPrev e disparo de alertas programados (mock).\r
        </div>\r
      </article>\r
    </div>\r
  </div>\r
</section>\r
`,Q=`<!-- /src/partials/auth/login.html -->\r
<section id="login" class="w-full">\r
  <div class="w-full max-w-[560px] mx-auto px-5 sm:px-6 lg:px-10">\r
\r
    <!-- card -->\r
    <div class="relative overflow-hidden rounded-[20px] bg-white/90 dark:bg-[#0C1A2A]/90 backdrop-blur-sm\r
                border border-black/5 dark:border-white/10 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)]">\r
\r
      <!-- gradiente sutil topo -->\r
      <div aria-hidden="true" class="absolute inset-x-0 -top-24 h-48\r
                  bg-gradient-to-b from-[#6BAAC9]/25 via-transparent to-transparent pointer-events-none"></div>\r
\r
      <div class="relative z-10 p-6 sm:p-8">\r
        <div class="flex items-center gap-3">\r
          <div class="h-10 w-10 rounded-xl bg-[#0A5C67]/15 dark:bg-white/10 flex items-center justify-center">\r
            <svg viewBox="0 0 24 24" class="w-5 h-5 text-[#0A5C67] dark:text-white" fill="none" stroke="currentColor" stroke-width="2">\r
              <path d="M12 12c2.8 0 5-2.2 5-5S14.8 2 12 2 7 4.2 7 7s2.2 5 5 5ZM4 22c0-4.4 3.6-8 8-8s8 3.6 8 8"/>\r
            </svg>\r
          </div>\r
          <div>\r
            <h1 class="text-xl font-extrabold tracking-tight text-[#031E21] dark:text-white" data-i18n="Login.title">Entrar</h1>\r
            <p class="text-xs text-gray-600 dark:text-gray-300" data-i18n="Login.subtitle">Acesse sua conta para abrir o dashboard.</p>\r
          </div>\r
        </div>\r
\r
        <!-- form -->\r
        <form id="login-form" class="mt-6 grid gap-4" novalidate>\r
          <!-- email -->\r
          <div>\r
            <label for="login-email" class="block text-sm font-medium mb-1" data-i18n="Login.email_label">E-mail</label>\r
            <input id="login-email" name="email" type="email" autocomplete="email" required\r
              class="w-full rounded-xl px-4 py-3 bg-white dark:bg-white/10 border border-black/5 dark:border-white/10\r
                     outline-none focus:ring-2 focus:ring-[#0A5C67]"\r
              placeholder="voce@exemplo.com" />\r
            <p class="mt-1 text-xs text-red-600 hidden" data-error="email"></p>\r
          </div>\r
\r
          <!-- senha -->\r
          <div>\r
            <label for="login-password" class="block text-sm font-medium mb-1" data-i18n="Login.password_label">Senha</label>\r
            <div class="relative">\r
              <input id="login-password" name="password" type="password" autocomplete="current-password" required\r
                class="w-full rounded-xl px-4 py-3 pr-12 bg-white dark:bg-white/10 border border-black/5 dark:border-white/10\r
                       outline-none focus:ring-2 focus:ring-[#0A5C67]"\r
                placeholder="••••••••" />\r
              <button type="button" id="toggle-pass"\r
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:bg-black/5 dark:hover:bg-white/10"\r
                      aria-label="Mostrar/ocultar senha">\r
                <svg id="icon-eye" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">\r
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>\r
                </svg>\r
                <svg id="icon-eye-off" viewBox="0 0 24 24" class="w-5 h-5 hidden" fill="none" stroke="currentColor" stroke-width="2">\r
                  <path d="M3 3l18 18"/><path d="M10.58 10.58A3 3 0 0 0 9 12c0 1.66 1.34 3 3 3 1.1 0 2.06-.59 2.58-1.47"/>\r
                  <path d="M16.24 7.76A10.94 10.94 0 0 0 12 5C5 5 1 12 1 12a17.65 17.65 0 0 0 5.1 5.11"/>\r
                </svg>\r
              </button>\r
            </div>\r
            <p class="mt-1 text-xs text-red-600 hidden" data-error="password"></p>\r
          </div>\r
\r
          <!-- remember + forgot -->\r
          <div class="flex items-center justify-between">\r
            <label class="inline-flex items-center gap-2 text-sm">\r
              <input id="login-remember" type="checkbox" class="rounded border-gray-300 text-[#0A5C67] focus:ring-[#0A5C67]" />\r
              <span data-i18n="Login.remember">Lembrar de mim</span>\r
            </label>\r
            <a href="#" class="text-sm text-[#0A5C67] hover:underline decoration-dotted underline-offset-2" data-i18n="Login.forgot">Esqueci a senha</a>\r
          </div>\r
\r
          <!-- submit -->\r
          <button id="login-submit" type="submit"\r
            class="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold\r
                   bg-[#0A5C67] text-white hover:brightness-110 shadow-sm\r
                   focus:outline-none focus:ring-2 focus:ring-[#0A5C67]">\r
            <span data-i18n="Login.signin">Entrar</span>\r
            <svg id="login-spinner" class="w-4 h-4 animate-spin hidden" viewBox="0 0 24 24" fill="none">\r
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>\r
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>\r
            </svg>\r
          </button>\r
\r
          <!-- feedback -->\r
          <p id="login-feedback" class="mt-2 text-sm hidden"></p>\r
        </form>\r
\r
        <!-- divider -->\r
        <div class="my-6 flex items-center gap-3">\r
          <div class="h-px flex-1 bg-black/10 dark:bg-white/10"></div>\r
          <span class="text-xs text-gray-500 dark:text-gray-400" data-i18n="Login.or">ou</span>\r
          <div class="h-px flex-1 bg-black/10 dark:bg-white/10"></div>\r
        </div>\r
\r
        <!-- social mock -->\r
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">\r
          <button class="rounded-xl border border-black/5 dark:border-white/10 py-2.5 hover:bg-black/5 dark:hover:bg-white/10">\r
            <span class="text-sm" data-i18n="Login.google">Continuar com Google</span>\r
          </button>\r
          <button class="rounded-xl border border-black/5 dark:border-white/10 py-2.5 hover:bg-black/5 dark:hover:bg-white/10">\r
            <span class="text-sm" data-i18n="Login.github">Continuar com GitHub</span>\r
          </button>\r
        </div>\r
\r
        <!-- register -->\r
        <p class="mt-6 text-sm text-gray-600 dark:text-gray-300">\r
          <span data-i18n="Login.no_account">Ainda não tem conta?</span>\r
          <a href="signup.html" class="text-[#0A5C67] hover:underline decoration-dotted underline-offset-2" data-i18n="Login.create">Criar conta</a>\r
        </p>\r
      </div>\r
    </div>\r
  </div>\r
</section>\r
`,J=`<!-- /src/partials/auth/register.html -->\r
<section class="w-full">\r
  <div class="w-full max-w-[740px] mx-auto px-5 sm:px-6 lg:px-10 py-10">\r
    <header class="mb-6 text-center">\r
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white"\r
          data-i18n="Auth.Register.title">Criar conta</h1>\r
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-300"\r
         data-i18n="Auth.Register.subtitle">Preencha os dados para acessar o AguaPrev.</p>\r
    </header>\r
\r
    <form id="ap-register-form"\r
          class="ap-card p-6 sm:p-7 rounded-2xl bg-white/85 dark:bg-white/[.06] backdrop-blur">\r
\r
      <!-- Nome completo -->\r
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"\r
             for="ap-fullname" data-i18n="Auth.Register.fullname_label">Nome completo</label>\r
      <input id="ap-fullname" name="fullname" type="text" required\r
             class="w-full rounded-xl border border-gray-200/80 dark:border-white/15 bg-white/80 dark:bg-white/5\r
                    px-4 py-3 outline-none focus:ring-2 focus:ring-[#0A5C67]/40 transition"\r
             placeholder="Ex.: Maria Oliveira" />\r
\r
      <!-- E-mail -->\r
      <div class="mt-4">\r
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"\r
               for="ap-email" data-i18n="Auth.Register.email_label">E-mail</label>\r
        <input id="ap-email" name="email" type="email" required\r
               class="w-full rounded-xl border border-gray-200/80 dark:border-white/15 bg-white/80 dark:bg-white/5\r
                      px-4 py-3 outline-none focus:ring-2 focus:ring-[#0A5C67]/40 transition"\r
               placeholder="voce@exemplo.com" />\r
      </div>\r
\r
      <!-- Senha -->\r
      <div class="mt-4">\r
        <div class="flex items-center justify-between">\r
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200"\r
                 for="ap-pass" data-i18n="Auth.Register.password_label">Senha</label>\r
\r
          <!-- Mostrar/Ocultar -->\r
          <button type="button" id="toggle-pass"\r
                  class="group relative inline-flex items-center gap-1 text-xs font-medium\r
                         text-[#0A5C67] dark:text-[#6BAAC9]\r
                         hover:text-[#074750] dark:hover:text-[#9DD3E4]\r
                         focus:outline-none focus:ring-2 focus:ring-[#0A5C67]/40\r
                         rounded-md px-1.5 py-0.5 transition">\r
            <svg class="w-4 h-4 opacity-80 group-hover:opacity-100 transition"\r
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"\r
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\r
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"></path>\r
              <circle cx="12" cy="12" r="3"></circle>\r
            </svg>\r
            <span data-i18n="Auth.toggle_show">Mostrar</span>\r
          </button>\r
        </div>\r
\r
        <input id="ap-pass" name="password" type="password" required minlength="8"\r
               class="mt-1 w-full rounded-xl border border-gray-200/80 dark:border-white/15 bg-white/80 dark:bg-white/5\r
                      px-4 py-3 outline-none focus:ring-2 focus:ring-[#0A5C67]/40 transition"\r
               placeholder="Mínimo 8 caracteres" />\r
\r
        <!-- Barra de força da senha -->\r
        <div class="mt-3" aria-live="polite">\r
          <div class="w-full h-2 rounded-full bg-gray-200/70 dark:bg-white/10 overflow-hidden">\r
            <div id="ap-pass-strength-bar"\r
                 class="h-2 w-0 rounded-full transition-all duration-300 ease-out"></div>\r
          </div>\r
          <div class="mt-2 flex items-center justify-between text-xs">\r
            <span id="ap-pass-strength-label"\r
                  class="font-medium text-gray-600 dark:text-gray-300"\r
                  data-i18n="Auth.Password.strength_unknown">Força da senha</span>\r
            <span class="text-[11px] text-gray-500 dark:text-gray-400"\r
                  data-i18n="Auth.Password.hint">Use letras maiúsculas/minúsculas, números e símbolos.</span>\r
          </div>\r
        </div>\r
      </div>\r
\r
      <!-- Confirmar senha -->\r
      <div class="mt-4">\r
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"\r
               for="ap-pass2" data-i18n="Auth.Register.password2_label">Confirmar senha</label>\r
        <input id="ap-pass2" name="password2" type="password" required minlength="8"\r
               class="w-full rounded-xl border border-gray-200/80 dark:border-white/15 bg-white/80 dark:bg-white/5\r
                      px-4 py-3 outline-none focus:ring-2 transition"\r
               placeholder="Repita a senha" />\r
        <p id="ap-pass-match"\r
           class="mt-2 text-xs font-medium hidden"\r
           aria-live="polite">\r
          <!-- Mensagem preenchida via JS + i18n -->\r
        </p>\r
      </div>\r
\r
      <!-- Termos -->\r
      <label class="mt-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 select-none">\r
        <input id="ap-terms" type="checkbox" required class="rounded border-gray-300 dark:border-white/20\r
               text-[#0A5C67] focus:ring-[#0A5C67]/40">\r
        <span data-i18n="Auth.Register.terms">Aceito os termos de uso e a política de privacidade</span>\r
      </label>\r
\r
      <!-- Ações -->\r
      <div class="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">\r
        <button type="submit"\r
                class="inline-flex justify-center items-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold\r
                       bg-[#0A5C67] text-white shadow hover:brightness-110 focus:outline-none\r
                       focus:ring-2 focus:ring-offset-2 focus:ring-[#0A5C67] dark:focus:ring-offset-[#0E1A2B]"\r
                data-i18n="Auth.Register.cta">Criar conta</button>\r
\r
        <p class="text-sm text-gray-600 dark:text-gray-300">\r
          <span data-i18n="Auth.Register.have_account">Já tem conta?</span>\r
          <a class="ml-1 underline decoration-dotted decoration-1 underline-offset-2 text-[#0A5C67] dark:text-[#9DD3E4] hover:opacity-90"\r
             href="/login.html" data-i18n="Auth.Register.login_link">Entrar</a>\r
        </p>\r
      </div>\r
    </form>\r
  </div>\r
</section>\r
`;function X(n=document){const a=n.querySelector("[data-hero-visual]"),s=n.querySelector("[data-hero-float]");if(requestAnimationFrame(()=>{a&&(a.style.opacity="0",a.style.transform="translateY(8px)",a.style.transition="opacity 400ms ease, transform 500ms ease",requestAnimationFrame(()=>{a.style.opacity="1",a.style.transform="translateY(0)"})),s&&(s.style.opacity="0",s.style.transform="translateY(6px)",s.style.transition="opacity 400ms ease 120ms, transform 500ms ease 120ms",requestAnimationFrame(()=>{s.style.opacity="1",s.style.transform="translateY(0)"}))}),s){const r=()=>{const o=s.getBoundingClientRect(),l=window.innerHeight||document.documentElement.clientHeight,d=1-Math.min(Math.max((o.top+o.height/2)/l,0),1),c=Math.round(d*6);s.style.transform=`translateY(${c}px)`};r(),window.addEventListener("scroll",r,{passive:!0})}}function K(n){if(!n||n.dataset.boundHighlights==="1")return;n.dataset.boundHighlights="1";const a=Array.from(n.querySelectorAll("[data-highlight]"));if(!a.length)return;a.forEach(e=>{const t=e.querySelector("[data-highlight-extra]");t&&(t.classList.add("hidden"),t.style.overflow="hidden",t.style.maxHeight="0px",t.style.opacity="0",t.style.transition="max-height 420ms ease, opacity 320ms ease"),e.setAttribute("aria-expanded","false"),e.setAttribute("tabindex","0"),e.style.cursor="pointer"});const s=e=>e.querySelector("[data-highlight-extra]"),r=e=>e.dataset.tid?Number(e.dataset.tid):null,o=(e,t)=>{e.dataset.tid=String(t)},l=e=>{const t=r(e);t&&(clearTimeout(t),delete e.dataset.tid)};function d(e){const t=s(e);t&&(l(t),t.style.maxHeight="0px",t.style.opacity="0",o(t,window.setTimeout(()=>{t.classList.add("hidden"),l(t)},430)),e.setAttribute("aria-expanded","false"),e.classList.remove("ring-2","ring-[#0A5C67]/30","dark:ring-white/20"))}function c(e){const t=s(e);if(!t)return;l(t),t.classList.remove("hidden"),t.style.maxHeight="0px",t.style.opacity="0";const p=t.scrollHeight;requestAnimationFrame(()=>{t.style.maxHeight=p+"px",t.style.opacity="1"}),e.setAttribute("aria-expanded","true"),e.classList.add("ring-2","ring-[#0A5C67]/30","dark:ring-white/20")}function g(e){const t=e.getAttribute("aria-expanded")==="true";a.forEach(p=>{p!==e&&d(p)}),t?d(e):c(e)}a.forEach(e=>{e.addEventListener("click",()=>g(e)),e.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),g(e)),t.key==="Escape"&&(t.preventDefault(),d(e))})});let i;window.addEventListener("resize",()=>{cancelAnimationFrame(i),i=requestAnimationFrame(()=>{const e=a.find(t=>t.getAttribute("aria-expanded")==="true");if(e){const t=s(e);t&&(t.style.maxHeight=t.scrollHeight+"px")}})},{passive:!0})}function ee(n=document){const a=n.querySelector("#region-toggle"),s=n.querySelector("#region-menu"),r=n.querySelector("#region-current"),o={precip:n.querySelector('[data-mock="precip"]'),flow:n.querySelector('[data-mock="flow"]'),storage:n.querySelector('[data-mock="storage"]')};if(a&&s&&r){const c=()=>s.classList.add("hidden"),g=()=>s.classList.remove("hidden");a.addEventListener("click",()=>s.classList.contains("hidden")?g():c()),document.addEventListener("mousedown",i=>{!s.contains(i.target)&&!a.contains(i.target)&&c()}),s.querySelectorAll("[data-region]").forEach(i=>{i.addEventListener("click",()=>{const e=i.getAttribute("data-region");r.textContent=e,o.precip.textContent=(10+Math.round(Math.random()*40)).toString(),o.flow.textContent=(5+Math.round(Math.random()*25)).toString(),o.storage.textContent=(40+Math.round(Math.random()*50)).toString(),c()})})}const l=n.querySelector("[data-map-card]"),d=n.querySelector("[data-series-card]");[l,d].forEach((c,g)=>{c&&(c.style.opacity="0",c.style.transform="translateY(8px)",c.style.transition=`opacity 400ms ease ${g*50}ms, transform 500ms ease ${g*50}ms`,requestAnimationFrame(()=>{c.style.opacity="1",c.style.transform="translateY(0)"}))})}function te(n){if(!n||n.dataset.boundHow==="1")return;n.dataset.boundHow="1";const a=Array.from(n.querySelectorAll("[data-step]"));if(!a.length)return;a.forEach(e=>{const t=e.querySelector("[data-step-extra]");t&&(t.classList.add("hidden"),t.style.overflow="hidden",t.style.maxHeight="0px",t.style.opacity="0",t.style.transition="max-height 420ms ease, opacity 320ms ease"),e.setAttribute("aria-expanded","false"),e.setAttribute("tabindex","0"),e.style.cursor="pointer"});const s=e=>e.querySelector("[data-step-extra]"),r=e=>e.dataset.tid?Number(e.dataset.tid):null,o=(e,t)=>{e.dataset.tid=String(t)},l=e=>{const t=r(e);t&&(clearTimeout(t),delete e.dataset.tid)};function d(e){const t=s(e);t&&(l(t),t.style.maxHeight="0px",t.style.opacity="0",o(t,window.setTimeout(()=>{t.classList.add("hidden"),l(t)},430)),e.setAttribute("aria-expanded","false"),e.classList.remove("ring-2","ring-[#0A5C67]/30","dark:ring-white/20"))}function c(e){const t=s(e);if(!t)return;l(t),t.classList.remove("hidden"),t.style.maxHeight="0px",t.style.opacity="0";const p=t.scrollHeight;requestAnimationFrame(()=>{t.style.maxHeight=p+"px",t.style.opacity="1"}),e.setAttribute("aria-expanded","true"),e.classList.add("ring-2","ring-[#0A5C67]/30","dark:ring-white/20")}function g(e){const t=e.getAttribute("aria-expanded")==="true";a.forEach(p=>{p!==e&&d(p)}),t?d(e):c(e)}a.forEach(e=>{e.addEventListener("click",()=>g(e)),e.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),g(e)),t.key==="Escape"&&(t.preventDefault(),d(e))})});let i;window.addEventListener("resize",()=>{cancelAnimationFrame(i),i=requestAnimationFrame(()=>{const e=a.find(t=>t.getAttribute("aria-expanded")==="true");if(e){const t=s(e);t&&(t.style.maxHeight=t.scrollHeight+"px")}})},{passive:!0})}function re(n){if(!n||n.dataset.boundLogin==="1")return;n.dataset.boundLogin="1";const a=n.querySelector("#login-form"),s=n.querySelector("#login-email"),r=n.querySelector("#login-password"),o=n.querySelector("#login-remember"),l=n.querySelector("#login-feedback"),d=n.querySelector("#login-submit"),c=n.querySelector("#login-spinner"),g=n.querySelector("#toggle-pass"),i=n.querySelector("#icon-eye"),e=n.querySelector("#icon-eye-off");g&&g.addEventListener("click",()=>{const u=r.type==="text";r.type=u?"password":"text",i.classList.toggle("hidden",!!u),e.classList.toggle("hidden",!u)});function t(u){d.disabled=u,c.classList.toggle("hidden",!u)}function p(u,v){const w=n.querySelector(`[data-error="${u}"]`);w&&(w.textContent=v,w.classList.remove("hidden"))}function h(){n.querySelectorAll("[data-error]").forEach(u=>u.classList.add("hidden"))}function x(u,v){l&&(l.textContent=v,l.classList.remove("hidden","text-red-600","text-[#0A5C67]","dark:text-[#6BAAC9]"),u==="error"?l.classList.add("text-red-600"):l.classList.add("text-[#0A5C67]","dark:text-[#6BAAC9]"))}a&&a.addEventListener("submit",u=>{u.preventDefault(),h(),x("","");const v=((s==null?void 0:s.value)||"").trim(),w=((r==null?void 0:r.value)||"").trim(),R=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);R||p("email","Informe um e-mail válido."),w||p("password","Informe sua senha."),!(!R||!w)&&(t(!0),setTimeout(()=>{if(t(!1),v.toLowerCase().includes("aguaprev")){const I="mock-token-"+Math.random().toString(36).slice(2);(o!=null&&o.checked?localStorage:sessionStorage).setItem("aguaprev_token",I),x("success","Login realizado! Redirecionando..."),setTimeout(()=>{window.location.href="/dashboard/"},700)}else x("error","Credenciais inválidas.")},900))})}const ae={"Header.Nav.home":{"pt-BR":"Início",en:"Home",es:"Inicio"},"Header.Nav.how":{"pt-BR":"Como Funciona",en:"How It Works",es:"Cómo Funciona"},"Header.Nav.features":{"pt-BR":"Recursos",en:"Features",es:"Recursos"},"Header.Nav.partners":{"pt-BR":"Parceiros",en:"Partners",es:"Aliados"},"Header.Nav.faq":{"pt-BR":"FAQ",en:"FAQ",es:"FAQ"},"Header.cta":{"pt-BR":"Login",en:"Login",es:"Acceso"},"Header.cta_lang":{"pt-BR":"PT-BR",en:"EN",es:"ES"},"Hero.badge":{"pt-BR":"Previsão Hídrica do DF",en:"DF Water Forecast",es:"Pronóstico Hídrico DF"},"Hero.title":{"pt-BR":"Antecipe cheias e escassez com<br class='hidden sm:block'/>mapas e previsões confiáveis",en:"Anticipate floods and droughts with<br class='hidden sm:block'/>reliable maps and forecasts",es:"Anticipe crecidas y escasez con<br class='hidden sm:block'/>mapas y pronósticos confiables"},"Hero.subtitle":{"pt-BR":"O <strong>AguaPrev</strong> integra dados hidrometeorológicos e modelos de previsão para oferecer <em>insights acionáveis</em> a gestores, produtores e cidadãos no Distrito Federal.",en:"<strong>AguaPrev</strong> integrates hydrometeorological data and forecasting models to provide <em>actionable insights</em> for managers, farmers, and citizens in the Federal District.",es:"<strong>AguaPrev</strong> integra datos hidrometeorológicos y modelos de pronóstico para ofrecer <em>insights accionables</em> a gestores, productores y ciudadanos en el Distrito Federal."},"Hero.cta_primary":{"pt-BR":"Abrir Dashboard",en:"Open Dashboard",es:"Abrir Panel"},"Hero.cta_secondary":{"pt-BR":"Como funciona",en:"How it works",es:"Cómo funciona"},"Hero.trust_1":{"pt-BR":"Dados ANA/INMET/Adasa",en:"ANA/INMET/Adasa data",es:"Datos ANA/INMET/Adasa"},"Hero.trust_2":{"pt-BR":"Atualização diária",en:"Daily updates",es:"Actualización diaria"},"Hero.trust_3":{"pt-BR":"Modelos validados",en:"Validated models",es:"Modelos validados"},"Hero.float_title":{"pt-BR":"TENDÊNCIA 7 DIAS — BACIA DESCOBERTO",en:"7-DAY TREND — DESCOBERTO BASIN",es:"TENDENCIA 7 DÍAS — CUENCA DESCOBERTO"},"Hero.float_label":{"pt-BR":"volume esperado",en:"expected volume",es:"volumen esperado"},"Hero.anchor_map":{"pt-BR":"Ver mapa/forecast",en:"See map/forecast",es:"Ver mapa/forecast"},"Hero.anchor_usecases":{"pt-BR":"Casos de uso",en:"Use cases",es:"Casos de uso"},"Hero.anchor_docs":{"pt-BR":"Documentação",en:"Docs",es:"Documentación"},"Trust.data_sources_label":{"pt-BR":"Fontes de dados",en:"Data sources",es:"Fuentes de datos"},"Trust.data_sources_value":{"pt-BR":"ANA • INMET • Adasa",en:"ANA • INMET • Adasa",es:"ANA • INMET • Adasa"},"Trust.update_label":{"pt-BR":"Atualização",en:"Update",es:"Actualización"},"Trust.update_value":{"pt-BR":"Diária",en:"Daily",es:"Diaria"},"Trust.validation_label":{"pt-BR":"Validação",en:"Validation",es:"Validación"},"Trust.validation_value":{"pt-BR":"Modelos revisados",en:"Reviewed models",es:"Modelos revisados"},"Highlights.p1_title":{"pt-BR":"Previsão 7/14 dias",en:"7/14-day forecast",es:"Pronóstico 7/14 días"},"Highlights.p1_desc":{"pt-BR":"Tendências de volume/nível com atualização diária para bacias do DF.",en:"Volume/level trends with daily updates for DF basins.",es:"Tendencias de volumen/nivel con actualizaciones diarias para cuencas del DF."},"Highlights.p2_title":{"pt-BR":"Alertas inteligentes",en:"Smart alerts",es:"Alertas inteligentes"},"Highlights.p2_desc":{"pt-BR":"Notificações por bacia/região quando limiares críticos são previstos.",en:"Basin/region notifications when critical thresholds are forecast.",es:"Notificaciones por cuenca/región cuando se pronostican umbrales críticos."},"Highlights.p3_title":{"pt-BR":"Mapas temáticos",en:"Thematic maps",es:"Mapas temáticos"},"Highlights.p3_desc":{"pt-BR":"Camadas de precipitação, vazão e risco, com filtros por período.",en:"Precipitation, flow and risk layers with period filters.",es:"Capas de precipitación, caudal y riesgo con filtros por período."},"Highlights.p4_title":{"pt-BR":"API & Export",en:"API & Export",es:"API y Exportación"},"Highlights.p4_desc":{"pt-BR":"Acesso programático e downloads para análise externa.",en:"Programmatic access and downloads for external analysis.",es:"Acceso programático y descargas para análisis externo."},"How.title":{"pt-BR":"Como funciona",en:"How it works",es:"Cómo funciona"},"How.subtitle":{"pt-BR":"Pipeline simplificado: coleta diária, processamento por modelos e entrega no dashboard.",en:"Simplified pipeline: daily collection, model processing and delivery on the dashboard.",es:"Flujo simplificado: recolección diaria, modelado y entrega en el panel."},"How.s1_title":{"pt-BR":"Coleta",en:"Collection",es:"Recolección"},"How.s1_desc":{"pt-BR":"Integra dados ANA, INMET e Adasa; normaliza e valida diariamente.",en:"Integrates ANA, INMET and Adasa data; normalizes and validates daily.",es:"Integra datos de ANA, INMET y Adasa; normaliza y valida diariamente."},"How.s2_title":{"pt-BR":"Modelagem",en:"Modeling",es:"Modelado"},"How.s2_desc":{"pt-BR":"Gera previsões 7/14 dias para nível, precipitação e vazão — com métricas de confiança.",en:"Generates 7/14-day forecasts for level, precipitation and flow — with confidence metrics.",es:"Genera pronósticos a 7/14 días para nivel, precipitación y caudal — con métricas de confianza."},"How.s3_title":{"pt-BR":"Entrega",en:"Delivery",es:"Entrega"},"How.s3_desc":{"pt-BR":"Disponibiliza no dashboard, API e alertas para gestores e cidadãos.",en:"Delivers to the dashboard, API and alerts for managers and citizens.",es:"Disponible en el panel, API y alertas para gestores y ciudadanos."},"Map.title":{"pt-BR":"Mapa & Forecast",en:"Map & Forecast",es:"Mapa y Pronóstico"},"Map.subtitle":{"pt-BR":"Selecione a região para ver o mapa e a tendência em 7 dias. As linhas indicam a variação ao longo da semana; os valores ao lado mostram o último ponto disponível.",en:"Select a region to see the map and 7-day trend. Lines indicate variation through the week; the values beside show the latest reading.",es:"Selecciona la región para ver el mapa y la tendencia a 7 días. Las líneas indican la variación semanal; los valores al lado muestran la última lectura."},"Map.legend":{"pt-BR":"Legenda:",en:"Legend:",es:"Leyenda:"},"Map.legend_text":{"pt-BR":"Linhas indicam iso-curvas e os pontos marcam estações/locais de referência.",en:"Lines indicate iso-curves and points mark reference stations/locations.",es:"Las líneas indican iso-curvas y los puntos marcan estaciones/lugares de referencia."},"Map.series_title":{"pt-BR":"Tendência (7 dias)",en:"Trend (7 days)",es:"Tendencia (7 días)"},"Map.metric_precip":{"pt-BR":"Precipitação",en:"Precipitation",es:"Precipitación"},"Map.metric_flow":{"pt-BR":"Vazão",en:"Flow",es:"Caudal"},"Map.metric_storage":{"pt-BR":"Armazenamento",en:"Storage",es:"Almacenamiento"},"Map.series_hint":{"pt-BR":"As mini-curvas mostram a tendência de 7 dias; o número ao lado é o valor mais recente.",en:"Sparklines show the 7-day trend; the number beside is the latest value.",es:"Los minigráficos muestran la tendencia de 7 días; el número al lado es el valor más reciente."},"Map.region.df":{"pt-BR":"DF — Geral",en:"DF — Overview",es:"DF — General"},"Map.region.desc":{"pt-BR":"Bacia Descoberto",en:"Descoberto Basin",es:"Cuenca Descoberto"},"Map.region.paranoa":{"pt-BR":"Bacia Paranoá",en:"Paranoá Basin",es:"Cuenca Paranoá"},"Map.region.sb":{"pt-BR":"Bacia São Bartolomeu",en:"São Bartolomeu Basin",es:"Cuenca São Bartolomeu"},"Map.cta":{"pt-BR":"Abrir no Dashboard",en:"Open in Dashboard",es:"Abrir en el Panel"},"Footer.product":{"pt-BR":"Produto",en:"Product",es:"Producto"},"Footer.company":{"pt-BR":"Institucional",en:"Company",es:"Institucional"},"Footer.legal":{"pt-BR":"Legal",en:"Legal",es:"Legal"},"Footer.link.how":{"pt-BR":"Como funciona",en:"How it works",es:"Cómo funciona"},"Footer.link.features":{"pt-BR":"Recursos",en:"Features",es:"Recursos"},"Footer.link.map":{"pt-BR":"Mapa & Forecast",en:"Map & Forecast",es:"Mapa y Forecast"},"Footer.link.docs":{"pt-BR":"Docs",en:"Docs",es:"Docs"},"Footer.link.about":{"pt-BR":"Sobre",en:"About",es:"Acerca de"},"Footer.link.contact":{"pt-BR":"Contato",en:"Contact",es:"Contacto"},"Footer.link.terms":{"pt-BR":"Termos de uso",en:"Terms of use",es:"Términos de uso"},"Footer.link.privacy":{"pt-BR":"Privacidade",en:"Privacy",es:"Privacidad"},"Footer.link.licenses":{"pt-BR":"Licenças",en:"Licenses",es:"Licencias"},"Footer.copyright":{"pt-BR":"© {year} AguaPrev — Universidade de Brasília",en:"© {year} AguaPrev — University of Brasília",es:"© {year} AguaPrev — Universidad de Brasilia"},"Login.title":{"pt-BR":"Entrar",en:"Sign in",es:"Iniciar sesión"},"Login.page_subtitle":{"pt-BR":"Acesse sua conta para abrir o dashboard do AguaPrev.",en:"Access your account to open the AguaPrev dashboard.",es:"Accede a tu cuenta para abrir el panel de AguaPrev."},"Login.form_subtitle":{"pt-BR":"Use seu e-mail e senha ou entre com um provedor.",en:"Use your email and password or continue with a provider.",es:"Usa tu correo y contraseña o continúa con un proveedor."},"Login.subtitle":{"pt-BR":"Acesse sua conta para abrir o dashboard do AguaPrev.",en:"Access your account to open the AguaPrev dashboard.",es:"Accede a tu cuenta para abrir el panel de AguaPrev."},"Login.email_label":{"pt-BR":"E-mail",en:"Email",es:"Correo"},"Login.password_label":{"pt-BR":"Senha",en:"Password",es:"Contraseña"},"Login.remember":{"pt-BR":"Lembrar de mim",en:"Remember me",es:"Recuérdame"},"Login.forgot":{"pt-BR":"Esqueci a senha",en:"Forgot password",es:"Olvidé mi contraseña"},"Login.signin":{"pt-BR":"Entrar",en:"Sign in",es:"Entrar"},"Login.or":{"pt-BR":"ou",en:"or",es:"o"},"Login.google":{"pt-BR":"Continuar com Google",en:"Continue with Google",es:"Continuar con Google"},"Login.github":{"pt-BR":"Continuar com GitHub",en:"Continue with GitHub",es:"Continuar con GitHub"},"Login.no_account":{"pt-BR":"Ainda não tem conta?",en:"Don’t have an account?",es:"¿Aún no tienes cuenta?"},"Login.create":{"pt-BR":"Criar conta",en:"Create account",es:"Crear cuenta"},"Auth.Register.title":{"pt-BR":"Criar conta",en:"Create account",es:"Crear cuenta"},"Auth.Register.subtitle":{"pt-BR":"Acesse mapas e previsões personalizadas do AguaPrev.",en:"Access personalized maps and forecasts from AguaPrev.",es:"Accede a mapas y pronósticos personalizados de AguaPrev."},"Auth.Register.fullname_label":{"pt-BR":"Nome completo",en:"Full name",es:"Nombre completo"},"Auth.Register.name_label":{"pt-BR":"Nome completo",en:"Full name",es:"Nombre completo"},"Auth.Register.email_label":{"pt-BR":"E-mail",en:"Email",es:"Correo"},"Auth.Register.password_label":{"pt-BR":"Senha",en:"Password",es:"Contraseña"},"Auth.Register.password2_label":{"pt-BR":"Confirmar senha",en:"Confirm password",es:"Confirmar contraseña"},"Auth.Register.password_confirm_label":{"pt-BR":"Confirmar senha",en:"Confirm password",es:"Confirmar contraseña"},"Auth.Register.terms":{"pt-BR":"Aceito os termos de uso e a política de privacidade",en:"I accept the terms of use and the privacy policy",es:"Acepto los términos de uso y la política de privacidad"},"Auth.Register.accept_terms_label":{"pt-BR":"Li e aceito os Termos e a Política de Privacidade",en:"I have read and accept the Terms and the Privacy Policy",es:"He leído y acepto los Términos y la Política de Privacidad"},"Auth.Register.terms_link":{"pt-BR":"Termos",en:"Terms",es:"Términos"},"Auth.Register.privacy_link":{"pt-BR":"Privacidade",en:"Privacy",es:"Privacidad"},"Auth.Register.cta":{"pt-BR":"Criar conta",en:"Create account",es:"Crear cuenta"},"Auth.Register.login_link":{"pt-BR":"Entrar",en:"Sign in",es:"Entrar"},"Auth.Register.have_account":{"pt-BR":"Já tem conta?",en:"Already have an account?",es:"¿Ya tienes cuenta?"},"Auth.Register.create":{"pt-BR":"Criar conta",en:"Create account",es:"Crear cuenta"},"Auth.Register.signin":{"pt-BR":"Entrar",en:"Sign in",es:"Entrar"},"Auth.Register.or":{"pt-BR":"ou",en:"or",es:"o"},"Auth.Register.google":{"pt-BR":"Continuar com Google",en:"Continue with Google",es:"Continuar con Google"},"Auth.Register.github":{"pt-BR":"Continuar com GitHub",en:"Continue with GitHub",es:"Continuar con GitHub"},"Auth.toggle_show":{"pt-BR":"Mostrar",en:"Show",es:"Mostrar"},"Auth.toggle_hide":{"pt-BR":"Ocultar",en:"Hide",es:"Ocultar"},"Auth.Password.strength_unknown":{"pt-BR":"Força da senha",en:"Password strength",es:"Fuerza de la contraseña"},"Auth.Password.strength":{"pt-BR":"Segurança da senha",en:"Password strength",es:"Seguridad de la contraseña"},"Auth.Password.very_weak":{"pt-BR":"Muito fraca",en:"Very weak",es:"Muy débil"},"Auth.Password.weak":{"pt-BR":"Fraca",en:"Weak",es:"Débil"},"Auth.Password.medium":{"pt-BR":"Média",en:"Medium",es:"Media"},"Auth.Password.strong":{"pt-BR":"Forte",en:"Strong",es:"Fuerte"},"Auth.Password.very_strong":{"pt-BR":"Muito forte",en:"Very strong",es:"Muy fuerte"},"Auth.Password.hint":{"pt-BR":"Use pelo menos 8 caracteres, combinando letras maiúsculas, minúsculas, números e símbolos.",en:"Use at least 8 characters mixing uppercase, lowercase, numbers, and symbols.",es:"Usa al menos 8 caracteres combinando mayúsculas, minúsculas, números y símbolos."},"Auth.Password.match_ok":{"pt-BR":"Senhas conferem.",en:"Passwords match.",es:"Las contraseñas coinciden."},"Auth.Password.match_fail":{"pt-BR":"As senhas não conferem.",en:"Passwords do not match.",es:"Las contraseñas no coinciden."},"Sidebar.overview":{"pt-BR":"Visão geral",en:"Overview",es:"Resumen"},"Sidebar.maps":{"pt-BR":"Mapas",en:"Maps",es:"Mapas"},"Sidebar.series":{"pt-BR":"Séries",en:"Series",es:"Series"},"Sidebar.alerts":{"pt-BR":"Alertas",en:"Alerts",es:"Alertas"},"Sidebar.downloads":{"pt-BR":"Downloads",en:"Downloads",es:"Descargas"},"Sidebar.settings":{"pt-BR":"Configurações",en:"Settings",es:"Configuraciones"},"Sidebar.signout":{"pt-BR":"Sair",en:"Sign out",es:"Salir"},"Sidebar.section_admin":{"pt-BR":"Conta",en:"Account",es:"Cuenta"}},D="aguaprev_lang",C="pt-BR";let b=null,k=null,y=!1,A=!1;function B(){if(b)return b;const n=localStorage.getItem(D);if(n)return b=n;const a=navigator.language||navigator.userLanguage||C;return["pt-BR","en","es"].includes(a)?b=a:a.startsWith("pt")?b="pt-BR":a.startsWith("es")?b="es":b=C}function ne(n){b=n,localStorage.setItem(D,n),m(document)}function N(n,a=B()){const s=ae[n];return s?s[a]??s[C]??n:n}function m(n=document){if(y){A=!0;return}y=!0;const a=B();n.querySelectorAll("[data-i18n]").forEach(r=>{const o=r.getAttribute("data-i18n");if(!o)return;const l=N(o,a);r.innerHTML!==l&&(r.innerHTML=l)}),requestAnimationFrame(()=>{y=!1,A&&(A=!1,m(n))})}function q(n=document.body){k&&k.disconnect();let a=null;const s=()=>{y||a||(a=requestAnimationFrame(()=>{a=null,m(document)}))};k=new MutationObserver(r=>{var o,l;for(const d of r){if(y)return;if(d.type==="childList"&&((o=d.addedNodes)!=null&&o.length||(l=d.removedNodes)!=null&&l.length)){s();return}if(d.type==="attributes"&&d.attributeName==="data-i18n"){s();return}}}),k.observe(n,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-i18n"]}),m(document)}const ce=Object.freeze(Object.defineProperty({__proto__:null,applyTranslations:m,getLanguage:B,setLanguage:ne,startI18nObserver:q,t:N},Symbol.toStringTag,{value:"Module"}));function se(n=document){var g;const a=n.querySelector("#ap-register-form");if(!a)return;const s=i=>a.querySelector(i),r={name:s("#ap-fullname"),email:s("#ap-email"),pass:s("#ap-pass"),pass2:s("#ap-pass2"),terms:s("#ap-terms"),toggle:s("#toggle-pass"),bar:s("#ap-pass-strength-bar"),label:s("#ap-pass-strength-label"),match:s("#ap-pass-match")},o=i=>{const e=r.toggle.querySelector("span"),t=r.toggle.querySelector("svg");e.setAttribute("data-i18n",i?"Auth.toggle_hide":"Auth.toggle_show"),m(e.parentElement),t.innerHTML=i?'<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.29 20.29 0 0 1 4.23-5.52m4.43-2.49A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.28 20.28 0 0 1-3.12 4.02"/><line x1="1" y1="1" x2="23" y2="23"/>':'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/>'};(g=r.toggle)==null||g.addEventListener("click",()=>{const i=r.pass.type==="password";r.pass.type=i?"text":"password",r.pass2.type=i?"text":"password",o(i)}),o(!1);const l=i=>{if(!i)return{pct:0,cls:"bg-gray-300 dark:bg-white/15",key:"Auth.Password.strength_unknown"};let e=0;return i.length>=8&&e++,i.length>=12&&e++,/[a-z]/.test(i)&&/[A-Z]/.test(i)&&e++,/\d/.test(i)&&e++,/[^A-Za-z0-9]/.test(i)&&e++,e<=1?{pct:20,cls:"bg-red-500",key:"Auth.Password.very_weak"}:e===2?{pct:40,cls:"bg-orange-500",key:"Auth.Password.weak"}:e===3?{pct:60,cls:"bg-amber-500",key:"Auth.Password.medium"}:e===4?{pct:80,cls:"bg-lime-500",key:"Auth.Password.strong"}:{pct:100,cls:"bg-emerald-500",key:"Auth.Password.very_strong"}},d=()=>{const i=l(r.pass.value);r.bar.style.width=`${i.pct}%`,r.bar.className=`h-2 rounded-full transition-all duration-300 ease-out ${i.cls}`,r.label.setAttribute("data-i18n",i.key),m(r.label.parentElement)},c=()=>{const i=r.pass.value,e=r.pass2.value;if(r.match.classList.remove("hidden"),!e){r.match.classList.add("hidden"),r.pass2.classList.remove("ring-2","ring-emerald-400","ring-red-400","border-emerald-400/70","border-red-400/70");return}i===e?(r.match.setAttribute("data-i18n","Auth.Password.match_ok"),r.match.className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400",r.pass2.classList.remove("ring-red-400","border-red-400/70"),r.pass2.classList.add("ring-2","ring-emerald-400","border-emerald-400/70")):(r.match.setAttribute("data-i18n","Auth.Password.match_bad"),r.match.className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400",r.pass2.classList.remove("ring-emerald-400","border-emerald-400/70"),r.pass2.classList.add("ring-2","ring-rose-400","border-red-400/70")),m(r.match.parentElement)};r.pass.addEventListener("input",()=>{d(),c()}),r.pass2.addEventListener("input",c),d(),a.addEventListener("submit",i=>{if(i.preventDefault(),r.pass.value!==r.pass2.value){alert("As senhas precisam ser iguais."),r.pass2.focus();return}if(!r.terms.checked){alert("Você precisa aceitar os termos."),r.terms.focus();return}alert("Conta criada com sucesso! (mock)"),window.location.href="/login.html"})}function ie(n=document){var t;const a=n.querySelector("#social-floating");if(!a)return;const s=a.querySelector("#social-toggle"),r=a.querySelector("#social-links"),o=a.querySelector("#social-copy"),l=()=>{a.classList.contains("is-open")||(a.classList.add("is-open"),s==null||s.setAttribute("aria-expanded","true"),r==null||r.setAttribute("aria-hidden","false"),r&&[...r.children].forEach((p,h)=>{p.style.transitionDelay=`${h*35}ms`,p.classList.add("show")}))},d=()=>{a.classList.contains("is-open")&&(a.classList.remove("is-open"),s==null||s.setAttribute("aria-expanded","false"),r==null||r.setAttribute("aria-hidden","true"),r&&[...r.children].forEach(p=>{p.style.transitionDelay="0ms",p.classList.remove("show")}))},c=()=>a.classList.contains("is-open")?d():l();s==null||s.addEventListener("click",c),window.addEventListener("keydown",p=>{p.key==="Escape"&&d()}),document.addEventListener("click",p=>{!a.contains(p.target)&&a.classList.contains("is-open")&&d()}),o&&o.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(location.href),o.classList.add("copied"),setTimeout(()=>o.classList.remove("copied"),1200)}catch{}});const g=window.matchMedia("(min-width: 1024px)"),i=window.matchMedia("(prefers-reduced-motion: reduce)"),e=()=>{if(g.matches){const p=i.matches?0:120;setTimeout(l,p)}else d()};e(),(t=g.addEventListener)==null||t.call(g,"change",e)}function f(n,a){const s=document.querySelector(n);return s?(s.innerHTML=a,s):null}const oe=f("#app-header",j),L=f("#app-footer",G),le=f("#app-social-floating",V),M=f("#app-hero",U);f("#app-truststrip",Z);const H=f("#app-highlights",Y),P=f("#app-map-preview",$),S=f("#app-how",W),T=f("#app-auth-login",Q),F=f("#app-auth-register",J);(async()=>{if(oe){const{initHeaderNav:n}=await E(async()=>{const{initHeaderNav:a}=await import("./header-nav-B-84T4fY.js");return{initHeaderNav:a}},[],import.meta.url);n()}if(L){const{initFooter:n}=await E(async()=>{const{initFooter:a}=await import("./footer-e6RUufaJ.js");return{initFooter:a}},[],import.meta.url);n(L)}})();m(document);q();requestAnimationFrame(()=>{requestAnimationFrame(()=>{M&&X(M),H&&K(H),P&&ee(P),S&&te(S),T&&re(T),F&&se(F),le&&ie(document)})});window.addEventListener("hashchange",()=>m(document));export{E as _,ce as i};
