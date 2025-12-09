(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function n(i){if(i.ep)return;i.ep=!0;const l=a(i);fetch(i.href,l)}})();const At="modulepreload",Rt=function(t,e){return new URL(t,e).href},se={},R=function(e,a,n){let i=Promise.resolve();if(a&&a.length>0){let o=function(r){return Promise.all(r.map(s=>Promise.resolve(s).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};const c=document.getElementsByTagName("link"),p=document.querySelector("meta[property=csp-nonce]"),d=(p==null?void 0:p.nonce)||(p==null?void 0:p.getAttribute("nonce"));i=o(a.map(r=>{if(r=Rt(r,n),r in se)return;se[r]=!0;const s=r.endsWith(".css"),u=s?'[rel="stylesheet"]':"";if(!!n)for(let f=c.length-1;f>=0;f--){const m=c[f];if(m.href===r&&(!s||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${r}"]${u}`))return;const h=document.createElement("link");if(h.rel=s?"stylesheet":At,s||(h.as="script"),h.crossOrigin="",h.href=r,d&&h.setAttribute("nonce",d),document.head.appendChild(h),s)return new Promise((f,m)=>{h.addEventListener("load",f),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${r}`)))})}))}function l(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return i.then(o=>{for(const c of o||[])c.status==="rejected"&&l(c.reason);return e().catch(l)})},Et=`<!-- /src/partials/globals/header.html -->

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
`,Bt=`<!-- /src/partials/globals/footer.html -->
<footer id="footer" class="w-full mt-24">
  <section class="relative max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10">

    <!-- painel -->
    <div class="relative overflow-hidden rounded-[26px] bg-white/80 dark:bg-white/5 backdrop-blur ap-footer-panel">
      <!-- borda gradiente sutil -->
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-[26px] ap-gradient-border"></div>

      <!-- textura suave dentro do painel -->
      <div aria-hidden="true" class="absolute inset-0 ap-soft-noise"></div>

      <!-- faixa luminosa decorativa -->
      <!--<div aria-hidden="true" class="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[72%] h-40 rounded-full ap-glow"></div> -->

      <div class="relative z-10 py-8 sm:py-10 px-6 sm:px-8 lg:px-10">
        <!-- LINHA 1: LOGO (linha única, à esquerda) -->
        <div class="w-full flex items-center justify-start">
          <a href="/" class="inline-flex items-center">
            <img src="home/logo.png" alt="AguaPrev" class="h-10 w-auto select-none" />
          </a>
        </div>

        <!-- LINHA 2: OPÇÕES (grid centralizado) -->
        <nav class="mt-8 w-full">
          <div class="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <!-- Produto -->
            <div>
              <h4 class="text-sm font-semibold text-[#031E21] dark:text-white tracking-wide">Produto</h4>
              <ul class="mt-3 grid gap-2">
                <li><a class="footer-link" href="#app-how"><span>Como funciona</span></a></li>
                <li><a class="footer-link" href="#app-highlights"><span>Recursos</span></a></li>
                <li><a class="footer-link" href="#app-map-preview"><span>Mapa & Forecast</span></a></li>
                <li><a class="footer-link" href="/docs/"><span>Docs</span></a></li>
              </ul>
            </div>
            <!-- Institucional -->
            <div>
              <h4 class="text-sm font-semibold text-[#031E21] dark:text-white tracking-wide">Institucional</h4>
              <ul class="mt-3 grid gap-2">
                <li><a class="footer-link" href="#"><span>Sobre</span></a></li>
                <li><a class="footer-link" href="#"><span>Contato</span></a></li>
              </ul>
            </div>
            <!-- Legal -->
            <div>
              <h4 class="text-sm font-semibold text-[#031E21] dark:text-white tracking-wide">Legal</h4>
              <ul class="mt-3 grid gap-2">
                <li><a class="footer-link" href="#"><span>Termos de uso</span></a></li>
                <li><a class="footer-link" href="#"><span>Privacidade</span></a></li>
                <li><a class="footer-link" href="#"><span>Licenças</span></a></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <!-- COPYRIGHT (central) -->
    <div class="mt-6 py-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-black/5 dark:border-white/10">
      © <span id="footer-year"></span> AguaPrev — Universidade de Brasília
    </div>
  </section>
</footer>

`,Ct=`<!-- /src/partials/globals/social-floating.html -->
<div id="social-floating" class="ap-social" aria-live="polite">
  <!-- pilha de ícones (fica oculta até abrir) -->
  <div class="ap-social__stack" id="social-links" aria-hidden="true">
    <!-- Troque os href pelos perfis reais do AguaPrev -->
    <a class="ap-social__item" href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">
      <!-- LinkedIn -->
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path fill="#0A66C2" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5Z"/>
        <path fill="#0A66C2" d="M.5 8.5h4V24h-4V8.5Zm7.5 0h3.84v2.11h.05c.53-.95 1.85-1.95 3.8-1.95 4.07 0 4.81 2.68 4.81 6.16V24h-4v-6.8c0-1.62-.03-3.7-2.25-3.7-2.25 0-2.59 1.76-2.59 3.58V24h-3.86V8.5Z"/>
      </svg>
    </a>

    <a class="ap-social__item" href="https://twitter.com/" target="_blank" rel="noopener" aria-label="X (Twitter)">
      <!-- X -->
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path fill="#0F1419" d="M18.9 2H22l-6.9 7.9L23.3 22H16L10.9 15.9 5 22H2l7.4-8.5L.9 2h7.4l4.5 5.9L18.9 2Z"/>
      </svg>
    </a>

    <a class="ap-social__item" href="https://t.me/" target="_blank" rel="noopener" aria-label="Telegram">
      <!-- Telegram -->
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path fill="#2AABEE" d="M22.5 3.2 1.8 11.2c-1 .4-.9 1.9.1 2.2l5.3 1.6 1.9 6c.3 1 1.6 1.1 2.1.2l2.8-4.5 5.4 4.4c.9.7 2.2.2 2.4-1l2.9-14.7c.2-1.1-.8-2-1.9-1.6Z"/>
        <path fill="#fff" d="M18.2 7.2 8.7 15.1l-.3 4.1 1.9-3 7.9-9Z"/>
      </svg>
    </a>

    <a class="ap-social__item" href="https://www.reddit.com/" target="_blank" rel="noopener" aria-label="Reddit">
      <!-- Reddit -->
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#FF4500"/>
        <circle cx="8.5" cy="12" r="1.3" fill="#fff"/>
        <circle cx="15.5" cy="12" r="1.3" fill="#fff"/>
        <path stroke="#fff" stroke-width="1.6" stroke-linecap="round" d="M8 15c1.1 1 2.1 1.2 4 .2 2.1 1.1 3.2.9 4-.2"/>
        <circle cx="18.2" cy="8.2" r="1.3" fill="#fff"/>
      </svg>
    </a>

    <a class="ap-social__item" href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp">
      <!-- WhatsApp -->
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path fill="#25D366" d="M20.5 3.5A11 11 0 0 0 3.6 20.4L2 22l1.8-.5a11 11 0 1 0 16.7-18Z"/>
        <path fill="#fff" d="M7.8 17.2c4.3 2.6 7.7 1.8 9.2-1.8.3-.7.1-1.4-.5-1.7l-1.6-.7c-.5-.2-1.1 0-1.4.4l-.4.8c-.2.4-.7.5-1.1.3-1.2-.6-2.1-1.4-2.7-2.6-.2-.4-.1-.9.3-1.1l.8-.4c.4-.2.6-.8.4-1.3L10.1 6c-.3-.6-1-.8-1.7-.5-3.7 1.6-4.4 5-1.8 9.3l1.2 2.4Z"/>
      </svg>
    </a>

    <a class="ap-social__item" href="https://br.pinterest.com/" target="_blank" rel="noopener" aria-label="Pinterest">
      <!-- Pinterest -->
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#E60023"/>
        <path fill="#fff" d="M12.3 7C9.7 7 8 8.6 8 10.9c0 1.2.7 2.1 1.7 2.1.8 0 1.3-.6 1.2-1.4-.1-.9-.5-1.8.1-2.4.4-.4 1.3-.4 1.8.1.7.6 1 1.6 1 2.5 0 2.1-1 3.7-2.6 3.7-.5 0-1-.2-1.4-.6l-.4 1.6-.2.8-.6 2c.5.1 1.1.2 1.7.2 3.7 0 6.1-2.7 6.1-6.3 0-3.3-2.3-5.3-5.1-5.3Z"/>
      </svg>
    </a>

    <a class="ap-social__item" href="https://www.quora.com/" target="_blank" rel="noopener" aria-label="Quora">
      <!-- Quora -->
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#B92B27"/>
        <path fill="#fff" d="M12 6.8c-3 0-5.1 2.1-5.1 5.2s2.1 5.2 5.1 5.2c.9 0 1.7-.2 2.4-.6l1.3 1.8c.3.4.8.6 1.2.3.4-.2.5-.8.2-1.2l-1.1-1.6c1-1 1.5-2.4 1.5-3.9 0-3.1-2.1-5.2-5.5-5.2Zm0 8.6c-2 0-3.4-1.5-3.4-3.4S10 8.6 12 8.6s3.4 1.5 3.4 3.4S14 15.4 12 15.4Z"/>
      </svg>
    </a>

    <a class="ap-social__item" href="https://line.me/" target="_blank" rel="noopener" aria-label="LINE">
      <!-- LINE -->
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#06C755"/>
        <path fill="#fff" d="M7 11.2C7 9 9 7.2 11.7 7.2c2.8 0 4.7 1.8 4.7 4s-1.9 4-4.7 4h-.2l-2.4 1.7c-.3.2-.7 0-.7-.4l.1-1.8C7.7 13.9 7 12.7 7 11.2Z"/>
      </svg>
    </a>

    <!-- Copiar link do site -->
    <button class="ap-social__item" type="button" id="social-copy" aria-label="Copiar link">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path stroke="#111827" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M14 7h3a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3v-3M10 16H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v3"/>
      </svg>
    </button>
  </div>

  <!-- Botão principal (abre/fecha) -->
  <button class="ap-social__fab" id="social-toggle" aria-label="Abrir redes sociais" aria-expanded="false" aria-controls="social-links">
    <!-- ícone share -->
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12M12 3l-4 4M12 3l4 4M6 13v4a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-4"/>
    </svg>
  </button>
</div>
`,_t=`<!-- /src/partials/globals/sidebar.html -->
<aside id="ap-sidebar"
  class="fixed inset-y-0 left-0 z-40 w-72 bg-white/90 dark:bg-[#0C1A2A]/90
         border-r border-black/5 dark:border-white/10 backdrop-blur-xl
         shadow-[0_30px_70px_-30px_rgba(0,0,0,.45)] flex flex-col overflow-hidden">

  <!-- Topo: Branding + Collapse -->
  <div class="flex items-center justify-between px-4 py-4">
    <a href="/index.html" class="inline-flex items-center gap-3">
      <img id="sb-logo-expanded"  src="/home/logo.png"            alt="AguaPrev" class="h-8 w-auto" loading="lazy" decoding="async">
      <img id="sb-logo-collapsed" src="/home/logo_minimalist.png" alt="AguaPrev" class="h-8 w-auto hidden" loading="lazy" decoding="async">
    </a>
    <button id="sb-collapse" class="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Comprimir menu" title="Comprimir menu">
      <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M8 6l-6 6 6 6M16 18l6-6-6-6"/>
      </svg>
    </button>
  </div>

  <!-- Perfil (com overflow fix no colapsado) -->
  <div id="sb-profile" class="px-4 pb-3 min-h-0">
    <div class="sb-profile flex items-center gap-3 rounded-2xl border border-black/5 dark:border-white/10
                bg-white/70 dark:bg-white/5 px-3 py-3 overflow-hidden">
      <!-- Avatar é link pro perfil (acessível sem JS) -->
      <a id="sb-avatar-link" href="/profile.html" class="shrink-0 rounded-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-[#0A5C67]">
        <img id="sb-avatar" alt="Avatar" src="/src/assets/img/avatar-default.png"
             class="h-10 w-10 rounded-xl object-cover" loading="lazy" decoding="async">
      </a>

      <div class="min-w-0 flex-1" data-sb-label>
        <p id="sb-name"  class="truncate text-sm font-semibold text-[#031E21] dark:text-white">Usuário</p>
        <p id="sb-email" class="truncate text-xs text-gray-600 dark:text-gray-300">email@exemplo.com</p>
      </div>

      <!-- Atalho para o perfil -->
      <a id="sb-profile-btn" href="/profile.html" class="ml-auto sb-ctrl" title="Abrir perfil" aria-label="Abrir perfil">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm7 9v-2a7 7 0 0 0-14 0v2"/>
        </svg>
        <span data-sb-label>Perfil</span>
      </a>
    </div>
  </div>

  <!-- Busca -->
  <div class="px-3" data-sb-label>
    <div class="relative">
      <input type="search" placeholder="Buscar…" class="w-full rounded-xl px-10 py-2 text-sm
             bg-white dark:bg-white/10 border border-black/5 dark:border-white/10
             focus:outline-none focus:ring-2 focus:ring-[#0A5C67]">
      <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-3.5-3.5"/>
      </svg>
    </div>
  </div>

  <!-- Navegação -->
  <nav class="px-3 py-3 space-y-1 flex-1 overflow-y-auto">
    <p class="sb-section" data-sb-label>Geral</p>

    <a href="/dashboard.html" class="sb-link" title="Visão geral" data-tooltip="Visão geral">
      <svg viewBox="0 0 24 24" class="sb-ico" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M3 12h7V3H3v9Zm0 9h7v-7H3v7Zm11 0h7v-9h-7v9ZM14 3v7h7V3h-7Z"/>
      </svg>
      <span data-sb-label>Visão geral</span>
    </a>

    <p class="sb-section" data-sb-label>Explorar</p>

    <a href="/maps.html" class="sb-link" title="Mapas" data-tooltip="Mapas">
      <svg viewBox="0 0 24 24" class="sb-ico" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v14M15 6v14"/>
      </svg>
      <span data-sb-label>Mapas</span>
    </a>

    <a href="/series.html" class="sb-link" title="Séries temporais" data-tooltip="Séries temporais">
      <svg viewBox="0 0 24 24" class="sb-ico" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M3 3v18h18"/><path d="M7 13l4-4 3 3 4-5"/>
      </svg>
      <span data-sb-label>Séries</span>
    </a>

    <a href="/compare.html" class="sb-link" title="Comparar bacias" data-tooltip="Comparar bacias">
      <svg viewBox="0 0 24 24" class="sb-ico" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M4 4h6v16H4zM14 8h6v12h-6z"/>
      </svg>
      <span data-sb-label>Comparar</span>
    </a>

    <p class="sb-section" data-sb-label>Operacional</p>

    <a href="/alerts.html" class="sb-link" title="Alertas" data-tooltip="Alertas">
      <svg viewBox="0 0 24 24" class="sb-ico" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M12 9v4"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 17h.01"/>
      </svg>
      <span data-sb-label>Alertas</span>
      <span class="sb-badge" aria-hidden="true">3</span>
    </a>

    <a href="/reports.html" class="sb-link" title="Relatórios" data-tooltip="Relatórios">
      <svg viewBox="0 0 24 24" class="sb-ico" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M7 3h10a2 2 0 0 1 2 2v14l-5-3-5 3V5a2 2 0 0 1 2-2z"/>
      </svg>
      <span data-sb-label>Relatórios</span>
    </a>

    <!-- Tutorial -->
    <a href="/tutorial.html" class="sb-link" title="Tutorial" data-tooltip="Tutorial">
      <svg viewBox="0 0 24 24" class="sb-ico" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M4 19.5V6.5A2.5 2.5 0 0 1 6.5 4H20"/><path d="M6.5 6H20v14H6.5A2.5 2.5 0 0 1 4 17.5"/><path d="M8 10h8M8 14h6"/>
      </svg>
      <span data-sb-label>Tutorial</span>
    </a>
  </nav>

  <!-- Rodapé -->
  <div class="px-3 py-3 border-t border-black/5 dark:border-white/10 space-y-3 relative overflow-visible">

    <!-- Linha 1: Tema + Idioma -->
    <div class="ap-footer-row flex items-center justify-between gap-2">
      <!-- Tema (ícone branco no dark) -->
      <button id="theme-toggle" class="sb-ctrl text-gray-800 dark:text-white" title="Tema" aria-label="Alternar tema">
        <svg id="icon-sun" class="w-4 h-4 hidden dark:inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.54 6.46-1.41-1.41M7.87 7.87 6.46 6.46m0 11.08 1.41-1.41M16.13 7.87l1.41-1.41"/>
        </svg>
        <svg id="icon-moon" class="w-4 h-4 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <span data-sb-label> Tema</span>
      </button>

      <!-- Idioma -->
      <div class="relative overflow-visible flex-1">
        <button id="lang-toggle" class="sb-ctrl w-full justify-between text-gray-800 dark:text-white" aria-haspopup="true" aria-expanded="false" title="Idioma">
          <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15.3 15.3 0 0 0 0 18M12 3a15.3 15.3 0 0 1 0 18"/>
          </svg>
          <span data-sb-label>Idioma</span>
          <strong id="lang-current">PT-BR</strong>
        </button>

        <div id="lang-menu"
             class="sb-dropdown hidden absolute left-0 right-0 bottom-full mb-2 rounded-xl border border-black/10 dark:border-white/10
                    bg-white/95 dark:bg-[#0C1A2A]/95 backdrop-blur-xl shadow-lg overflow-auto max-h-60 z-50">
          <button class="sb-dd-item" data-lang="pt-BR">Português (BR)</button>
          <button class="sb-dd-item" data-lang="en">English</button>
          <button class="sb-dd-item" data-lang="es">Español</button>
        </div>
      </div>
    </div>

    <!-- Conta -->
    <div class="relative">
      <button id="account-toggle" class="sb-ctrl w-full justify-between text-gray-800 dark:text-white" aria-haspopup="true" aria-expanded="false" title="Conta e configurações">
        <svg class="sb-ico-collapsed w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="8" r="4"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/>
        </svg>
        <span class="inline-flex items-center gap-2">
          <img id="sb-mini-avatar" src="/src/assets/img/avatar-default.png" alt="" class="w-5 h-5 rounded-md object-cover hidden sm:inline" loading="lazy" decoding="async">
          <span id="sb-mini-name" data-sb-label>Conta</span>
        </span>
        <svg class="w-4 h-4 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.5 7.5l4.5 4.5 4.5-4.5"/></svg>
      </button>

      <div id="account-menu"
           class="sb-dropdown hidden absolute left-0 right-0 bottom-full mb-2 rounded-xl border border-black/10 dark:border-white/10
                  bg-white/95 dark:bg-[#0C1A2A]/95 backdrop-blur-xl shadow-lg overflow-hidden z-50">
        <button class="sb-dd-item" data-sb-action="profile">Perfil</button>
        <button class="sb-dd-item" data-sb-action="prefs">Preferências</button>
        <button class="sb-dd-item" data-sb-action="shortcuts">Atalhos</button>
        <button class="sb-dd-item" data-sb-action="help">Ajuda & Docs</button>
        <div class="h-px bg-black/10 dark:bg-white/10"></div>
        <button class="sb-dd-item text-red-600 dark:text-red-400" data-sb-action="signout">Sair</button>
      </div>
    </div>
  </div>
</aside>

<!-- Popover flutuante para modo colapsado -->
<div id="sb-popover" class="hidden fixed z-[70] w-[240px] rounded-xl border border-black/10 dark:border-white/10
     bg-white/95 dark:bg-[#0C1A2A]/95 backdrop-blur-xl shadow-2xl overflow-hidden"></div>
`,St=`<!-- /src/partials/home/hero.html -->
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
`,Pt=`<!-- /src/partials/home/trust-strip.html -->
<section id="trust-strip" class="relative z-[1] ap-overlap-up">
  <div class="w-full max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10">
    <div class="ap-card px-6 sm:px-8 py-6 sm:py-7">
      <ul class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
        <li class="flex flex-col">
          <span class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold"
                data-i18n="Trust.data_sources_label">Fontes de dados</span>
          <span class="mt-1 text-lg font-semibold text-[#0A5C67] dark:text-white"
                data-i18n="Trust.data_sources_value">ANA • INMET • Adasa</span>
        </li>
        <li class="flex flex-col">
          <span class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold"
                data-i18n="Trust.update_label">Atualização</span>
          <span class="mt-1 text-lg font-semibold text-[#0A5C67] dark:text-white"
                data-i18n="Trust.update_value">Diária</span>
        </li>
        <li class="flex flex-col">
          <span class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold"
                data-i18n="Trust.validation_label">Validação</span>
          <span class="mt-1 text-lg font-semibold text-[#0A5C67] dark:text-white"
                data-i18n="Trust.validation_value">Modelos revisados</span>
        </li>
      </ul>
    </div>
  </div>
</section>

`,Lt=`<!-- /src/partials/home/highlights-pills.html -->
<section id="highlights" class="w-full">
  <div class="w-full max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10 py-10">
    <!-- items-start evita esticar os cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-start">

      <!-- Pill 1 -->
      <article
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10
               bg-white/60 dark:bg-white/5 backdrop-blur p-5 cursor-pointer
               hover:shadow-lg hover:-translate-y-0.5 transition"
        data-highlight role="button" tabindex="0" aria-expanded="false">
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M19 17V7l-8 4-8-4"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="Highlights.p1_title">Previsão 7/14 dias</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="Highlights.p1_desc">
          Tendências de volume/nível com atualização diária para bacias do DF.
        </p>
        <div data-highlight-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Gráficos por bacia, comparação 7×14 dias e variação diária — mock por enquanto.
        </div>
      </article>

      <!-- Pill 2 -->
      <article
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10
               bg-white/60 dark:bg-white/5 backdrop-blur p-5 cursor-pointer
               hover:shadow-lg hover:-translate-y-0.5 transition"
        data-highlight role="button" tabindex="0" aria-expanded="false">
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01"/><circle cx="12" cy="12" r="9"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="Highlights.p2_title">Alertas inteligentes</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="Highlights.p2_desc">
          Notificações por bacia/região quando limiares críticos são previstos.
        </p>
        <div data-highlight-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Limiar por bacia, simulação e agendamentos de envio (mock).
        </div>
      </article>

      <!-- Pill 3 -->
      <article
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10
               bg-white/60 dark:bg-white/5 backdrop-blur p-5 cursor-pointer
               hover:shadow-lg hover:-translate-y-0.5 transition"
        data-highlight role="button" tabindex="0" aria-expanded="false">
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15l-5-5L5 21"/><path d="M17 21H3V7"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="Highlights.p3_title">Mapas temáticos</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="Highlights.p3_desc">
          Camadas de precipitação, vazão e risco, com filtros por período.
        </p>
        <div data-highlight-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Camadas com opacidade ajustável e paletas amigáveis — mock.
        </div>
      </article>

      <!-- Pill 4 -->
      <article
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10
               bg-white/60 dark:bg-white/5 backdrop-blur p-5 cursor-pointer
               hover:shadow-lg hover:-translate-y-0.5 transition"
        data-highlight role="button" tabindex="0" aria-expanded="false">
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v6H4z"/><path d="M4 14h16v6H4z"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="Highlights.p4_title">API & Export</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="Highlights.p4_desc">
          Acesso programático e downloads para análise externa.
        </p>
        <div data-highlight-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Endpoints REST (mock), export CSV/GeoJSON e chaves rotacionáveis.
        </div>
      </article>

    </div>
  </div>
</section>
`,Mt=`<!-- /src/partials/home/section-map-preview.html -->
<section id="map-preview" class="w-full">
  <div class="w-full max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10 py-10">
    <div class="flex items-end justify-between gap-4 mb-5">
      <div>
        <h2
          class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white"
          data-i18n="Map.title"
        >
          Mapa & Forecast
        </h2>

        <!-- Explicação rápida do que é mostrado -->
        <p
          class="mt-1 text-gray-600 dark:text-gray-300 text-sm"
          data-i18n="Map.subtitle"
        >
          Selecione a região para ver o mapa e a tendência em 7 dias. As linhas
          indicam a variação ao longo da semana; os valores ao lado mostram o
          último ponto disponível.
        </p>
      </div>

      <!-- seletor de região -->
      <div class="relative">
        <button id="region-toggle"
          class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold
                 border border-gray-200 dark:border-white/15 bg-white/70 dark:bg-white/10
                 text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-white/5">
          <span id="region-current" data-i18n="Map.region.df">DF — Geral</span>
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.5 7.5l4.5 4.5 4.5-4.5"/></svg>
        </button>
        <div id="region-menu"
             class="hidden absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-white/15
                    bg-white/95 dark:bg-[#0E1A2B]/95 backdrop-blur-xl shadow-lg overflow-hidden z-10">
          <button class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/10" data-region="DF — Geral" data-i18n="Map.region.df">DF — Geral</button>
          <button class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/10" data-region="Bacia Descoberto" data-i18n="Map.region.desc">Bacia Descoberto</button>
          <button class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/10" data-region="Bacia Paranoá" data-i18n="Map.region.paranoa">Bacia Paranoá</button>
          <button class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/10" data-region="Bacia São Bartolomeu" data-i18n="Map.region.sb">Bacia São Bartolomeu</button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- card do mapa -->
      <div class="lg:col-span-8">
        <div class="rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-white/5 backdrop-blur"
             data-map-card aria-label="Mapa com camadas temáticas">
          <!-- Placeholder visual do mapa (mantém estética enquanto o mapa real não é montado) -->
          <svg viewBox="0 0 1200 700" class="w-full h-[360px] sm:h-[420px]" role="img" aria-label="Mapa da região selecionada">
            <defs>
              <linearGradient id="mp-g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#E6F4F5"/><stop offset="1" stop-color="#ffffff"/>
              </linearGradient>
            </defs>
            <rect width="1200" height="700" fill="url(#mp-g1)"></rect>
            <g opacity="0.25" stroke="#0A5C67" stroke-width="2" fill="none">
              <path d="M100 160 C 300 140, 420 160, 620 210 S 920 300, 1100 240"/>
              <path d="M80 360 C 260 300, 460 360, 660 330 S 920 320, 1120 360"/>
              <path d="M120 520 C 300 500, 520 560, 740 520 S 980 480, 1100 520"/>
            </g>
            <g fill="#0A5C67">
              <circle cx="240" cy="210" r="8"/><circle cx="560" cy="230" r="8"/><circle cx="820" cy="270" r="8"/><circle cx="1020" cy="240" r="8"/>
              <circle cx="380" cy="360" r="8"/><circle cx="680" cy="340" r="8"/><circle cx="940" cy="360" r="8"/><circle cx="520" cy="540" r="8"/>
            </g>
          </svg>
        </div>
        <!-- legenda curta do mapa (opcional) -->
        <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span class="font-medium" data-i18n="Map.legend">Legenda:</span>
          <span data-i18n="Map.legend_text">Linhas indicam iso-curvas e os pontos marcam estações/locais de referência.</span>
        </p>
      </div>

      <!-- card de séries (sparkline + valores) -->
      <div class="lg:col-span-4">
        <div class="rounded-3xl ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5"
             data-series-card>
          <h3 class="font-semibold text-[#031E21] dark:text-white mb-3" data-i18n="Map.series_title">Tendência (7 dias)</h3>

          <div class="space-y-4">
            <!-- item -->
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-24">
                <p class="text-sm text-gray-500 dark:text-gray-400" data-i18n="Map.metric_precip">Precipitação</p>
                <p class="text-base font-semibold text-[#031E21] dark:text-white">
                  <span data-metric="precip">—</span> mm
                </p>
              </div>
              <svg viewBox="0 0 120 30" class="h-8 w-28" aria-hidden="true">
                <polyline fill="none" stroke="currentColor" stroke-width="2"
                  points="0,20 20,18 40,15 60,17 80,10 100,12 120,8"
                  class="text-[#0A5C67] dark:text-[#6BAAC9]"/>
              </svg>
            </div>

            <!-- item -->
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-24">
                <p class="text-sm text-gray-500 dark:text-gray-400" data-i18n="Map.metric_flow">Vazão</p>
                <p class="text-base font-semibold text-[#031E21] dark:text-white">
                  <span data-metric="flow">—</span> m³/s
                </p>
              </div>
              <svg viewBox="0 0 120 30" class="h-8 w-28" aria-hidden="true">
                <polyline fill="none" stroke="currentColor" stroke-width="2"
                  points="0,12 20,15 40,14 60,10 80,12 100,18 120,20"
                  class="text-[#0A5C67] dark:text-[#6BAAC9]"/>
              </svg>
            </div>

            <!-- item -->
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-24">
                <p class="text-sm text-gray-500 dark:text-gray-400" data-i18n="Map.metric_storage">Armazenamento</p>
                <p class="text-base font-semibold text-[#031E21] dark:text-white">
                  <span data-metric="storage">—</span> %
                </p>
              </div>
              <svg viewBox="0 0 120 30" class="h-8 w-28" aria-hidden="true">
                <polyline fill="none" stroke="currentColor" stroke-width="2"
                  points="0,16 20,12 40,10 60,12 80,14 100,12 120,8"
                  class="text-[#0A5C67] dark:text-[#6BAAC9]"/>
              </svg>
            </div>
          </div>

          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400" data-i18n="Map.series_hint">
            As mini-curvas mostram a tendência dos últimos 7 dias; o número ao lado é o valor mais recente.
          </p>

          <a href="/dashboard/"
             class="mt-6 inline-flex items-center justify-center w-full rounded-xl px-4 py-2 font-semibold
                    bg-[#0A5C67] text-white hover:brightness-110"
             data-i18n="Map.cta">Abrir no Dashboard</a>
        </div>
      </div>
    </div>
  </div>
</section>
`,Tt=`<!-- /src/partials/home/section-how-it-works.html -->
<section id="how" class="w-full">
  <div class="w-full max-w-[1358px] mx-auto px-5 sm:px-6 lg:px-10 py-12">
    <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white" data-i18n="How.title">
      Como funciona
    </h2>
    <p class="mt-1 text-gray-600 dark:text-gray-300 text-sm max-w-prose" data-i18n="How.subtitle">
      Pipeline simplificado (mock): coleta diária, processamento por modelos e entrega no dashboard.
    </p>

    <!-- items-start evita esticar; cada card fica com sua própria altura -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">
      <!-- etapa 1 -->
      <article
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5
               cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        data-step>
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18"/><path d="M12 3v18"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="How.s1_title">Coleta</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="How.s1_desc">
          Integra dados ANA, INMET e Adasa; normaliza e valida diariamente.
        </p>
        <div data-step-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Dados são agregados automaticamente, tratados e armazenados antes de processar as previsões.
        </div>
      </article>

      <!-- etapa 2 -->
      <article
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5
               cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        data-step>
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="How.s2_title">Modelagem</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="How.s2_desc">
          Gera previsões 7/14 dias para nível, precipitação e vazão — com métricas de confiança.
        </p>
        <div data-step-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Modelos hidrológicos e ML calibrados para as bacias do DF simulam tendências e incertezas.
        </div>
      </article>

      <!-- etapa 3 -->
      <article
        class="self-start group rounded-3xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5
               cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        data-step>
        <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-white/10 dark:text-white mb-3">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M9 5l7 7-7 7"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="How.s3_title">Entrega</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="How.s3_desc">
          Disponibiliza no dashboard, API e alertas (mock) para gestores e cidadãos.
        </p>
        <div data-step-extra class="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Publicação diária no dashboard do AguaPrev e disparo de alertas programados (mock).
        </div>
      </article>
    </div>
  </div>
</section>
`,Dt=`<!-- /src/partials/auth/login.html -->
<section id="login" class="w-full">
  <div class="w-full max-w-[560px] mx-auto px-5 sm:px-6 lg:px-10">

    <!-- card -->
    <div class="relative overflow-hidden rounded-[20px] bg-white/90 dark:bg-[#0C1A2A]/90 backdrop-blur-sm
                border border-black/5 dark:border-white/10 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)]">

      <!-- gradiente sutil topo -->
      <div aria-hidden="true" class="absolute inset-x-0 -top-24 h-48
                  bg-gradient-to-b from-[#6BAAC9]/25 via-transparent to-transparent pointer-events-none"></div>

      <div class="relative z-10 p-6 sm:p-8">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-[#0A5C67]/15 dark:bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" class="w-5 h-5 text-[#0A5C67] dark:text-white" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 12c2.8 0 5-2.2 5-5S14.8 2 12 2 7 4.2 7 7s2.2 5 5 5ZM4 22c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-extrabold tracking-tight text-[#031E21] dark:text-white" data-i18n="Login.title">Entrar</h1>
            <p class="text-xs text-gray-600 dark:text-gray-300" data-i18n="Login.subtitle">Acesse sua conta para abrir o dashboard.</p>
          </div>
        </div>

        <!-- form -->
        <form id="login-form" class="mt-6 grid gap-4" novalidate>
          <!-- email -->
          <div>
            <label for="login-email" class="block text-sm font-medium mb-1" data-i18n="Login.email_label">E-mail</label>
            <input id="login-email" name="email" type="email" autocomplete="email" required
              class="w-full rounded-xl px-4 py-3 bg-white dark:bg-white/10 border border-black/5 dark:border-white/10
                     outline-none focus:ring-2 focus:ring-[#0A5C67]"
              placeholder="voce@exemplo.com" />
            <p class="mt-1 text-xs text-red-600 hidden" data-error="email"></p>
          </div>

          <!-- senha -->
          <div>
            <label for="login-password" class="block text-sm font-medium mb-1" data-i18n="Login.password_label">Senha</label>
            <div class="relative">
              <input id="login-password" name="password" type="password" autocomplete="current-password" required
                class="w-full rounded-xl px-4 py-3 pr-12 bg-white dark:bg-white/10 border border-black/5 dark:border-white/10
                       outline-none focus:ring-2 focus:ring-[#0A5C67]"
                placeholder="••••••••" />
              <button type="button" id="toggle-pass"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:bg-black/5 dark:hover:bg-white/10"
                      aria-label="Mostrar/ocultar senha">
                <svg id="icon-eye" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg id="icon-eye-off" viewBox="0 0 24 24" class="w-5 h-5 hidden" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3l18 18"/><path d="M10.58 10.58A3 3 0 0 0 9 12c0 1.66 1.34 3 3 3 1.1 0 2.06-.59 2.58-1.47"/>
                  <path d="M16.24 7.76A10.94 10.94 0 0 0 12 5C5 5 1 12 1 12a17.65 17.65 0 0 0 5.1 5.11"/>
                </svg>
              </button>
            </div>
            <p class="mt-1 text-xs text-red-600 hidden" data-error="password"></p>
          </div>

          <!-- remember + forgot -->
          <div class="flex items-center justify-between">
            <label class="inline-flex items-center gap-2 text-sm">
              <input id="login-remember" type="checkbox" class="rounded border-gray-300 text-[#0A5C67] focus:ring-[#0A5C67]" />
              <span data-i18n="Login.remember">Lembrar de mim</span>
            </label>
            <a href="#" class="text-sm text-[#0A5C67] hover:underline decoration-dotted underline-offset-2" data-i18n="Login.forgot">Esqueci a senha</a>
          </div>

          <!-- submit -->
          <button id="login-submit" type="submit"
            class="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold
                   bg-[#0A5C67] text-white hover:brightness-110 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#0A5C67]">
            <span data-i18n="Login.signin">Entrar</span>
            <svg id="login-spinner" class="w-4 h-4 animate-spin hidden" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
            </svg>
          </button>

          <!-- feedback -->
          <p id="login-feedback" class="mt-2 text-sm hidden"></p>
        </form>

        <!-- divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="h-px flex-1 bg-black/10 dark:bg-white/10"></div>
          <span class="text-xs text-gray-500 dark:text-gray-400" data-i18n="Login.or">ou</span>
          <div class="h-px flex-1 bg-black/10 dark:bg-white/10"></div>
        </div>

        <!-- social mock -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button class="rounded-xl border border-black/5 dark:border-white/10 py-2.5 hover:bg-black/5 dark:hover:bg-white/10">
            <span class="text-sm" data-i18n="Login.google">Continuar com Google</span>
          </button>
          <button class="rounded-xl border border-black/5 dark:border-white/10 py-2.5 hover:bg-black/5 dark:hover:bg-white/10">
            <span class="text-sm" data-i18n="Login.github">Continuar com GitHub</span>
          </button>
        </div>

        <!-- register -->
        <p class="mt-6 text-sm text-gray-600 dark:text-gray-300">
          <span data-i18n="Login.no_account">Ainda não tem conta?</span>
          <a href="/signup.html" class="text-[#0A5C67] hover:underline decoration-dotted underline-offset-2" data-i18n="Login.create">Criar conta</a>
        </p>
      </div>
    </div>
  </div>
</section>
`,It=`<!-- /src/partials/auth/register.html -->
<section class="w-full">
  <div class="w-full max-w-[740px] mx-auto px-5 sm:px-6 lg:px-10 py-10">
    <header class="mb-6 text-center">
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white"
          data-i18n="Auth.Register.title">Criar conta</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-300"
         data-i18n="Auth.Register.subtitle">Preencha os dados para acessar o AguaPrev.</p>
    </header>

    <form id="ap-register-form"
          class="ap-card p-6 sm:p-7 rounded-2xl bg-white/85 dark:bg-white/[.06] backdrop-blur"
          autocomplete="on" novalidate>

      <!-- Nome completo -->
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
             for="ap-fullname" data-i18n="Auth.Register.fullname_label">Nome completo</label>
      <input id="ap-fullname" name="fullname" type="text" required
             autocomplete="name"
             class="w-full rounded-xl border border-gray-200/80 dark:border-white/15 bg-white/80 dark:bg-white/5
                    px-4 py-3 outline-none focus:ring-2 focus:ring-[#0A5C67]/40 transition"
             placeholder="Ex.: Maria Oliveira" />

      <!-- E-mail -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
               for="ap-email" data-i18n="Auth.Register.email_label">E-mail</label>
        <input id="ap-email" name="email" type="email" required
               autocomplete="email"
               class="w-full rounded-xl border border-gray-200/80 dark:border-white/15 bg-white/80 dark:bg-white/5
                      px-4 py-3 outline-none focus:ring-2 focus:ring-[#0A5C67]/40 transition"
               placeholder="voce@exemplo.com" />
      </div>

      <!-- Senha -->
      <div class="mt-4">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                 for="ap-pass" data-i18n="Auth.Register.password_label">Senha</label>

          <!-- Mostrar/Ocultar -->
          <button type="button" id="toggle-pass"
                  class="group relative inline-flex items-center gap-1 text-xs font-medium
                         text-[#0A5C67] dark:text-[#6BAAC9]
                         hover:text-[#074750] dark:hover:text-[#9DD3E4]
                         focus:outline-none focus:ring-2 focus:ring-[#0A5C67]/40
                         rounded-md px-1.5 py-0.5 transition">
            <svg class="w-4 h-4 opacity-80 group-hover:opacity-100 transition"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span data-i18n="Auth.toggle_show">Mostrar</span>
          </button>
        </div>

        <input id="ap-pass" name="password" type="password" required minlength="8"
               autocomplete="new-password"
               class="mt-1 w-full rounded-xl border border-gray-200/80 dark:border-white/15 bg-white/80 dark:bg-white/5
                      px-4 py-3 outline-none focus:ring-2 focus:ring-[#0A5C67]/40 transition"
               placeholder="Mínimo 8 caracteres" aria-describedby="ap-pass-strength-label" />

        <!-- Barra de força da senha -->
        <div class="mt-3" aria-live="polite">
          <div class="w-full h-2 rounded-full bg-gray-200/70 dark:bg-white/10 overflow-hidden">
            <div id="ap-pass-strength-bar"
                 class="h-2 w-0 rounded-full transition-all duration-300 ease-out"></div>
          </div>
          <div class="mt-2 flex items-center justify-between text-xs">
            <span id="ap-pass-strength-label"
                  class="font-medium text-gray-600 dark:text-gray-300"
                  data-i18n="Auth.Password.strength_unknown">Força da senha</span>
            <span class="text-[11px] text-gray-500 dark:text-gray-400"
                  data-i18n="Auth.Password.hint">Use letras maiúsculas/minúsculas, números e símbolos.</span>
          </div>
        </div>
      </div>

      <!-- Confirmar senha -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
               for="ap-pass2" data-i18n="Auth.Register.password2_label">Confirmar senha</label>
        <input id="ap-pass2" name="password2" type="password" required minlength="8"
               autocomplete="new-password"
               class="w-full rounded-xl border border-gray-200/80 dark:border-white/15 bg-white/80 dark:bg-white/5
                      px-4 py-3 outline-none focus:ring-2 transition"
               placeholder="Repita a senha" />
        <p id="ap-pass-match"
           class="mt-2 text-xs font-medium hidden"
           aria-live="polite">
          <!-- Mensagem preenchida via JS + i18n -->
        </p>
      </div>

      <!-- Termos -->
      <label class="mt-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 select-none">
        <input id="ap-terms" type="checkbox" required class="rounded border-gray-300 dark:border-white/20
               text-[#0A5C67] focus:ring-[#0A5C67]/40">
        <span data-i18n="Auth.Register.terms">Aceito os termos de uso e a política de privacidade</span>
      </label>

      <!-- Ações -->
      <div class="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button type="submit"
                class="inline-flex justify-center items-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold
                       bg-[#0A5C67] text-white shadow hover:brightness-110 focus:outline-none
                       focus:ring-2 focus:ring-offset-2 focus:ring-[#0A5C67] dark:focus:ring-offset-[#0E1A2B]"
                data-i18n="Auth.Register.cta">Criar conta</button>

        <p class="text-sm text-gray-600 dark:text-gray-300">
          <span data-i18n="Auth.Register.have_account">Já tem conta?</span>
          <a class="ml-1 underline decoration-dotted decoration-1 underline-offset-2 text-[#0A5C67] dark:text-[#9DD3E4] hover:opacity-90"
             href="/login.html" data-i18n="Auth.Register.login_link">Entrar</a>
        </p>
      </div>
    </form>
  </div>
</section>
`,ie=`<!-- Séries Temporais (partial) -->\r
<section class="w-full">\r
  <!-- HERO -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10">\r
    <div class="flex items-start justify-between gap-4 flex-col md:flex-row">\r
      <div>\r
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white" data-i18n="Series.title">\r
          Séries temporais\r
        </h1>\r
        <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300" data-i18n="Series.subtitle">\r
          Explore séries de chuva, nível de reservatórios e outros indicadores hídricos.\r
        </p>\r
      </div>\r
      <div class="flex items-center gap-2 mt-4 md:mt-0">\r
        <button id="btn-refresh" class="btn-aguaprev" data-i18n="Common.refresh">Atualizar</button>\r
        <button id="btn-export-png" class="btn-aguaprev-outline" data-i18n="Common.export_png">Exportar PNG</button>\r
        <button id="btn-export-csv" class="btn-aguaprev-outline" data-i18n="Common.export_csv">Exportar CSV</button>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- CONTEÚDO -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 pb-12" id="series-root">\r
    <!-- FILTROS -->\r
    <div class="series-filters">\r
      <div class="filters-row">\r
        <label class="f-item">\r
          <span data-i18n="Filters.basin">Bacia</span>\r
          <select id="f-basin" class="f-select">\r
            <option value="descoberto">Descoberto</option>\r
            <option value="santamaria">Santa Maria</option>\r
            <option value="corumba">Corumbá</option>\r
          </select>\r
        </label>\r
\r
        <label class="f-item">\r
          <span data-i18n="Filters.station">Estação/Reservatório</span>\r
          <select id="f-station" class="f-select">\r
            <option value="reservatorio_a">Reservatório A</option>\r
            <option value="reservatorio_b">Reservatório B</option>\r
            <option value="posto_pluviometro">Pluviômetro</option>\r
          </select>\r
        </label>\r
\r
        <label class="f-item">\r
          <span data-i18n="Filters.variable">Variável</span>\r
          <select id="f-variable" class="f-select">\r
            <option value="chuva">Chuva (mm)</option>\r
            <option value="nivel">Nível (m)</option>\r
            <option value="vazao">Vazão (m³/s)</option>\r
          </select>\r
        </label>\r
\r
        <label class="f-item">\r
          <span data-i18n="Filters.resolution">Resolução</span>\r
          <select id="f-resolution" class="f-select">\r
            <option value="D">Diária</option>\r
            <option value="W">Semanal</option>\r
            <option value="M">Mensal</option>\r
          </select>\r
        </label>\r
\r
        <label class="f-item">\r
          <span data-i18n="Filters.from">De</span>\r
          <input id="f-from" type="date" class="f-input" />\r
        </label>\r
\r
        <label class="f-item">\r
          <span data-i18n="Filters.to">Até</span>\r
          <input id="f-to" type="date" class="f-input" />\r
        </label>\r
      </div>\r
\r
      <button id="btn-toggle-filters" class="filters-toggle md:hidden mt-3">Mostrar/ocultar filtros</button>\r
    </div>\r
\r
    <!-- KPIs -->\r
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">\r
      <div class="kpi-card"><p class="kpi-label" data-i18n="Kpi.points">Pontos</p><p id="kpi-points" class="kpi-value">—</p></div>\r
      <div class="kpi-card"><p class="kpi-label" data-i18n="Kpi.min">Mín</p><p id="kpi-min" class="kpi-value">—</p></div>\r
      <div class="kpi-card"><p class="kpi-label" data-i18n="Kpi.max">Máx</p><p id="kpi-max" class="kpi-value">—</p></div>\r
      <div class="kpi-card"><p class="kpi-label" data-i18n="Kpi.last">Último</p><p id="kpi-last" class="kpi-value">—</p></div>\r
    </div>\r
\r
    <!-- GRÁFICO -->\r
    <div class="chart-wrapper mt-6">\r
      <canvas id="series-chart" class="series-canvas" height="340" aria-label="Gráfico de série temporal"></canvas>\r
    </div>\r
\r
    <!-- TABELA -->\r
    <div class="mt-8 bg-white/70 dark:bg-white/5 backdrop-blur rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">\r
      <div class="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">\r
        <h2 class="text-lg font-semibold text-[#031E21] dark:text-white" data-i18n="Series.table_title">Observações</h2>\r
        <div class="text-sm text-gray-500 dark:text-gray-400"><span id="tbl-range">—</span></div>\r
      </div>\r
      <div class="overflow-x-auto">\r
        <table class="min-w-full text-sm">\r
          <thead class="bg-gray-50 dark:bg-white/5">\r
            <tr class="text-left">\r
              <th class="th-cell" data-i18n="Table.date">Data</th>\r
              <th class="th-cell" data-i18n="Table.value">Valor</th>\r
            </tr>\r
          </thead>\r
          <tbody id="tbl-body" class="divide-y divide-gray-100 dark:divide-white/10"></tbody>\r
        </table>\r
      </div>\r
      <div class="flex items-center justify-between px-4 py-3">\r
        <div class="text-xs text-gray-500 dark:text-gray-400" id="tbl-status">—</div>\r
        <div class="flex items-center gap-2">\r
          <button id="pg-prev" class="pg-btn" disabled>«</button>\r
          <span id="pg-info" class="text-xs">1/1</span>\r
          <button id="pg-next" class="pg-btn" disabled>»</button>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>\r
`,oe=`<!-- Mapas (partial) -->\r
<section class="w-full" id="maps-partial">\r
  <!-- Header -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10">\r
    <div class="flex items-start justify-between gap-4 flex-col md:flex-row">\r
      <div>\r
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white" data-i18n="Map.title">\r
          Mapa & Forecast\r
        </h1>\r
        <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300" data-i18n="Map.subtitle">\r
          Selecione a região para ver o mapa e a tendência em 7 dias. As linhas indicam a variação; os valores mostram a última leitura.\r
        </p>\r
      </div>\r
      <div class="flex items-center gap-2 mt-4 md:mt-0">\r
        <button id="map-refresh" class="btn-aguaprev" data-i18n="Common.refresh">Atualizar</button>\r
        <button id="map-export-png" class="btn-aguaprev-outline" data-i18n="Common.export_png">Exportar PNG</button>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Filtros -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 pb-4">\r
    <form id="map-filters" class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end">\r
      <label class="md:col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
        <span data-i18n="Filters.basin">Bacia</span>\r
        <select id="mf-basin" class="f-select mt-1">\r
          <option value="df" data-i18n="Map.region.df">DF — Geral</option>\r
          <option value="descoberto" data-i18n="Map.region.desc">Bacia Descoberto</option>\r
          <option value="paranoa" data-i18n="Map.region.paranoa">Bacia Paranoá</option>\r
          <option value="sb" data-i18n="Map.region.sb">Bacia São Bartolomeu</option>\r
        </select>\r
      </label>\r
\r
      <label class="md:col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
        <span data-i18n="Filters.variable">Variável</span>\r
        <select id="mf-layer" class="f-select mt-1">\r
          <option value="precip" data-i18n="Map.metric_precip">Precipitação</option>\r
          <option value="flow" data-i18n="Map.metric_flow">Vazão</option>\r
          <option value="storage" data-i18n="Map.metric_storage">Armazenamento</option>\r
        </select>\r
      </label>\r
\r
      <label class="md:col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
        <span data-i18n="Filters.from">De</span>\r
        <input id="mf-from" type="date" class="f-input mt-1" />\r
      </label>\r
\r
      <label class="md:col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
        <span data-i18n="Filters.to">Até</span>\r
        <input id="mf-to" type="date" class="f-input mt-1" />\r
      </label>\r
    </form>\r
  </div>\r
\r
  <!-- Mapa + legenda + série compacta -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 pb-12" id="maps-root">\r
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">\r
      <!-- Mapa -->\r
      <article class="lg:col-span-8 rounded-3xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 backdrop-blur overflow-hidden">\r
        <div class="h-[520px] w-full" id="map-container" aria-label="Mapa principal"></div>\r
      </article>\r
\r
      <!-- Painel lateral -->\r
      <aside class="lg:col-span-4 space-y-4">\r
        <div class="rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-4">\r
          <h2 class="font-semibold text-[#031E21] dark:text-white mb-2" data-i18n="Map.legend">Legenda:</h2>\r
          <p class="text-xs text-gray-600 dark:text-gray-300" data-i18n="Map.legend_text">\r
            Linhas indicam iso-curvas e os pontos marcam estações/locais de referência.\r
          </p>\r
          <ul class="mt-3 space-y-1 text-sm">\r
            <li><input type="checkbox" id="lg-stations" class="align-middle mr-2" checked /> Estações</li>\r
            <li><input type="checkbox" id="lg-iso" class="align-middle mr-2" checked /> Iso-curvas</li>\r
            <li><input type="checkbox" id="lg-heat" class="align-middle mr-2" /> Heatmap</li>\r
          </ul>\r
        </div>\r
\r
        <div class="rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-4">\r
          <h3 class="font-semibold text-[#031E21] dark:text-white mb-3" data-i18n="Map.series_title">Tendência (7 dias)</h3>\r
          <canvas id="map-sparkline" height="120" aria-label="Série curta"></canvas>\r
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-300" data-i18n="Map.series_hint">\r
            As mini-curvas mostram a tendência de 7 dias; o número ao lado é o valor mais recente.\r
          </p>\r
          <div id="map-last-value" class="mt-2 text-sm font-semibold">—</div>\r
        </div>\r
\r
        <a href="/dashboard.html" class="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-[#0A5C67] text-white text-sm font-semibold hover:brightness-110" data-i18n="Map.cta">\r
          Abrir no Dashboard\r
        </a>\r
      </aside>\r
    </div>\r
  </div>\r
</section>\r
`,le=`<!-- Comparar (partial) -->\r
<section class="w-full" id="compare-partial">\r
  <!-- Header -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10">\r
    <div class="flex items-start justify-between gap-4 flex-col md:flex-row">\r
      <div>\r
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white">\r
          Comparar séries\r
        </h1>\r
        <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">\r
          Compare duas séries por bacia/estação/variável em períodos distintos.\r
        </p>\r
      </div>\r
      <div class="flex items-center gap-2 mt-4 md:mt-0">\r
        <button id="cmp-refresh" class="btn-aguaprev">Atualizar</button>\r
        <button id="cmp-export-png" class="btn-aguaprev-outline">Exportar PNG</button>\r
        <button id="cmp-export-csv" class="btn-aguaprev-outline">Exportar CSV</button>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Filtros A/B -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 pb-4">\r
    <form id="cmp-filters" class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">\r
      <!-- Bloco A -->\r
      <fieldset class="lg:col-span-6 rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 p-4">\r
        <legend class="text-xs font-semibold text-gray-500 dark:text-gray-400 px-1">Série A</legend>\r
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">\r
          <label class="md:col-span-4 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
            Bacia\r
            <select id="a-basin" class="f-select mt-1">\r
              <option value="descoberto">Descoberto</option>\r
              <option value="paranoa">Paranoá</option>\r
              <option value="sb">São Bartolomeu</option>\r
            </select>\r
          </label>\r
          <label class="md:col-span-4 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
            Estação\r
            <select id="a-station" class="f-select mt-1">\r
              <option value="est_a">Estação A</option>\r
              <option value="est_b">Estação B</option>\r
              <option value="est_c">Estação C</option>\r
            </select>\r
          </label>\r
          <label class="md:col-span-4 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
            Variável\r
            <select id="a-var" class="f-select mt-1">\r
              <option value="chuva">Chuva (mm)</option>\r
              <option value="nivel">Nível (m)</option>\r
              <option value="vazao">Vazão (m³/s)</option>\r
            </select>\r
          </label>\r
          <label class="md:col-span-6 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
            De\r
            <input id="a-from" type="date" class="f-input mt-1" />\r
          </label>\r
          <label class="md:col-span-6 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
            Até\r
            <input id="a-to" type="date" class="f-input mt-1" />\r
          </label>\r
        </div>\r
      </fieldset>\r
\r
      <!-- Bloco B -->\r
      <fieldset class="lg:col-span-6 rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 p-4">\r
        <legend class="text-xs font-semibold text-gray-500 dark:text-gray-400 px-1">Série B</legend>\r
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">\r
          <label class="md:col-span-4 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
            Bacia\r
            <select id="b-basin" class="f-select mt-1">\r
              <option value="descoberto">Descoberto</option>\r
              <option value="paranoa">Paranoá</option>\r
              <option value="sb">São Bartolomeu</option>\r
            </select>\r
          </label>\r
          <label class="md:col-span-4 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
            Estação\r
            <select id="b-station" class="f-select mt-1">\r
              <option value="est_a">Estação A</option>\r
              <option value="est_b">Estação B</option>\r
              <option value="est_c">Estação C</option>\r
            </select>\r
          </label>\r
          <label class="md:col-span-4 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
            Variável\r
            <select id="b-var" class="f-select mt-1">\r
              <option value="chuva">Chuva (mm)</option>\r
              <option value="nivel">Nível (m)</option>\r
              <option value="vazao">Vazão (m³/s)</option>\r
            </select>\r
          </label>\r
          <label class="md:col-span-6 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
            De\r
            <input id="b-from" type="date" class="f-input mt-1" />\r
          </label>\r
          <label class="md:col-span-6 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
            Até\r
            <input id="b-to" type="date" class="f-input mt-1" />\r
          </label>\r
        </div>\r
      </fieldset>\r
    </form>\r
  </div>\r
\r
  <!-- KPIs e gráficos -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 pb-12" id="compare-root">\r
    <!-- KPIs -->\r
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">\r
      <div class="kpi-card"><p class="kpi-label">Média A</p><p id="kpi-a-mean" class="kpi-value">—</p></div>\r
      <div class="kpi-card"><p class="kpi-label">Média B</p><p id="kpi-b-mean" class="kpi-value">—</p></div>\r
      <div class="kpi-card"><p class="kpi-label">Δ Absoluto</p><p id="kpi-diff-abs" class="kpi-value">—</p></div>\r
      <div class="kpi-card"><p class="kpi-label">Δ %</p><p id="kpi-diff-pct" class="kpi-value">—</p></div>\r
    </div>\r
\r
    <!-- Gráficos lado a lado -->\r
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">\r
      <article class="lg:col-span-6 rounded-3xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-5">\r
        <h2 class="font-semibold mb-3">Série A</h2>\r
        <canvas id="cmp-chart-a" height="220" aria-label="Gráfico série A"></canvas>\r
      </article>\r
\r
      <article class="lg:col-span-6 rounded-3xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-5">\r
        <h2 class="font-semibold mb-3">Série B</h2>\r
        <canvas id="cmp-chart-b" height="220" aria-label="Gráfico série B"></canvas>\r
      </article>\r
\r
      <article class="lg:col-span-12 rounded-3xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-5">\r
        <h2 class="font-semibold mb-3">Séries sobrepostas</h2>\r
        <canvas id="cmp-chart-overlay" height="260" aria-label="Gráfico comparativo"></canvas>\r
      </article>\r
    </div>\r
  </div>\r
</section>\r
`,de=`<!-- Alertas (partial) -->\r
<section class="w-full" id="alerts-partial">\r
  <!-- Header -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10">\r
    <div class="flex items-start justify-between gap-4 flex-col md:flex-row">\r
      <div>\r
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white" data-i18n="Sidebar.alerts">\r
          Alertas\r
        </h1>\r
        <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">\r
          Monitoramento de limiares críticos por bacia, estação e variável. Filtre, reconheça e exporte.\r
        </p>\r
      </div>\r
      <div class="flex items-center gap-2 mt-4 md:mt-0">\r
        <button id="al-refresh" class="btn-aguaprev">Atualizar</button>\r
        <button id="al-export-csv" class="btn-aguaprev-outline">Exportar CSV</button>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Filtros -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10">\r
    <form id="alerts-filters" class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end">\r
      <label class="md:col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
        Bacia\r
        <select id="al-basin" class="f-select mt-1">\r
          <option value="">Todas</option>\r
          <option value="descoberto">Descoberto</option>\r
          <option value="paranoa">Paranoá</option>\r
          <option value="sb">São Bartolomeu</option>\r
        </select>\r
      </label>\r
\r
      <label class="md:col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
        Variável\r
        <select id="al-var" class="f-select mt-1">\r
          <option value="">Todas</option>\r
          <option value="precip">Precipitação</option>\r
          <option value="flow">Vazão</option>\r
          <option value="storage">Armazenamento</option>\r
        </select>\r
      </label>\r
\r
      <label class="md:col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
        Severidade\r
        <select id="al-sev" class="f-select mt-1">\r
          <option value="">Todas</option>\r
          <option value="critical">Crítico</option>\r
          <option value="high">Alto</option>\r
          <option value="medium">Médio</option>\r
          <option value="low">Baixo</option>\r
        </select>\r
      </label>\r
\r
      <label class="md:col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-300">\r
        Status\r
        <select id="al-status" class="f-select mt-1">\r
          <option value="">Todos</option>\r
          <option value="new">Novo</option>\r
          <option value="ack">Reconhecido</option>\r
          <option value="closed">Encerrado</option>\r
        </select>\r
      </label>\r
    </form>\r
  </div>\r
\r
  <!-- Lista de alertas -->\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 pb-12" id="alerts-root">\r
    <!-- KPIs -->\r
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">\r
      <div class="kpi-card"><p class="kpi-label">Total</p><p id="al-kpi-total" class="kpi-value">—</p></div>\r
      <div class="kpi-card"><p class="kpi-label">Críticos</p><p id="al-kpi-critical" class="kpi-value">—</p></div>\r
      <div class="kpi-card"><p class="kpi-label">Abertos</p><p id="al-kpi-open" class="kpi-value">—</p></div>\r
      <div class="kpi-card"><p class="kpi-label">Reconhecidos</p><p id="al-kpi-ack" class="kpi-value">—</p></div>\r
    </div>\r
\r
    <!-- Tabela -->\r
    <div class="bg-white/70 dark:bg-white/5 backdrop-blur rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">\r
      <div class="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">\r
        <h2 class="text-lg font-semibold text-[#031E21] dark:text-white">Alertas recentes</h2>\r
        <div class="flex items-center gap-2 text-xs">\r
          <label class="inline-flex items-center gap-1"><input id="al-only-open" type="checkbox" /> Somente abertos</label>\r
          <label class="inline-flex items-center gap-1"><input id="al-only-new" type="checkbox" /> Somente novos</label>\r
        </div>\r
      </div>\r
\r
      <div class="overflow-x-auto">\r
        <table class="min-w-full text-sm">\r
          <thead class="bg-gray-50 dark:bg-white/5">\r
            <tr class="text-left">\r
              <th class="th-cell">Quando</th>\r
              <th class="th-cell">Bacia</th>\r
              <th class="th-cell">Local</th>\r
              <th class="th-cell">Variável</th>\r
              <th class="th-cell">Severidade</th>\r
              <th class="th-cell">Mensagem</th>\r
              <th class="th-cell text-right">Ações</th>\r
            </tr>\r
          </thead>\r
          <tbody id="al-tbody" class="divide-y divide-gray-100 dark:divide-white/10"></tbody>\r
        </table>\r
      </div>\r
\r
      <div class="flex items-center justify-between px-4 py-3">\r
        <div class="text-xs text-gray-500 dark:text-gray-400" id="al-status-text">—</div>\r
        <div class="flex items-center gap-2">\r
          <button id="al-prev" class="pg-btn" disabled>«</button>\r
          <span id="al-page" class="text-xs">1/1</span>\r
          <button id="al-next" class="pg-btn" disabled>»</button>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>\r
`,ce=`<!-- Relatórios (partial melhorado) -->\r
<section id="reports-root" class="w-full">\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10">\r
\r
    <!-- Título + ações -->\r
    <div class="flex items-start justify-between gap-4 flex-col md:flex-row">\r
      <div>\r
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white">\r
          Relatórios\r
        </h1>\r
        <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">\r
          Gere relatórios por bacia, variável e período. Use um <em>modelo pronto</em> ou personalize.\r
        </p>\r
      </div>\r
\r
      <div class="flex items-center gap-2 mt-4 md:mt-0">\r
        <select id="rep-preset" class="btn-select">\r
          <option value="">Modelo: escolher…</option>\r
          <option value="df_daily_overview">Resumo diário — DF</option>\r
          <option value="desc_precip_30d">Chuva (30 dias) — Descoberto</option>\r
          <option value="reserv_monthly_level">Reservatórios — nível mensal</option>\r
        </select>\r
        <button id="rep-generate" class="btn-aguaprev">Gerar</button>\r
        <button id="rep-export-csv" class="btn-aguaprev-outline">Exportar CSV</button>\r
        <button id="rep-print" class="btn-aguaprev-outline">Imprimir/PDF</button>\r
      </div>\r
    </div>\r
\r
    <!-- FILTROS -->\r
    <div id="rep-sections" class="mt-6 space-y-4">\r
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">\r
        <!-- Bacia -->\r
        <label class="md:col-span-3 f-item">\r
          <span class="f-label">Bacia</span>\r
          <select id="rep-basin" class="f-select">\r
            <option>DF — Geral</option>\r
            <option>Descoberto</option>\r
            <option>Paranoá</option>\r
            <option>São Bartolomeu</option>\r
          </select>\r
        </label>\r
\r
        <!-- Variável -->\r
        <label class="md:col-span-3 f-item">\r
          <span class="f-label">Variável</span>\r
          <select id="rep-var" class="f-select">\r
            <option>Precipitação (mm)</option>\r
            <option>Nível (m)</option>\r
            <option selected>Vazão (m³/s)</option>\r
            <option>Armazenamento (%)</option>\r
          </select>\r
        </label>\r
\r
        <!-- Agregação -->\r
        <label class="md:col-span-2 f-item">\r
          <span class="f-label">Agregação</span>\r
          <select id="rep-agg" class="f-select">\r
            <option value="D">Diária</option>\r
            <option value="W">Semanal</option>\r
            <option value="M">Mensal</option>\r
          </select>\r
        </label>\r
\r
        <!-- Data de -->\r
        <label class="md:col-span-2 f-item">\r
          <span class="f-label">De</span>\r
          <input id="rep-from" type="date" class="f-input" />\r
        </label>\r
\r
        <!-- Data até -->\r
        <label class="md:col-span-2 f-item">\r
          <span class="f-label">Até</span>\r
          <input id="rep-to" type="date" class="f-input" />\r
        </label>\r
      </div>\r
\r
      <!-- Períodos rápidos -->\r
      <div class="flex flex-wrap items-center gap-2">\r
        <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">Período rápido:</span>\r
        <button class="chip" data-range="7d">Últimos 7d</button>\r
        <button class="chip" data-range="30d">Últimos 30d</button>\r
        <button class="chip" data-range="90d">Últimos 90d</button>\r
        <button class="chip" data-range="ytd">Ano atual</button>\r
      </div>\r
\r
      <!-- KPIs -->\r
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">\r
        <div class="kpi-card">\r
          <p class="kpi-label">Observações</p>\r
          <p id="rep-kpi-points" class="kpi-value">—</p>\r
        </div>\r
        <div class="kpi-card">\r
          <p class="kpi-label">Média</p>\r
          <p id="rep-kpi-mean" class="kpi-value">—</p>\r
        </div>\r
        <div class="kpi-card">\r
          <p class="kpi-label">Mín</p>\r
          <p id="rep-kpi-min" class="kpi-value">—</p>\r
        </div>\r
        <div class="kpi-card">\r
          <p class="kpi-label">Máx</p>\r
          <p id="rep-kpi-max" class="kpi-value">—</p>\r
        </div>\r
      </div>\r
\r
      <!-- Resumo + Achados + Distribuição -->\r
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">\r
        <div class="lg:col-span-6 card">\r
          <p class="card-title">Resumo descritivo</p>\r
          <div id="rep-summary" class="text-sm text-gray-700 dark:text-gray-200">—</div>\r
        </div>\r
\r
        <div class="lg:col-span-6 card">\r
          <p class="card-title">Achados principais</p>\r
          <ul id="rep-findings" class="text-sm list-disc pl-5 space-y-1">\r
            <li class="text-gray-500 dark:text-gray-400">—</li>\r
          </ul>\r
        </div>\r
\r
        <div class="lg:col-span-12 card">\r
          <p class="card-title">Distribuição</p>\r
          <div id="rep-distribution" class="text-sm">—</div>\r
        </div>\r
      </div>\r
\r
      <!-- Tabela -->\r
      <div class="card overflow-hidden">\r
        <div class="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">\r
          <p class="text-sm font-semibold text-[#031E21] dark:text-white">Tabela de observações</p>\r
          <div class="text-xs text-gray-500 dark:text-gray-400">\r
            <span id="rep-status">—</span>\r
          </div>\r
        </div>\r
\r
        <div class="overflow-x-auto">\r
          <table class="min-w-full text-sm">\r
            <thead class="bg-gray-50 dark:bg-white/5">\r
              <tr class="text-left">\r
                <th class="th-cell">Data</th>\r
                <th class="th-cell">Valor</th>\r
                <th class="th-cell">Spark</th>\r
              </tr>\r
            </thead>\r
            <tbody id="rep-tbody" class="divide-y divide-gray-100 dark:divide-white/10"></tbody>\r
          </table>\r
        </div>\r
\r
        <div class="flex items-center justify-between px-4 py-3">\r
          <div class="text-xs text-gray-500 dark:text-gray-400">\r
            <span id="rep-page">1/1</span>\r
          </div>\r
          <div class="flex items-center gap-2">\r
            <button id="rep-prev" class="pg-btn" disabled>«</button>\r
            <button id="rep-next" class="pg-btn" disabled>»</button>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- EXEMPLOS RÁPIDOS -->\r
    <div class="mt-10">\r
      <p class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Exemplos prontos</p>\r
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">\r
        <button class="preset-card" data-preset="df_daily_overview">\r
          <span class="preset-title">Resumo diário — DF</span>\r
          <span class="preset-desc">Visão geral dos indicadores no DF (últimos 7 dias)</span>\r
        </button>\r
        <button class="preset-card" data-preset="desc_precip_30d">\r
          <span class="preset-title">Chuva (30 dias) — Descoberto</span>\r
          <span class="preset-desc">Precipitação diária com distribuição e extremos</span>\r
        </button>\r
        <button class="preset-card" data-preset="reserv_monthly_level">\r
          <span class="preset-title">Reservatórios — nível mensal</span>\r
          <span class="preset-desc">Armazenamento (%) agregado por mês no ano atual</span>\r
        </button>\r
      </div>\r
    </div>\r
  </div>\r
</section>\r
`,pe=`<!-- Tutorial - Em breve -->\r
<section class="w-full" data-page-tutorial>\r
  <div class="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10">\r
    <!-- Header -->\r
    <header class="mb-6">\r
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white">\r
        Tutorial\r
      </h1>\r
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">\r
        Guia rápido para usar o AguaPrev. Conteúdo detalhado chegando em breve. 👀\r
      </p>\r
    </header>\r
\r
    <!-- Bloco principal "Em breve" -->\r
    <div class="rounded-3xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-6 sm:p-8">\r
      <div class="flex items-start gap-4">\r
        <div class="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl\r
                    bg-[#0A5C67]/10 text-[#0A5C67] dark:bg-[#0A5C67]/20">\r
          <!-- ícone “livro” -->\r
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">\r
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>\r
            <path d="M4 4h16v16H6.5A2.5 2.5 0 0 0 4 22z"/>\r
          </svg>\r
        </div>\r
        <div>\r
          <h2 class="text-xl font-bold text-[#031E21] dark:text-white">Em breve</h2>\r
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">\r
            Estamos preparando vídeos curtos, exemplos práticos e fluxos passo a passo\r
            para Mapas, Séries, Comparação e Relatórios.\r
          </p>\r
\r
          <!-- Sugestões rápidas / placeholders -->\r
          <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">\r
            <div class="rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-white/5 p-4">\r
              <h3 class="font-semibold mb-2">O que virá</h3>\r
              <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">\r
                <li>Navegação pelo painel e atalhos</li>\r
                <li>Como filtrar por bacia, estação e período</li>\r
                <li>Entendendo indicadores e unidades</li>\r
                <li>Exportar CSV e imprimir relatórios em PDF</li>\r
              </ul>\r
            </div>\r
\r
            <div class="rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-white/5 p-4">\r
              <h3 class="font-semibold mb-2">Precisa de ajuda agora?</h3>\r
              <ul class="text-sm space-y-2">\r
                <li>\r
                  <a href="/maps.html" class="inline-flex items-center gap-2 text-[#0A5C67] hover:underline">\r
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v14M15 6v14"/></svg>\r
                    Ver página de Mapas\r
                  </a>\r
                </li>\r
                <li>\r
                  <a href="/series.html" class="inline-flex items-center gap-2 text-[#0A5C67] hover:underline">\r
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 13l4-4 3 3 4-5"/></svg>\r
                    Ver Séries temporais\r
                  </a>\r
                </li>\r
                <li>\r
                  <a href="/reports.html" class="inline-flex items-center gap-2 text-[#0A5C67] hover:underline">\r
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h10a2 2 0 0 1 2 2v14l-5-3-5 3V5a2 2 0 0 1 2-2z"/></svg>\r
                    Ver Relatórios\r
                  </a>\r
                </li>\r
              </ul>\r
            </div>\r
          </div>\r
\r
          <!-- Ações -->\r
          <div class="mt-6 flex flex-wrap items-center gap-3">\r
            <a href="/dashboard.html"\r
               class="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-[#0A5C67] text-white text-sm font-semibold hover:brightness-110">\r
              Voltar ao Dashboard\r
            </a>\r
            <button type="button"\r
               class="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-black/10 dark:border-white/10\r
                      bg-white dark:bg-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/10">\r
              Notifique-me quando sair\r
            </button>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- FAQ placeholder -->\r
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">\r
      <div class="rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 p-5">\r
        <h3 class="font-semibold mb-2">Onde encontro os dados?</h3>\r
        <p class="text-sm text-gray-600 dark:text-gray-300">\r
          Use <em>Mapas</em> para visualizar camadas por região e a página <em>Séries</em> para ver a evolução diária,\r
          semanal ou mensal. Em <em>Relatórios</em>, você agrega e exporta.\r
        </p>\r
      </div>\r
      <div class="rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 p-5">\r
        <h3 class="font-semibold mb-2">Como mudar idioma/tema?</h3>\r
        <p class="text-sm text-gray-600 dark:text-gray-300">\r
          No rodapé do menu lateral, os botões de Tema e Idioma permitem alternar rapidamente.\r
        </p>\r
      </div>\r
    </div>\r
  </div>\r
</section>\r
`,ue=`<!-- Perfil (partial) -->\r
<section id="profile-root" class="w-full" data-page-profile>\r
  <div class="min-h-[calc(100vh-0px)] flex items-center justify-center px-6 py-10">\r
    <div class="w-full max-w-4xl rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur\r
                border border-black/5 dark:border-white/10 shadow-sm p-6 sm:p-8">\r
      <header class="text-center mb-8">\r
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#031E21] dark:text-white" data-i18n="Profile.heading">Meu perfil</h1>\r
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300" data-i18n="Profile.subheading">Atualize suas informações pessoais e preferências.</p>\r
      </header>\r
\r
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">\r
        <div class="md:col-span-1">\r
          <div class="flex flex-col items-center gap-4">\r
            <div class="relative">\r
              <img id="pf-avatar-preview" src="/src/assets/img/avatar-default.png" alt="Avatar"\r
                   class="h-32 w-32 rounded-2xl object-cover ring-2 ring-[#0A5C67]/20 dark:ring-white/10">\r
              <label for="pf-avatar"\r
                     class="absolute -bottom-2 -right-2 cursor-pointer rounded-xl bg-[#0A5C67] px-3 py-1.5 text-white text-xs font-semibold shadow hover:brightness-110"\r
                     data-i18n="Profile.avatar.change">Trocar</label>\r
              <input id="pf-avatar" type="file" class="hidden" accept="image/*" />\r
            </div>\r
            <div class="flex items-center gap-3">\r
              <button id="pf-avatar-remove" class="text-xs text-gray-600 dark:text-gray-300 hover:underline" type="button" data-i18n="Profile.avatar.remove">Remover foto</button>\r
              <button type="button" data-pf-avatar-tone class="text-xs text-[#0A5C67] hover:underline">Escolher tom de avatar</button>\r
            </div>\r
          </div>\r
        </div>\r
\r
        <form class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4" novalidate>\r
          <div>\r
            <label class="pf-label" for="pf-name" data-i18n="Profile.field.name">Nome</label>\r
            <input id="pf-name" type="text" autocomplete="name" class="pf-input" placeholder="Seu nome" data-i18n-placeholder="Profile.placeholder.name">\r
          </div>\r
          <div>\r
            <label class="pf-label" for="pf-email" data-i18n="Profile.field.email">E-mail</label>\r
            <input id="pf-email" type="email" autocomplete="email" class="pf-input" placeholder="voce@exemplo.com" data-i18n-placeholder="Profile.placeholder.email">\r
          </div>\r
          <div>\r
            <label class="pf-label" for="pf-org" data-i18n="Profile.field.org">Organização</label>\r
            <input id="pf-org" type="text" autocomplete="organization" class="pf-input" placeholder="Instituição/Empresa" data-i18n-placeholder="Profile.placeholder.org">\r
          </div>\r
          <div>\r
            <label class="pf-label" for="pf-role" data-i18n="Profile.field.role">Função</label>\r
            <select id="pf-role" class="pf-input">\r
              <option value="pesquisador">Pesquisador(a)</option>\r
              <option value="engenheiro">Engenheiro(a)</option>\r
              <option value="tecnico">Técnico(a)</option>\r
              <option value="gestor">Gestor(a)</option>\r
              <option value="estudante">Estudante</option>\r
              <option value="outro">Outro</option>\r
            </select>\r
            <input id="pf-role-other" type="text" class="pf-input mt-2 hidden" placeholder="Descreva sua função" />\r
          </div>\r
          <div>\r
            <label class="pf-label" for="pf-phone" data-i18n="Profile.field.phone">Telefone</label>\r
            <input id="pf-phone" type="text" autocomplete="tel" class="pf-input" placeholder="(61) 9 9999-9999" data-i18n-placeholder="Profile.placeholder.phone">\r
          </div>\r
          <div>\r
            <label class="pf-label" for="pf-lang" data-i18n="Profile.field.lang">Idioma</label>\r
            <select id="pf-lang" class="pf-input">\r
              <option value="pt-BR" data-i18n="Common.lang.ptbr">Português (BR)</option>\r
              <option value="en" data-i18n="Common.lang.en">English</option>\r
              <option value="es" data-i18n="Common.lang.es">Español</option>\r
            </select>\r
          </div>\r
          <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">\r
            <label class="inline-flex items-center gap-2"><input id="pf-dark" type="checkbox" class="rounded text-[#0A5C67]"><span class="text-sm" data-i18n="Profile.field.dark">Usar modo escuro</span></label>\r
            <label class="inline-flex items-center gap-2"><input id="pf-alerts" type="checkbox" class="rounded text-[#0A5C67]"><span class="text-sm" data-i18n="Profile.field.alerts">Receber alertas por e-mail</span></label>\r
          </div>\r
          <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">\r
            <div><label class="pf-label" for="pf-pass-current" data-i18n="Profile.field.pass_current">Senha atual</label><input id="pf-pass-current" type="password" autocomplete="current-password" class="pf-input" placeholder="••••••••"></div>\r
            <div><label class="pf-label" for="pf-pass-new" data-i18n="Profile.field.pass_new">Nova senha</label><input id="pf-pass-new" type="password" autocomplete="new-password" class="pf-input" placeholder="mín. 8 caracteres" data-i18n-placeholder="Profile.placeholder.pass_new"></div>\r
            <div><label class="pf-label" for="pf-pass-confirm" data-i18n="Profile.field.pass_confirm">Confirmar senha</label><input id="pf-pass-confirm" type="password" autocomplete="new-password" class="pf-input" placeholder="repita a nova senha" data-i18n-placeholder="Profile.placeholder.pass_confirm"></div>\r
          </div>\r
        </form>\r
      </div>\r
\r
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">\r
        <button id="pf-save" class="btn-aguaprev" data-i18n="Profile.actions.save">Salvar alterações</button>\r
        <button id="pf-reset" class="btn-aguaprev-outline" data-i18n="Profile.actions.reset">Descartar</button>\r
        <span id="pf-status" class="sr-only" aria-live="polite"></span>\r
      </div>\r
\r
      <div class="mt-8 border-t border-black/5 dark:border-white/10 pt-6">\r
        <h2 class="text-base font-semibold text-[#031E21] dark:text-white mb-2" data-i18n="Profile.activity.title">Atividade recente</h2>\r
        <ul id="pf-activity" class="text-sm text-gray-600 dark:text-gray-300 space-y-1"></ul>\r
      </div>\r
    </div>\r
  </div>\r
</section>\r
`;function Ht(t=document){const e=t.querySelector("[data-hero-visual]"),a=t.querySelector("[data-hero-float]");if(requestAnimationFrame(()=>{e&&(e.style.opacity="0",e.style.transform="translateY(8px)",e.style.transition="opacity 400ms ease, transform 500ms ease",requestAnimationFrame(()=>{e.style.opacity="1",e.style.transform="translateY(0)"})),a&&(a.style.opacity="0",a.style.transform="translateY(6px)",a.style.transition="opacity 400ms ease 120ms, transform 500ms ease 120ms",requestAnimationFrame(()=>{a.style.opacity="1",a.style.transform="translateY(0)"}))}),a){const n=()=>{const i=a.getBoundingClientRect(),l=window.innerHeight||document.documentElement.clientHeight,o=1-Math.min(Math.max((i.top+i.height/2)/l,0),1),c=Math.round(o*6);a.style.transform=`translateY(${c}px)`};n(),window.addEventListener("scroll",n,{passive:!0})}}function Nt(t){if(!t||t.dataset.boundHighlights==="1")return;t.dataset.boundHighlights="1";const e=Array.from(t.querySelectorAll("[data-highlight]"));if(!e.length)return;e.forEach(r=>{const s=r.querySelector("[data-highlight-extra]");s&&(s.classList.add("hidden"),s.style.overflow="hidden",s.style.maxHeight="0px",s.style.opacity="0",s.style.transition="max-height 420ms ease, opacity 320ms ease"),r.setAttribute("aria-expanded","false"),r.setAttribute("tabindex","0"),r.style.cursor="pointer"});const a=r=>r.querySelector("[data-highlight-extra]"),n=r=>r.dataset.tid?Number(r.dataset.tid):null,i=(r,s)=>{r.dataset.tid=String(s)},l=r=>{const s=n(r);s&&(clearTimeout(s),delete r.dataset.tid)};function o(r){const s=a(r);s&&(l(s),s.style.maxHeight="0px",s.style.opacity="0",i(s,window.setTimeout(()=>{s.classList.add("hidden"),l(s)},430)),r.setAttribute("aria-expanded","false"),r.classList.remove("ring-2","ring-[#0A5C67]/30","dark:ring-white/20"))}function c(r){const s=a(r);if(!s)return;l(s),s.classList.remove("hidden"),s.style.maxHeight="0px",s.style.opacity="0";const u=s.scrollHeight;requestAnimationFrame(()=>{s.style.maxHeight=u+"px",s.style.opacity="1"}),r.setAttribute("aria-expanded","true"),r.classList.add("ring-2","ring-[#0A5C67]/30","dark:ring-white/20")}function p(r){const s=r.getAttribute("aria-expanded")==="true";e.forEach(u=>{u!==r&&o(u)}),s?o(r):c(r)}e.forEach(r=>{r.addEventListener("click",()=>p(r)),r.addEventListener("keydown",s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),p(r)),s.key==="Escape"&&(s.preventDefault(),o(r))})});let d;window.addEventListener("resize",()=>{cancelAnimationFrame(d),d=requestAnimationFrame(()=>{const r=e.find(s=>s.getAttribute("aria-expanded")==="true");if(r){const s=a(r);s&&(s.style.maxHeight=s.scrollHeight+"px")}})},{passive:!0})}function Ft(t=document){const e=t.querySelector("#region-toggle"),a=t.querySelector("#region-menu"),n=t.querySelector("#region-current"),i={precip:t.querySelector('[data-mock="precip"]'),flow:t.querySelector('[data-mock="flow"]'),storage:t.querySelector('[data-mock="storage"]')};if(e&&a&&n){const c=()=>a.classList.add("hidden"),p=()=>a.classList.remove("hidden");e.addEventListener("click",()=>a.classList.contains("hidden")?p():c()),document.addEventListener("mousedown",d=>{!a.contains(d.target)&&!e.contains(d.target)&&c()}),a.querySelectorAll("[data-region]").forEach(d=>{d.addEventListener("click",()=>{const r=d.getAttribute("data-region");n.textContent=r,i.precip.textContent=(10+Math.round(Math.random()*40)).toString(),i.flow.textContent=(5+Math.round(Math.random()*25)).toString(),i.storage.textContent=(40+Math.round(Math.random()*50)).toString(),c()})})}const l=t.querySelector("[data-map-card]"),o=t.querySelector("[data-series-card]");[l,o].forEach((c,p)=>{c&&(c.style.opacity="0",c.style.transform="translateY(8px)",c.style.transition=`opacity 400ms ease ${p*50}ms, transform 500ms ease ${p*50}ms`,requestAnimationFrame(()=>{c.style.opacity="1",c.style.transform="translateY(0)"}))})}function Ot(t){if(!t||t.dataset.boundHow==="1")return;t.dataset.boundHow="1";const e=Array.from(t.querySelectorAll("[data-step]"));if(!e.length)return;e.forEach(r=>{const s=r.querySelector("[data-step-extra]");s&&(s.classList.add("hidden"),s.style.overflow="hidden",s.style.maxHeight="0px",s.style.opacity="0",s.style.transition="max-height 420ms ease, opacity 320ms ease"),r.setAttribute("aria-expanded","false"),r.setAttribute("tabindex","0"),r.style.cursor="pointer"});const a=r=>r.querySelector("[data-step-extra]"),n=r=>r.dataset.tid?Number(r.dataset.tid):null,i=(r,s)=>{r.dataset.tid=String(s)},l=r=>{const s=n(r);s&&(clearTimeout(s),delete r.dataset.tid)};function o(r){const s=a(r);s&&(l(s),s.style.maxHeight="0px",s.style.opacity="0",i(s,window.setTimeout(()=>{s.classList.add("hidden"),l(s)},430)),r.setAttribute("aria-expanded","false"),r.classList.remove("ring-2","ring-[#0A5C67]/30","dark:ring-white/20"))}function c(r){const s=a(r);if(!s)return;l(s),s.classList.remove("hidden"),s.style.maxHeight="0px",s.style.opacity="0";const u=s.scrollHeight;requestAnimationFrame(()=>{s.style.maxHeight=u+"px",s.style.opacity="1"}),r.setAttribute("aria-expanded","true"),r.classList.add("ring-2","ring-[#0A5C67]/30","dark:ring-white/20")}function p(r){const s=r.getAttribute("aria-expanded")==="true";e.forEach(u=>{u!==r&&o(u)}),s?o(r):c(r)}e.forEach(r=>{r.addEventListener("click",()=>p(r)),r.addEventListener("keydown",s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),p(r)),s.key==="Escape"&&(s.preventDefault(),o(r))})});let d;window.addEventListener("resize",()=>{cancelAnimationFrame(d),d=requestAnimationFrame(()=>{const r=e.find(s=>s.getAttribute("aria-expanded")==="true");if(r){const s=a(r);s&&(s.style.maxHeight=s.scrollHeight+"px")}})},{passive:!0})}const qt={"Header.Nav.home":{"pt-BR":"Início",en:"Home",es:"Inicio"},"Header.Nav.how":{"pt-BR":"Como Funciona",en:"How It Works",es:"Cómo Funciona"},"Header.Nav.features":{"pt-BR":"Recursos",en:"Features",es:"Recursos"},"Header.Nav.partners":{"pt-BR":"Parceiros",en:"Partners",es:"Aliados"},"Header.Nav.faq":{"pt-BR":"FAQ",en:"FAQ",es:"FAQ"},"Header.cta":{"pt-BR":"Login",en:"Login",es:"Acceso"},"Header.cta_lang":{"pt-BR":"PT-BR",en:"EN",es:"ES"},"Hero.badge":{"pt-BR":"Previsão Hídrica do DF",en:"DF Water Forecast",es:"Pronóstico Hídrico DF"},"Hero.title":{"pt-BR":"Antecipe cheias e escassez com<br class='hidden sm:block'/>mapas e previsões confiáveis",en:"Anticipate floods and droughts with<br class='hidden sm:block'/>reliable maps and forecasts",es:"Anticipe crecidas y escasez con<br class='hidden sm:block'/>mapas y pronósticos confiables"},"Hero.subtitle":{"pt-BR":"O <strong>AguaPrev</strong> integra dados hidrometeorológicos e modelos de previsão para oferecer <em>insights acionáveis</em> a gestores, produtores e cidadãos no Distrito Federal.",en:"<strong>AguaPrev</strong> integrates hydrometeorological data and forecasting models to provide <em>actionable insights</em> for managers, farmers, and citizens in the Federal District.",es:"<strong>AguaPrev</strong> integra datos hidrometeorológicos y modelos de pronóstico para ofrecer <em>insights accionables</em> a gestores, productores y ciudadanos en el Distrito Federal."},"Hero.cta_primary":{"pt-BR":"Abrir Dashboard",en:"Open Dashboard",es:"Abrir Panel"},"Hero.cta_secondary":{"pt-BR":"Como funciona",en:"How it works",es:"Cómo funciona"},"Hero.trust_1":{"pt-BR":"Dados ANA/INMET/Adasa",en:"ANA/INMET/Adasa data",es:"Datos ANA/INMET/Adasa"},"Hero.trust_2":{"pt-BR":"Atualização diária",en:"Daily updates",es:"Actualización diaria"},"Hero.trust_3":{"pt-BR":"Modelos validados",en:"Validated models",es:"Modelos validados"},"Hero.float_title":{"pt-BR":"TENDÊNCIA 7 DIAS — BACIA DESCOBERTO",en:"7-DAY TREND — DESCOBERTO BASIN",es:"TENDENCIA 7 DÍAS — CUENCA DESCOBERTO"},"Hero.float_label":{"pt-BR":"volume esperado",en:"expected volume",es:"volumen esperado"},"Hero.anchor_map":{"pt-BR":"Ver mapa/forecast",en:"See map/forecast",es:"Ver mapa/forecast"},"Hero.anchor_usecases":{"pt-BR":"Casos de uso",en:"Use cases",es:"Casos de uso"},"Hero.anchor_docs":{"pt-BR":"Documentação",en:"Docs",es:"Documentación"},"Trust.data_sources_label":{"pt-BR":"Fontes de dados",en:"Data sources",es:"Fuentes de datos"},"Trust.data_sources_value":{"pt-BR":"ANA • INMET • Adasa",en:"ANA • INMET • Adasa",es:"ANA • INMET • Adasa"},"Trust.update_label":{"pt-BR":"Atualização",en:"Update",es:"Actualización"},"Trust.update_value":{"pt-BR":"Diária",en:"Daily",es:"Diaria"},"Trust.validation_label":{"pt-BR":"Validação",en:"Validation",es:"Validación"},"Trust.validation_value":{"pt-BR":"Modelos revisados",en:"Reviewed models",es:"Modelos revisados"},"Highlights.p1_title":{"pt-BR":"Previsão 7/14 dias",en:"7/14-day forecast",es:"Pronóstico 7/14 días"},"Highlights.p1_desc":{"pt-BR":"Tendências de volume/nível com atualização diária para bacias do DF.",en:"Volume/level trends with daily updates for DF basins.",es:"Tendencias de volumen/nivel con actualizaciones diarias para cuencas del DF."},"Highlights.p2_title":{"pt-BR":"Alertas inteligentes",en:"Smart alerts",es:"Alertas inteligentes"},"Highlights.p2_desc":{"pt-BR":"Notificações por bacia/região quando limiares críticos são previstos.",en:"Basin/region notifications when critical thresholds are forecast.",es:"Notificaciones por cuenca/región cuando se pronostican umbrales críticos."},"Highlights.p3_title":{"pt-BR":"Mapas temáticos",en:"Thematic maps",es:"Mapas temáticos"},"Highlights.p3_desc":{"pt-BR":"Camadas de precipitação, vazão e risco, com filtros por período.",en:"Precipitation, flow and risk layers with period filters.",es:"Capas de precipitación, caudal y riesgo con filtros por período."},"Highlights.p4_title":{"pt-BR":"API & Export",en:"API & Export",es:"API y Exportación"},"Highlights.p4_desc":{"pt-BR":"Acesso programático e downloads para análise externa.",en:"Programmatic access and downloads for external analysis.",es:"Acceso programático y descargas para análisis externo."},"How.title":{"pt-BR":"Como funciona",en:"How it works",es:"Cómo funciona"},"How.subtitle":{"pt-BR":"Pipeline simplificado: coleta diária, processamento por modelos e entrega no dashboard.",en:"Simplified pipeline: daily collection, model processing and delivery on the dashboard.",es:"Flujo simplificado: recolección diaria, modelado y entrega en el panel."},"How.s1_title":{"pt-BR":"Coleta",en:"Collection",es:"Recolección"},"How.s1_desc":{"pt-BR":"Integra dados ANA, INMET e Adasa; normaliza e valida diariamente.",en:"Integrates ANA, INMET and Adasa data; normalizes and validates daily.",es:"Integra datos de ANA, INMET y Adasa; normaliza y valida diariamente."},"How.s2_title":{"pt-BR":"Modelagem",en:"Modeling",es:"Modelado"},"How.s2_desc":{"pt-BR":"Gera previsões 7/14 dias para nível, precipitação e vazão — com métricas de confiança.",en:"Generates 7/14-day forecasts for level, precipitation and flow — with confidence metrics.",es:"Genera pronósticos a 7/14 días para nivel, precipitación y caudal — con métricas de confianza."},"How.s3_title":{"pt-BR":"Entrega",en:"Delivery",es:"Entrega"},"How.s3_desc":{"pt-BR":"Disponibiliza no dashboard, API e alertas para gestores e cidadãos.",en:"Delivers to the dashboard, API and alerts for managers and citizens.",es:"Disponible en el panel, API y alertas para gestores y ciudadanos."},"Map.title":{"pt-BR":"Mapa & Forecast",en:"Map & Forecast",es:"Mapa y Pronóstico"},"Map.subtitle":{"pt-BR":"Selecione a região para ver o mapa e a tendência em 7 dias. As linhas indicam a variação ao longo da semana; os valores ao lado mostram o último ponto disponível.",en:"Select a region to see the map and 7-day trend. Lines indicate variation through the week; the values beside show the latest reading.",es:"Selecciona la región para ver el mapa y la tendencia a 7 días. Las líneas indican la variación semanal; los valores al lado muestran la última lectura."},"Map.legend":{"pt-BR":"Legenda:",en:"Legend:",es:"Leyenda:"},"Map.legend_text":{"pt-BR":"Linhas indicam iso-curvas e os pontos marcam estações/locais de referência.",en:"Lines indicate iso-curves and points mark reference stations/locations.",es:"Las líneas indican iso-curvas y los puntos marcan estaciones/lugares de referencia."},"Map.series_title":{"pt-BR":"Tendência (7 dias)",en:"Trend (7 days)",es:"Tendencia (7 días)"},"Map.metric_precip":{"pt-BR":"Precipitação",en:"Precipitation",es:"Precipitación"},"Map.metric_flow":{"pt-BR":"Vazão",en:"Flow",es:"Caudal"},"Map.metric_storage":{"pt-BR":"Armazenamento",en:"Storage",es:"Almacenamiento"},"Map.series_hint":{"pt-BR":"As mini-curvas mostram a tendência de 7 dias; o número ao lado é o valor mais recente.",en:"Sparklines show the 7-day trend; the number beside is the latest value.",es:"Los minigráficos muestran la tendencia de 7 días; el número al lado es el valor más reciente."},"Map.region.df":{"pt-BR":"DF — Geral",en:"DF — Overview",es:"DF — General"},"Map.region.desc":{"pt-BR":"Bacia Descoberto",en:"Descoberto Basin",es:"Cuenca Descoberto"},"Map.region.paranoa":{"pt-BR":"Bacia Paranoá",en:"Paranoá Basin",es:"Cuenca Paranoá"},"Map.region.sb":{"pt-BR":"Bacia São Bartolomeu",en:"São Bartolomeu Basin",es:"Cuenca São Bartolomeu"},"Map.cta":{"pt-BR":"Abrir no Dashboard",en:"Open in Dashboard",es:"Abrir en el Panel"},"Footer.product":{"pt-BR":"Produto",en:"Product",es:"Producto"},"Footer.company":{"pt-BR":"Institucional",en:"Company",es:"Institucional"},"Footer.legal":{"pt-BR":"Legal",en:"Legal",es:"Legal"},"Footer.link.how":{"pt-BR":"Como funciona",en:"How it works",es:"Cómo funciona"},"Footer.link.features":{"pt-BR":"Recursos",en:"Features",es:"Recursos"},"Footer.link.map":{"pt-BR":"Mapa & Forecast",en:"Map & Forecast",es:"Mapa y Forecast"},"Footer.link.docs":{"pt-BR":"Docs",en:"Docs",es:"Docs"},"Footer.link.about":{"pt-BR":"Sobre",en:"About",es:"Acerca de"},"Footer.link.contact":{"pt-BR":"Contato",en:"Contact",es:"Contacto"},"Footer.link.terms":{"pt-BR":"Termos de uso",en:"Terms of use",es:"Términos de uso"},"Footer.link.privacy":{"pt-BR":"Privacidade",en:"Privacy",es:"Privacidad"},"Footer.link.licenses":{"pt-BR":"Licenças",en:"Licenses",es:"Licencias"},"Footer.copyright":{"pt-BR":"© {year} AguaPrev — Universidade de Brasília",en:"© {year} AguaPrev — University of Brasília",es:"© {year} AguaPrev — Universidad de Brasilia"},"Login.title":{"pt-BR":"Entrar",en:"Sign in",es:"Iniciar sesión"},"Login.page_subtitle":{"pt-BR":"Acesse sua conta para abrir o dashboard do AguaPrev.",en:"Access your account to open the AguaPrev dashboard.",es:"Accede a tu cuenta para abrir el panel de AguaPrev."},"Login.form_subtitle":{"pt-BR":"Use seu e-mail e senha ou entre com um provedor.",en:"Use your email and password or continue with a provider.",es:"Usa tu correo y contraseña o continúa con un proveedor."},"Login.subtitle":{"pt-BR":"Acesse sua conta para abrir o dashboard do AguaPrev.",en:"Access your account to open the AguaPrev dashboard.",es:"Accede a tu cuenta para abrir el panel de AguaPrev."},"Login.email_label":{"pt-BR":"E-mail",en:"Email",es:"Correo"},"Login.password_label":{"pt-BR":"Senha",en:"Password",es:"Contraseña"},"Login.remember":{"pt-BR":"Lembrar de mim",en:"Remember me",es:"Recuérdame"},"Login.forgot":{"pt-BR":"Esqueci a senha",en:"Forgot password",es:"Olvidé mi contraseña"},"Login.signin":{"pt-BR":"Entrar",en:"Sign in",es:"Entrar"},"Login.or":{"pt-BR":"ou",en:"or",es:"o"},"Login.google":{"pt-BR":"Continuar com Google",en:"Continue with Google",es:"Continuar con Google"},"Login.github":{"pt-BR":"Continuar com GitHub",en:"Continue with GitHub",es:"Continuar con GitHub"},"Login.no_account":{"pt-BR":"Ainda não tem conta?",en:"Don’t have an account?",es:"¿Aún no tienes cuenta?"},"Login.create":{"pt-BR":"Criar conta",en:"Create account",es:"Crear cuenta"},"Auth.Register.title":{"pt-BR":"Criar conta",en:"Create account",es:"Crear cuenta"},"Auth.Register.subtitle":{"pt-BR":"Acesse mapas e previsões personalizadas do AguaPrev.",en:"Access personalized maps and forecasts from AguaPrev.",es:"Accede a mapas y pronósticos personalizados de AguaPrev."},"Auth.Register.fullname_label":{"pt-BR":"Nome completo",en:"Full name",es:"Nombre completo"},"Auth.Register.name_label":{"pt-BR":"Nome completo",en:"Full name",es:"Nombre completo"},"Auth.Register.email_label":{"pt-BR":"E-mail",en:"Email",es:"Correo"},"Auth.Register.password_label":{"pt-BR":"Senha",en:"Password",es:"Contraseña"},"Auth.Register.password2_label":{"pt-BR":"Confirmar senha",en:"Confirm password",es:"Confirmar contraseña"},"Auth.Register.password_confirm_label":{"pt-BR":"Confirmar senha",en:"Confirm password",es:"Confirmar contraseña"},"Auth.Register.terms":{"pt-BR":"Aceito os termos de uso e a política de privacidade",en:"I accept the terms of use and the privacy policy",es:"Acepto los términos de uso y la política de privacidad"},"Auth.Register.accept_terms_label":{"pt-BR":"Li e aceito os Termos e a Política de Privacidade",en:"I have read and accept the Terms and the Privacy Policy",es:"He leído y acepto los Términos y la Política de Privacidad"},"Auth.Register.terms_link":{"pt-BR":"Termos",en:"Terms",es:"Términos"},"Auth.Register.privacy_link":{"pt-BR":"Privacidade",en:"Privacy",es:"Privacidad"},"Auth.Register.cta":{"pt-BR":"Criar conta",en:"Create account",es:"Crear cuenta"},"Auth.Register.login_link":{"pt-BR":"Entrar",en:"Sign in",es:"Entrar"},"Auth.Register.have_account":{"pt-BR":"Já tem conta?",en:"Already have an account?",es:"¿Ya tienes cuenta?"},"Auth.Register.create":{"pt-BR":"Criar conta",en:"Create account",es:"Crear cuenta"},"Auth.Register.signin":{"pt-BR":"Entrar",en:"Sign in",es:"Entrar"},"Auth.Register.or":{"pt-BR":"ou",en:"or",es:"o"},"Auth.Register.google":{"pt-BR":"Continuar com Google",en:"Continue with Google",es:"Continuar con Google"},"Auth.Register.github":{"pt-BR":"Continuar com GitHub",en:"Continue with GitHub",es:"Continuar con GitHub"},"Auth.toggle_show":{"pt-BR":"Mostrar",en:"Show",es:"Mostrar"},"Auth.toggle_hide":{"pt-BR":"Ocultar",en:"Hide",es:"Ocultar"},"Auth.Password.strength_unknown":{"pt-BR":"Força da senha",en:"Password strength",es:"Fuerza de la contraseña"},"Auth.Password.strength":{"pt-BR":"Segurança da senha",en:"Password strength",es:"Seguridad de la contraseña"},"Auth.Password.very_weak":{"pt-BR":"Muito fraca",en:"Very weak",es:"Muy débil"},"Auth.Password.weak":{"pt-BR":"Fraca",en:"Weak",es:"Débil"},"Auth.Password.medium":{"pt-BR":"Média",en:"Medium",es:"Media"},"Auth.Password.strong":{"pt-BR":"Forte",en:"Strong",es:"Fuerte"},"Auth.Password.very_strong":{"pt-BR":"Muito forte",en:"Very strong",es:"Muy fuerte"},"Auth.Password.hint":{"pt-BR":"Use pelo menos 8 caracteres, combinando letras maiúsculas, minúsculas, números e símbolos.",en:"Use at least 8 characters mixing uppercase, lowercase, numbers, and symbols.",es:"Usa al menos 8 caracteres combinando mayúsculas, minúsculas, números y símbolos."},"Auth.Password.match_ok":{"pt-BR":"Senhas conferem.",en:"Passwords match.",es:"Las contraseñas coinciden."},"Auth.Password.match_fail":{"pt-BR":"As senhas não conferem.",en:"Passwords do not match.",es:"Las contraseñas no coinciden."},"Sidebar.overview":{"pt-BR":"Visão geral",en:"Overview",es:"Resumen"},"Sidebar.maps":{"pt-BR":"Mapas",en:"Maps",es:"Mapas"},"Sidebar.series":{"pt-BR":"Séries",en:"Series",es:"Series"},"Sidebar.alerts":{"pt-BR":"Alertas",en:"Alerts",es:"Alertas"},"Sidebar.downloads":{"pt-BR":"Downloads",en:"Downloads",es:"Descargas"},"Sidebar.settings":{"pt-BR":"Configurações",en:"Settings",es:"Configuraciones"},"Sidebar.signout":{"pt-BR":"Sair",en:"Sign out",es:"Salir"},"Sidebar.section_admin":{"pt-BR":"Conta",en:"Account",es:"Cuenta"},"Sidebar.profile":{"pt-BR":"Perfil",en:"Profile",es:"Perfil"},"Sidebar.tutorial":{"pt-BR":"Tutorial",en:"Tutorial",es:"Tutorial"},"Dash.nav.overview":{"pt-BR":"Visão geral",en:"Overview",es:"Panorama"},"Dash.nav.series":{"pt-BR":"Séries",en:"Series",es:"Series"},"Dash.nav.alerts":{"pt-BR":"Alertas",en:"Alerts",es:"Alertas"},"Dash.title":{"pt-BR":"Visão geral hídrica",en:"Water overview",es:"Panorama hídrico"},"Dash.subtitle":{"pt-BR":"Indicadores principais por bacia (últimos 7 dias).",en:"Key basin indicators (last 7 days).",es:"Indicadores clave por cuenca (últimos 7 días)."},"Dash.chart_precip":{"pt-BR":"Precipitação (mm) — últimos 7 dias",en:"Precipitation (mm) — last 7 days",es:"Precipitación (mm) — últimos 7 días"},"Dash.chart_storage":{"pt-BR":"Reservatórios — nível de armazenamento (%)",en:"Reservoirs — storage level (%)",es:"Embalses — nivel de almacenamiento (%)"},"Dash.chart_flow":{"pt-BR":"Vazão (m³/s) — série diária",en:"Flow (m³/s) — daily series",es:"Caudal (m³/s) — serie diaria"},"Dash.chart_risk":{"pt-BR":"Composição de risco (próx. 7 dias)",en:"Risk composition (next 7 days)",es:"Composición de riesgo (próx. 7 días)"},"UI.theme":{"pt-BR":"Tema",en:"Theme",es:"Tema"},"UI.theme_toggle":{"pt-BR":"Alternar",en:"Toggle",es:"Alternar"},"UI.language":{"pt-BR":"Idioma",en:"Language",es:"Idioma"},"Dash.filters.region":{"pt-BR":"Região",en:"Region",es:"Región"},"Dash.filters.start":{"pt-BR":"Início",en:"Start",es:"Inicio"},"Dash.filters.end":{"pt-BR":"Fim",en:"End",es:"Fin"},"Dash.filters.metrics":{"pt-BR":"Métricas",en:"Metrics",es:"Métricas"},"Dash.filters.apply":{"pt-BR":"Aplicar filtros",en:"Apply filters",es:"Aplicar filtros"},"Dash.filters.reset":{"pt-BR":"Redefinir",en:"Reset",es:"Restablecer"},"Kpi.avg_precip_label":{"pt-BR":"Precipitação média",en:"Average precipitation",es:"Precipitación media"},"Kpi.avg_flow_label":{"pt-BR":"Vazão média",en:"Average flow",es:"Caudal medio"},"Kpi.avg_storage_label":{"pt-BR":"Armazenamento médio",en:"Average storage",es:"Almacenamiento medio"},"Kpi.risk_high_7d_label":{"pt-BR":"Risco alto (próx. 7d)",en:"High risk (next 7d)",es:"Riesgo alto (próx. 7d)"},"Common.refresh":{"pt-BR":"Atualizar",en:"Refresh",es:"Actualizar"},"Common.export_png":{"pt-BR":"Exportar PNG",en:"Export PNG",es:"Exportar PNG"},"Common.export_csv":{"pt-BR":"Exportar CSV",en:"Export CSV",es:"Exportar CSV"},"Common.lang.ptbr":{"pt-BR":"Português (BR)",en:"Portuguese (BR)",es:"Portugués (BR)"},"Common.lang.en":{"pt-BR":"Inglês",en:"English",es:"Inglés"},"Common.lang.es":{"pt-BR":"Espanhol",en:"Spanish",es:"Español"},"Series.title":{"pt-BR":"Séries temporais",en:"Time series",es:"Series temporales"},"Series.subtitle":{"pt-BR":"Explore séries temporais de chuva, nível de reservatórios e outros indicadores hídricos.",en:"Explore time series of rainfall, reservoir levels, and other water indicators.",es:"Explora series temporales de lluvia, niveles de embalses y otros indicadores hídricos."},"Series.table_title":{"pt-BR":"Observações",en:"Observations",es:"Observaciones"},"Series.toggle_filters":{"pt-BR":"Mostrar/ocultar filtros",en:"Show/hide filters",es:"Mostrar/ocultar filtros"},"Filters.basin":{"pt-BR":"Bacia",en:"Basin",es:"Cuenca"},"Filters.station":{"pt-BR":"Estação/Reservatório",en:"Station/Reservoir",es:"Estación/Embalse"},"Filters.variable":{"pt-BR":"Variável",en:"Variable",es:"Variable"},"Filters.resolution":{"pt-BR":"Resolução",en:"Resolution",es:"Resolución"},"Filters.from":{"pt-BR":"De",en:"From",es:"Desde"},"Filters.to":{"pt-BR":"Até",en:"To",es:"Hasta"},"Var.rain":{"pt-BR":"Chuva (mm)",en:"Rain (mm)",es:"Lluvia (mm)"},"Var.level":{"pt-BR":"Nível do reservatório (m)",en:"Reservoir level (m)",es:"Nivel del embalse (m)"},"Var.flow":{"pt-BR":"Vazão (m³/s)",en:"Flow (m³/s)",es:"Caudal (m³/s)"},"Basin.descoberto":{"pt-BR":"Descoberto",en:"Descoberto",es:"Descoberto"},"Basin.santamaria":{"pt-BR":"Santa Maria",en:"Santa Maria",es:"Santa María"},"Basin.corumba":{"pt-BR":"Corumbá",en:"Corumbá",es:"Corumbá"},"Kpi.points":{"pt-BR":"Pontos",en:"Points",es:"Puntos"},"Kpi.min":{"pt-BR":"Mín",en:"Min",es:"Mín"},"Kpi.max":{"pt-BR":"Máx",en:"Max",es:"Máx"},"Kpi.last":{"pt-BR":"Último",en:"Last",es:"Último"},"Table.date":{"pt-BR":"Data",en:"Date",es:"Fecha"},"Table.value":{"pt-BR":"Valor",en:"Value",es:"Valor"},"Profile.title":{"pt-BR":"Perfil — AguaPrev",en:"Profile — AguaPrev",es:"Perfil — AguaPrev"},"Profile.heading":{"pt-BR":"Meu perfil",en:"My profile",es:"Mi perfil"},"Profile.subheading":{"pt-BR":"Atualize suas informações pessoais e preferências.",en:"Update your personal information and preferences.",es:"Actualiza tu información personal y preferencias."},"Profile.avatar.change":{"pt-BR":"Trocar",en:"Change",es:"Cambiar"},"Profile.avatar.remove":{"pt-BR":"Remover foto",en:"Remove photo",es:"Eliminar foto"},"Profile.field.name":{"pt-BR":"Nome",en:"Name",es:"Nombre"},"Profile.field.email":{"pt-BR":"E-mail",en:"Email",es:"Correo"},"Profile.field.org":{"pt-BR":"Organização",en:"Organization",es:"Organización"},"Profile.field.role":{"pt-BR":"Função",en:"Role",es:"Cargo"},"Profile.field.phone":{"pt-BR":"Telefone",en:"Phone",es:"Teléfono"},"Profile.field.lang":{"pt-BR":"Idioma",en:"Language",es:"Idioma"},"Profile.field.dark":{"pt-BR":"Usar modo escuro",en:"Use dark mode",es:"Usar modo oscuro"},"Profile.field.alerts":{"pt-BR":"Receber alertas por e-mail",en:"Receive alerts by email",es:"Recibir alertas por correo"},"Profile.field.pass_current":{"pt-BR":"Senha atual",en:"Current password",es:"Contraseña actual"},"Profile.field.pass_new":{"pt-BR":"Nova senha",en:"New password",es:"Nueva contraseña"},"Profile.field.pass_confirm":{"pt-BR":"Confirmar senha",en:"Confirm password",es:"Confirmar contraseña"},"Profile.placeholder.name":{"pt-BR":"Seu nome",en:"Your name",es:"Tu nombre"},"Profile.placeholder.email":{"pt-BR":"voce@exemplo.com",en:"you@example.com",es:"tu@ejemplo.com"},"Profile.placeholder.org":{"pt-BR":"Instituição/Empresa",en:"Institution/Company",es:"Institución/Empresa"},"Profile.placeholder.role":{"pt-BR":"Cargo/Função",en:"Position/Role",es:"Puesto/Cargo"},"Profile.placeholder.phone":{"pt-BR":"(61) 9 9999-9999",en:"(+55) 61 99999-9999",es:"(+55) 61 99999-9999"},"Profile.placeholder.pass_new":{"pt-BR":"mín. 8 caracteres",en:"min. 8 characters",es:"mín. 8 caracteres"},"Profile.placeholder.pass_confirm":{"pt-BR":"repita a nova senha",en:"repeat new password",es:"repite la nueva contraseña"},"Profile.actions.save":{"pt-BR":"Salvar alterações",en:"Save changes",es:"Guardar cambios"},"Profile.actions.reset":{"pt-BR":"Descartar",en:"Discard",es:"Descartar"},"Profile.activity.title":{"pt-BR":"Atividade recente",en:"Recent activity",es:"Actividad reciente"},"Profile.msg.saved":{"pt-BR":"Perfil atualizado.",en:"Profile updated.",es:"Perfil actualizado."},"Profile.msg.discarded":{"pt-BR":"Alterações descartadas.",en:"Changes discarded.",es:"Cambios descartados."},"Profile.msg.shortPass":{"pt-BR":"Senha muito curta.",en:"Password too short.",es:"Contraseña demasiado corta."},"Profile.msg.confirmNoMatch":{"pt-BR":"Confirmação não confere.",en:"Confirmation does not match.",es:"La confirmación no coincide."},"Profile.msg.imgTooBig":{"pt-BR":"Imagem acima de 2MB.",en:"Image above 2MB.",es:"Imagen mayor de 2MB."},"Tutorial.title":{"pt-BR":"Tutorial",en:"Tutorial",es:"Tutorial"},"Tutorial.soon":{"pt-BR":"Em breve — estamos preparando um passo a passo com vídeos curtos.",en:"Coming soon — we're preparing a step-by-step with short videos.",es:"Próximamente — estamos preparando un paso a paso con videos cortos."},"Tutorial.cta.back":{"pt-BR":"Voltar ao dashboard",en:"Back to dashboard",es:"Volver al panel"}},at="aguaprev_lang",W="pt-BR";let P=null,z=null,F=!1,K=!1;function ee(){if(P)return P;const t=localStorage.getItem(at);if(t)return P=t;const e=navigator.language||navigator.userLanguage||W;return["pt-BR","en","es"].includes(e)?P=e:e.startsWith("pt")?P="pt-BR":e.startsWith("es")?P="es":P=W}function te(t){P=t,localStorage.setItem(at,t),k(document)}function nt(t,e=ee()){const a=qt[t];return a?a[e]??a[W]??t:t}function k(t=document){if(F){K=!0;return}F=!0;const e=ee();t.querySelectorAll("[data-i18n]").forEach(n=>{const i=n.getAttribute("data-i18n");if(!i)return;const l=nt(i,e);n.innerHTML!==l&&(n.innerHTML=l)}),requestAnimationFrame(()=>{F=!1,K&&(K=!1,k(t))})}function rt(t=document.body){z&&z.disconnect();let e=null;const a=()=>{F||e||(e=requestAnimationFrame(()=>{e=null,k(document)}))};z=new MutationObserver(n=>{var i,l;for(const o of n){if(F)return;if(o.type==="childList"&&((i=o.addedNodes)!=null&&i.length||(l=o.removedNodes)!=null&&l.length)){a();return}if(o.type==="attributes"&&o.attributeName==="data-i18n"){a();return}}}),z.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-i18n"]}),k(document)}const za=Object.freeze(Object.defineProperty({__proto__:null,applyTranslations:k,getLanguage:ee,setLanguage:te,startI18nObserver:rt,t:nt},Symbol.toStringTag,{value:"Module"})),zt={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_API_URL:"http://127.0.0.1:5000"},me=window.API_URL||typeof import.meta<"u"&&zt&&"http://127.0.0.1:5000"||window.NEXT_PUBLIC_API_URL||"http://127.0.0.1:3001",ae="aguaprev.pwd_hash",st="changeme";async function L(t){const e=new TextEncoder().encode(t||""),a=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(a)).map(n=>n.toString(16).padStart(2,"0")).join("")}function $(t,e=null){try{return JSON.parse(localStorage.getItem(t)||"null")??e}catch{return e}}function it(t,e=null){try{return JSON.parse(sessionStorage.getItem(t)||"null")??e}catch{return e}}function ge(t,e){try{localStorage.setItem(t,JSON.stringify(e))}catch{}}function he(t,e){try{sessionStorage.setItem(t,JSON.stringify(e))}catch{}}function fe(t){try{localStorage.removeItem(t)}catch{}}function ot(){const t=$("aguaprev.profile",{}),e=$("auth_user",null),a=it("auth_user",null);return(t.email||(e==null?void 0:e.email)||(a==null?void 0:a.email)||"").trim().toLowerCase()}async function Vt(t){const e=(t||"").trim().toLowerCase(),a=ot();if(!a||e!==a)return!1;const n=localStorage.getItem(ae)||"";if(!n)return!1;const i=await L(st);return n!==i}async function lt(t){const e=localStorage.getItem(ae)||"";if(!e)return!1;const a=await L(t||""),n=await L((t||"").trim());return e===a||e===n}async function ve(t,e){const a=ot(),n=(t||"").trim().toLowerCase();if(!a||!n||a!==n)return null;const i=localStorage.getItem(ae)||"",l=await L(st);let o=!1;if(i){if(o=await lt(e),!o&&i===l){const s=await L(e||""),u=await L((e||"").trim());o=!e||s===l||u===l}}else{const s=await L(e||""),u=await L((e||"").trim());o=!e||s===l||u===l}if(!o)return null;const c=$("aguaprev.profile",{}),p=$("auth_user",{})||it("auth_user",{})||{},d={...p,name:p.name||p.fullName||"Usuário",fullName:p.fullName||p.name||"Usuário",email:a,role:p.role||c.role||"pesquisador",avatar:p.avatar||c.avatarDataUrl||"/src/assets/img/avatar-default.png"},r=Date.now();return{access:`dev-access-${r}`,refresh:`dev-refresh-${r}`,user:d}}const jt=t=>{const e=(t==null?void 0:t.tokens)||{},a=e.access||(t==null?void 0:t.access)||(t==null?void 0:t.access_token)||null,n=e.refresh||(t==null?void 0:t.refresh)||(t==null?void 0:t.refresh_token)||null;return{access:a,refresh:n}};async function Ut(t,e){if(await Vt(t)){if(!await lt(e))throw new Error("Senha incorreta.");const p=await ve(t,e);if(p)return p;throw new Error("Falha na autenticação local.")}let a=null,n=null,i=null;try{n=await fetch(`${me}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:e})});try{a=await n.json()}catch{a={}}}catch(c){i=c}if(n&&n.ok){const{access:c,refresh:p}=jt(a);if(!c)throw new Error("Resposta sem access token.");let d=null;try{const u=await fetch(`${me}/me`,{headers:{Authorization:`Bearer ${c}`}}),g=await u.json().catch(()=>({}));u.ok&&(g!=null&&g.user)&&(d=g.user)}catch{}const r=a.user||a.profile||{},s={...r,...d,name:(d==null?void 0:d.name)||(r==null?void 0:r.name)||(r==null?void 0:r.fullName)||"Usuário",fullName:(d==null?void 0:d.fullName)||(r==null?void 0:r.fullName)||(r==null?void 0:r.name)||"Usuário",email:(d==null?void 0:d.email)||(r==null?void 0:r.email)||t,avatar:(d==null?void 0:d.avatar)||(r==null?void 0:r.avatar)||"/src/assets/img/avatar-default.png",role:(d==null?void 0:d.role)||(r==null?void 0:r.role)||"pesquisador"};return{access:c,refresh:p,user:s}}const l=await ve(t,e);if(l)return l;const o=(a==null?void 0:a.message)||(a==null?void 0:a.error)||(i?"Falha de rede ao acessar o servidor.":`Erro ${(n==null?void 0:n.status)||""}`.trim());throw new Error(o||"Falha no login.")}function $t(t){if(!t||t.dataset.boundLogin==="1")return;t.dataset.boundLogin="1";const e=t.querySelector("#login-form"),a=t.querySelector("#login-email"),n=t.querySelector("#login-password"),i=t.querySelector("#login-remember"),l=t.querySelector("#login-feedback"),o=t.querySelector("#login-submit"),c=t.querySelector("#login-spinner"),p=t.querySelector("#toggle-pass"),d=t.querySelector("#icon-eye"),r=t.querySelector("#icon-eye-off");p&&p.addEventListener("click",()=>{const m=n.type==="password";n.type=m?"text":"password",d&&d.classList.toggle("hidden",m),r&&r.classList.toggle("hidden",!m),n==null||n.focus()});function s(m){o&&(o.disabled=m,c==null||c.classList.toggle("hidden",!m))}function u(m,x){const y=t.querySelector(`[data-error="${m}"]`);y&&(y.textContent=x,y.classList.remove("hidden"))}function g(){t.querySelectorAll("[data-error]").forEach(m=>m.classList.add("hidden"))}function h(m,x){l&&(l.textContent=x||"",l.classList.toggle("hidden",!x),l.classList.remove("text-red-600","text-[#0A5C67]","dark:text-[#6BAAC9]"),m==="error"&&l.classList.add("text-red-600"),m==="success"&&l.classList.add("text-[#0A5C67]","dark:text-[#6BAAC9]"))}const f=(m,x,y)=>{const _=m||{},E=x||{};y?(ge("auth_user",_),ge("auth_tokens",E),localStorage.setItem("auth_remember","1")):(fe("auth_user"),fe("auth_tokens"),localStorage.removeItem("auth_remember")),he("auth_user",_),he("auth_tokens",E)};e&&e.addEventListener("submit",async m=>{m.preventDefault(),g(),h("","");const x=((a==null?void 0:a.value)||"").trim(),y=(n==null?void 0:n.value)||"",_=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);if(_||u("email","Informe um e-mail válido."),y||u("password","Informe sua senha."),!(!_||!y)){s(!0);try{const{access:E,refresh:H,user:N}=await Ut(x,y);f(N,{access:E,refresh:H},!!(i!=null&&i.checked)),window.dispatchEvent(new CustomEvent("auth:login",{detail:{user:N,tokens:{access:E,refresh:H}}})),h("success","Login realizado! Redirecionando..."),setTimeout(()=>{window.location.href="/dashboard.html"},600)}catch(E){h("error",E.message||"Falha no login.")}finally{s(!1)}}}),k(t)}const Gt={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_API_URL:"http://127.0.0.1:5000"},Kt=window.API_URL||typeof import.meta<"u"&&Gt&&"http://127.0.0.1:5000"||window.NEXT_PUBLIC_API_URL||"http://127.0.0.1:3001";function Jt(t,e){try{localStorage.setItem("auth_tokens",JSON.stringify(t)),localStorage.setItem("auth_user",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("auth:login",{detail:{user:e,tokens:t}}))}catch{}}function Q(t=document){var p;const e=t.querySelector("#ap-register-form");if(!e)return;const a=d=>e.querySelector(d),n={name:a("#ap-fullname"),email:a("#ap-email"),pass:a("#ap-pass"),pass2:a("#ap-pass2"),terms:a("#ap-terms"),toggle:a("#toggle-pass"),bar:a("#ap-pass-strength-bar"),label:a("#ap-pass-strength-label"),match:a("#ap-pass-match"),submit:e.querySelector('button[type="submit"]')},i=d=>{var u,g;const r=(u=n.toggle)==null?void 0:u.querySelector("span"),s=(g=n.toggle)==null?void 0:g.querySelector("svg");!r||!s||(r.setAttribute("data-i18n",d?"Auth.toggle_hide":"Auth.toggle_show"),k(r.parentElement),s.innerHTML=d?'<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.29 20.29 0 0 1 4.23-5.52m4.43-2.49A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.28 20.28 0 0 1-3.12 4.02"></path><line x1="1" y1="1" x2="23" y2="23"></line>':'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"></path><circle cx="12" cy="12" r="3"></circle>')};(p=n.toggle)==null||p.addEventListener("click",()=>{const d=n.pass.type==="password";n.pass.type=d?"text":"password",n.pass2.type=d?"text":"password",i(d)}),i(!1);const l=d=>{if(!d)return{pct:0,cls:"bg-gray-300 dark:bg-white/15",key:"Auth.Password.strength_unknown"};let r=0;return d.length>=8&&r++,d.length>=12&&r++,/[a-z]/.test(d)&&/[A-Z]/.test(d)&&r++,/\d/.test(d)&&r++,/[^A-Za-z0-9]/.test(d)&&r++,r<=1?{pct:20,cls:"bg-red-500",key:"Auth.Password.very_weak"}:r===2?{pct:40,cls:"bg-orange-500",key:"Auth.Password.weak"}:r===3?{pct:60,cls:"bg-amber-500",key:"Auth.Password.medium"}:r===4?{pct:80,cls:"bg-lime-500",key:"Auth.Password.strong"}:{pct:100,cls:"bg-emerald-500",key:"Auth.Password.very_strong"}},o=()=>{const d=l(n.pass.value);n.bar&&(n.bar.style.width=`${d.pct}%`,n.bar.className=`h-2 rounded-full transition-all duration-300 ease-out ${d.cls}`),n.label&&(n.label.setAttribute("data-i18n",d.key),k(n.label.parentElement))},c=()=>{if(!n.match)return;const d=n.pass.value,r=n.pass2.value;if(!r){n.match.classList.add("hidden"),n.pass2.classList.remove("ring-2","ring-emerald-400","ring-rose-400","border-emerald-400/70","border-red-400/70");return}n.match.classList.remove("hidden"),d===r?(n.match.setAttribute("data-i18n","Auth.Password.match_ok"),n.match.className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400",n.pass2.classList.remove("ring-rose-400","border-red-400/70"),n.pass2.classList.add("ring-2","ring-emerald-400","border-emerald-400/70")):(n.match.setAttribute("data-i18n","Auth.Password.match_bad"),n.match.className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400",n.pass2.classList.remove("ring-emerald-400","border-emerald-400/70"),n.pass2.classList.add("ring-2","ring-rose-400","border-red-400/70")),k(n.match.parentElement)};n.pass.addEventListener("input",()=>{o(),c()}),n.pass2.addEventListener("input",c),o(),e.addEventListener("submit",async d=>{d.preventDefault();const r=n.name.value.trim(),s=n.email.value.trim().toLowerCase(),u=n.pass.value,g=n.pass2.value;if(!r||!s||!u||!g){alert("Preencha todos os campos.");return}if(u!==g){alert("As senhas precisam ser iguais."),n.pass2.focus();return}if(!n.terms.checked){alert("Você precisa aceitar os termos."),n.terms.focus();return}const h={name:r,email:s,password:u};n.submit&&(n.submit.disabled=!0);try{const f=await fetch(`${Kt}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(h)}),m=await f.json().catch(()=>({}));if(!f.ok){const x=m&&(m.error||m.message)||`Erro ${f.status}`;alert(x);return}Jt(m.tokens,m.user),window.location.href="/dashboard.html"}catch{alert("Falha ao conectar no servidor.")}finally{n.submit&&(n.submit.disabled=!1)}})}document.readyState!=="loading"?Q():document.addEventListener("DOMContentLoaded",()=>Q());function Yt(t=document){var s;const e=t.querySelector("#social-floating");if(!e)return;const a=e.querySelector("#social-toggle"),n=e.querySelector("#social-links"),i=e.querySelector("#social-copy"),l=()=>{e.classList.contains("is-open")||(e.classList.add("is-open"),a==null||a.setAttribute("aria-expanded","true"),n==null||n.setAttribute("aria-hidden","false"),n&&[...n.children].forEach((u,g)=>{u.style.transitionDelay=`${g*35}ms`,u.classList.add("show")}))},o=()=>{e.classList.contains("is-open")&&(e.classList.remove("is-open"),a==null||a.setAttribute("aria-expanded","false"),n==null||n.setAttribute("aria-hidden","true"),n&&[...n.children].forEach(u=>{u.style.transitionDelay="0ms",u.classList.remove("show")}))},c=()=>e.classList.contains("is-open")?o():l();a==null||a.addEventListener("click",c),window.addEventListener("keydown",u=>{u.key==="Escape"&&o()}),document.addEventListener("click",u=>{!e.contains(u.target)&&e.classList.contains("is-open")&&o()}),i&&i.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(location.href),i.classList.add("copied"),setTimeout(()=>i.classList.remove("copied"),1200)}catch{}});const p=window.matchMedia("(min-width: 1024px)"),d=window.matchMedia("(prefers-reduced-motion: reduce)"),r=()=>{if(p.matches){const u=d.matches?0:120;setTimeout(l,u)}else o()};r(),(s=p.addEventListener)==null||s.call(p,"change",r)}const Zt={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_API_URL:"http://127.0.0.1:5000"},dt="ap-theme",ct="ap-sb-collapsed",Wt="aguaprev.profile",be=window.API_URL||typeof import.meta<"u"&&Zt&&"http://127.0.0.1:5000"||window.NEXT_PUBLIC_API_URL||"http://127.0.0.1:3001",w=(t,e)=>t.querySelector(e),q=(t,e)=>Array.from(t.querySelectorAll(e)),Qt=()=>{try{const t=localStorage.getItem("auth_user"),e=sessionStorage.getItem("auth_user");return JSON.parse(t||e||"null")}catch{return null}};function Xt(){return localStorage.getItem(dt)}function xe(t){const e=t==="dark"||!t&&matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",e),localStorage.setItem(dt,e?"dark":"light")}function ea(t){var e;xe(Xt()),(e=w(t,"#theme-toggle"))==null||e.addEventListener("click",()=>{xe(document.documentElement.classList.contains("dark")?"light":"dark")})}function we(){return localStorage.getItem(ct)==="1"}function ta(t){localStorage.setItem(ct,t?"1":"0")}function ye(t,e){var i;t.toggleAttribute("data-collapsed",e),t.classList.toggle("collapsed",e);const a=w(t,"#sb-logo-expanded"),n=w(t,"#sb-logo-collapsed");a&&n&&(a.classList.toggle("hidden",e),n.classList.toggle("hidden",!e)),q(t,"[data-sb-label]").forEach(l=>l.classList.toggle("hidden",e)),(i=w(t,"#sb-collapse"))==null||i.setAttribute("aria-label",e?"Expandir menu":"Comprimir menu"),document.body.classList.add("has-sidebar"),document.body.classList.toggle("sb-collapsed",e)}function pt(t,e){if(!t||!e)return;const a=e.getBoundingClientRect(),n=Math.min(260,t.scrollHeight||260),l=window.innerHeight-a.bottom>=n+16;t.classList.toggle("down",l),t.classList.toggle("up",!l)}function aa(){let t=document.getElementById("sb-popover-scrim");return t||(t=document.createElement("div"),t.id="sb-popover-scrim",t.className="hidden",document.body.appendChild(t)),t}function ut(t,e){const a=document.getElementById("sb-popover");if(!a||!t||!e)return;const n=aa();n.classList.remove("hidden"),n.onclick=A,a.innerHTML="";const i=e.cloneNode(!0);i.classList.remove("hidden"),i.style.position="static",i.style.inset="auto",a.appendChild(i);const l=t.getBoundingClientRect(),o=Math.max(240,t.offsetWidth),c=Math.min(l.right+10,window.innerWidth-o-8);let p=Math.min(320,window.innerHeight-16);a.style.maxHeight=`${p}px`;let d=l.top-8;d+p>window.innerHeight-8&&(d=window.innerHeight-p-8),d<8&&(d=8),Object.assign(a.style,{left:`${c}px`,top:`${d+window.scrollY}px`,width:`${o}px`}),a.classList.remove("hidden"),q(a,"[data-lang]").forEach(r=>{r.addEventListener("click",()=>{const s=r.getAttribute("data-lang")||"pt-BR";try{te(s)}catch{document.documentElement.lang=s,localStorage.setItem("ap-lang",s),k(document)}const u=document.querySelector("#lang-current");u&&(u.textContent=s),A()})}),q(a,"[data-sb-action]").forEach(r=>{r.addEventListener("click",()=>{mt(r.getAttribute("data-sb-action")),A()})}),window.addEventListener("keydown",r=>{r.key==="Escape"&&A()},{once:!0}),window.addEventListener("resize",A,{once:!0}),window.addEventListener("scroll",A,{once:!0,passive:!0})}function A(){const t=document.getElementById("sb-popover"),e=document.getElementById("sb-popover-scrim");t&&(t.classList.add("hidden"),t.innerHTML=""),e==null||e.classList.add("hidden")}function na(t){const e=w(t,"#lang-toggle"),a=w(t,"#lang-menu"),n=w(t,"#lang-current"),i=d=>{n&&(n.textContent=d)},l=()=>{a&&(pt(a,e),a.classList.remove("hidden"),e==null||e.setAttribute("aria-expanded","true"))},o=()=>{a&&(a.classList.add("hidden"),e==null||e.setAttribute("aria-expanded","false"))},c=()=>a!=null&&a.classList.contains("hidden")?l():o();e==null||e.addEventListener("click",d=>{const r=t.querySelector("#ap-sidebar")||t;r.hasAttribute("data-collapsed")||r.classList.contains("collapsed")?(d.preventDefault(),ut(e,a)):c()}),document.addEventListener("click",d=>{if(!a||!e||!t.contains(d.target))return;a.contains(d.target)||e.contains(d.target)||o()}),window.addEventListener("keydown",d=>{d.key==="Escape"&&(o(),A())}),q(a,".sb-dd-item").forEach(d=>{d.addEventListener("click",()=>{const r=d.getAttribute("data-lang")||"pt-BR";try{te(r)}catch{document.documentElement.lang=r,localStorage.setItem("ap-lang",r),k(document)}i(r),o()})});const p=localStorage.getItem("ap-lang")||"PT-BR";i(p)}function ra(t){const e=w(t,"#account-toggle"),a=w(t,"#account-menu"),n=()=>{a&&(pt(a,e),a.classList.remove("hidden"),e==null||e.setAttribute("aria-expanded","true"))},i=()=>{a&&(a.classList.add("hidden"),e==null||e.setAttribute("aria-expanded","false"))},l=()=>a!=null&&a.classList.contains("hidden")?n():i();e==null||e.addEventListener("click",o=>{const c=t.querySelector("#ap-sidebar")||t;c.hasAttribute("data-collapsed")||c.classList.contains("collapsed")?(o.preventDefault(),ut(e,a)):l()}),document.addEventListener("click",o=>{if(!a||!e||!t.contains(o.target))return;a.contains(o.target)||e.contains(o.target)||i()}),window.addEventListener("keydown",o=>{o.key==="Escape"&&(i(),A())}),q(a,"[data-sb-action]").forEach(o=>{o.addEventListener("click",()=>mt(o.getAttribute("data-sb-action")))})}function V(t){const e=Qt();let a={};try{a=JSON.parse(localStorage.getItem(Wt)||"{}")}catch{}const n=a.name||(e==null?void 0:e.name)||(e==null?void 0:e.fullName)||"Usuário",i=a.email||(e==null?void 0:e.email)||"email@exemplo.com",l=`${be}/avatars/svg/tone06.svg`,o=a.avatarDataUrl||(e==null?void 0:e.avatar)||l,c=/^(https?:|data:|blob:)/i.test(o)?o:`${be}${o.startsWith("/")?"":"/"}${o}`,p=w(t,"#sb-name"),d=w(t,"#sb-email"),r=w(t,"#sb-avatar"),s=w(t,"#sb-mini-avatar"),u=w(t,"#sb-mini-name");p&&(p.textContent=n),d&&(d.textContent=i);const g=(h,f)=>{h&&f&&(h.src=f)};g(r,c),g(s,c),u&&(u.textContent=n)}function mt(t){switch(t){case"profile":window.location.href="/profile.html";break;case"prefs":alert("Abrir Preferências");break;case"shortcuts":alert("Atalhos do teclado");break;case"help":window.location.href="/docs/";break;case"signout":localStorage.removeItem("auth_tokens"),localStorage.removeItem("auth_user"),localStorage.removeItem("auth_remember"),sessionStorage.removeItem("auth_tokens"),sessionStorage.removeItem("auth_user"),window.location.href="/login.html";break}}let ke=!1;function Ae(){if(ke)return;ke=!0;const t="/src/css/profile/profile.css";if(!document.querySelector(`link[rel="preload"][href="${t}"]`)&&!document.querySelector(`link[rel="stylesheet"][href="${t}"]`)){const a=document.createElement("link");a.rel="preload",a.as="style",a.href=t,document.head.appendChild(a)}const e="/src/js/profile/profile.page.js";if(!document.querySelector(`link[rel="modulepreload"][href="${e}"]`)){const a=document.createElement("link");a.rel="modulepreload",a.href=e,document.head.appendChild(a)}}function sa(t){var l,o;const e=w(t,"#ap-sidebar")||t;ea(e),na(e),ra(e),V(e),ye(e,we()),(l=w(e,"#sb-collapse"))==null||l.addEventListener("click",()=>{const c=!(e.hasAttribute("data-collapsed")||e.classList.contains("collapsed"));ye(e,c),ta(c),A()});const a=c=>{c&&(c.hasAttribute("tabindex")||c.setAttribute("tabindex","0"),c.addEventListener("keydown",p=>{p.key==="Enter"||p.key}),c.addEventListener("mouseenter",Ae,{once:!0,passive:!0}),c.addEventListener("focus",Ae,{once:!0}))};a(w(e,"#sb-avatar")),a(w(e,"#sb-mini-avatar")),a(w(e,"#sb-profile-btn")),a(w(e,"#sb-avatar-link")),window.addEventListener("auth:login",()=>V(e)),window.addEventListener("profile:avatar-updated",()=>V(e)),window.addEventListener("profile:updated",()=>V(e));const n=matchMedia("(max-width: 1023px)"),i=()=>{n.matches?(document.body.classList.remove("has-sidebar","sb-collapsed"),A()):(document.body.classList.add("has-sidebar"),document.body.classList.toggle("sb-collapsed",we()))};i(),(o=n.addEventListener)==null||o.call(n,"change",i),window.addEventListener("resize",A)}function ia(t){return t||document.querySelector("#ap-content")||document.querySelector("#app-page")||document}function oa(t){const e=ia(t);if(!e||e.dataset.seriesPageReady==="1")return;e.dataset.seriesPageReady="1";const a=e.querySelector("#series-chart")||e.querySelector("#series-chart-root")||e.querySelector("#series-root")||e;requestAnimationFrame(()=>{new IntersectionObserver(async(i,l)=>{if(!i[0]||!i[0].isIntersecting)return;l.disconnect();const o=await R(()=>import("./series.effects-Bju29uDz.js"),[],import.meta.url);typeof o.initSeriesEffects=="function"?o.initSeriesEffects(e):typeof o.initSeriesCharts=="function"&&o.initSeriesCharts(e),e.dataset.seriesEffectsLoaded="1"},{rootMargin:"120px 0px"}).observe(a),setTimeout(async()=>{if(e.dataset.seriesEffectsLoaded==="1")return;const i=await R(()=>import("./series.effects-Bju29uDz.js"),[],import.meta.url);typeof i.initSeriesEffects=="function"?i.initSeriesEffects(e):typeof i.initSeriesCharts=="function"&&i.initSeriesCharts(e),e.dataset.seriesEffectsLoaded="1"},1500)})}function la(t){return t||document.querySelector("#ap-content")||document.querySelector("#app-page")||document}function da(t){const e=la(t);if(!e||e.dataset.mapsPageReady==="1")return;e.dataset.mapsPageReady="1";const a=e.querySelector("#map-container")||e.querySelector("#maps-root")||e;requestAnimationFrame(()=>{new IntersectionObserver(async(i,l)=>{if(!i[0]||!i[0].isIntersecting)return;l.disconnect();const o=await R(()=>import("./maps.effects-DOpCLyNw.js"),[],import.meta.url);typeof o.initMapsEffects=="function"&&o.initMapsEffects(e),e.dataset.mapsEffectsLoaded="1"},{rootMargin:"120px 0px"}).observe(a),setTimeout(async()=>{if(e.dataset.mapsEffectsLoaded==="1")return;const i=await R(()=>import("./maps.effects-DOpCLyNw.js"),[],import.meta.url);typeof i.initMapsEffects=="function"&&i.initMapsEffects(e),e.dataset.mapsEffectsLoaded="1"},1500)})}function ca(t){return t||document.querySelector("#ap-content")||document.querySelector("#app-page")||document}function pa(t){const e=ca(t);if(!e||e.dataset.comparePageReady==="1")return;e.dataset.comparePageReady="1";const a=e.querySelector("#compare-root")||e.querySelector("#cmp-chart-overlay")||e;requestAnimationFrame(()=>{new IntersectionObserver(async(i,l)=>{if(!i[0]||!i[0].isIntersecting)return;l.disconnect();const o=await R(()=>import("./compare.effects-C5uEe2XU.js"),[],import.meta.url);typeof o.initCompareEffects=="function"&&o.initCompareEffects(e),e.dataset.compareEffectsLoaded="1"},{rootMargin:"120px 0px"}).observe(a),setTimeout(async()=>{if(e.dataset.compareEffectsLoaded==="1")return;const i=await R(()=>import("./compare.effects-C5uEe2XU.js"),[],import.meta.url);typeof i.initCompareEffects=="function"&&i.initCompareEffects(e),e.dataset.compareEffectsLoaded="1"},1500)})}function ua(t){return t||document.querySelector("#ap-content")||document.querySelector("#app-page")||document}function ma(t){const e=ua(t);if(!e||e.dataset.alertsPageReady==="1")return;e.dataset.alertsPageReady="1";const a=e.querySelector("#alerts-root")||e.querySelector("#al-tbody")||e;requestAnimationFrame(()=>{new IntersectionObserver(async(i,l)=>{if(!i[0]||!i[0].isIntersecting)return;l.disconnect();const o=await R(()=>import("./alerts.effects-yjpqd_ZR.js"),[],import.meta.url);typeof o.initAlertsEffects=="function"&&o.initAlertsEffects(e),e.dataset.alertsEffectsLoaded="1"},{rootMargin:"120px 0px"}).observe(a),setTimeout(async()=>{if(e.dataset.alertsEffectsLoaded==="1")return;const i=await R(()=>import("./alerts.effects-yjpqd_ZR.js"),[],import.meta.url);typeof i.initAlertsEffects=="function"&&i.initAlertsEffects(e),e.dataset.alertsEffectsLoaded="1"},1500)})}function ga(t){return t||document.querySelector("#ap-content")||document.querySelector("#app-page")||document}function ha(t){const e=ga(t);if(!e||e.dataset.reportsPageReady==="1")return;e.dataset.reportsPageReady="1";const a=e.querySelector("#reports-root")||e;new IntersectionObserver(async(i,l)=>{if(!i[0]||!i[0].isIntersecting)return;l.disconnect(),(await R(()=>import("./reports.effects-Cr-NTxos.js"),[],import.meta.url)).initReportsEffects(e)},{rootMargin:"120px 0px"}).observe(a)}function fa(t){t&&console.info("Tutorial page initialized (placeholder).")}const va={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_API_URL:"http://127.0.0.1:5000"},gt="aguaprev.profile",ht="aguaprev.pwd_hash",ft="aguaprev.activity",C="/src/assets/img/avatar-default.png",vt="changeme",ba=window.API_URL||typeof import.meta<"u"&&va&&"http://127.0.0.1:5000"||window.NEXT_PUBLIC_API_URL||"http://127.0.0.1:3001",Re="auth_tokens";function v(t,e){return t.querySelector(e)}function xa(t){const e=document.getElementById("pf-status");e&&(e.textContent=t)}function B(t){xa(t);const e=document.createElement("div");e.textContent=t,e.className="fixed bottom-4 right-4 z-[60] px-3 py-2 rounded-xl text-sm bg-black/80 text-white shadow-lg",document.body.appendChild(e),setTimeout(()=>e.remove(),2e3)}function S(){try{return JSON.parse(localStorage.getItem(gt)||"{}")}catch{return{}}}function j(t){localStorage.setItem(gt,JSON.stringify(t))}function I(){try{const t=localStorage.getItem("auth_user");if(t)return JSON.parse(t);const e=sessionStorage.getItem("auth_user");return JSON.parse(e||"null")}catch{return null}}function U(t){try{const e=JSON.stringify(t||{});localStorage.setItem("auth_user",e),sessionStorage.setItem("auth_user",e)}catch{}}function wa(){try{const t=localStorage.getItem(Re);if(t)return JSON.parse(t);const e=sessionStorage.getItem(Re);return JSON.parse(e||"null")}catch{return null}}function bt(){try{return JSON.parse(localStorage.getItem(ft)||"[]")}catch{return[]}}function ya(t){localStorage.setItem(ft,JSON.stringify(t||[]))}function J(t,e){const a=bt();a.unshift({type:t,ts:Date.now(),meta:e||null}),ya(a.slice(0,50))}function ka(t){const e=new Date(t);return e.toLocaleDateString("pt-BR")+" "+e.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}function Y(t){if(!t)return;const e=bt();if(!e.length){t.innerHTML="<li>• Sem atividades registradas ainda.</li>";return}const a=n=>({login:"Login bem-sucedido",profile_update:"Perfil atualizado",password_change:"Senha alterada"})[n]||n;t.innerHTML=e.slice(0,6).map(n=>`• ${a(n.type)} — ${ka(n.ts)}`).map(n=>`<li>${n}</li>`).join("")}async function O(t){const e=new TextEncoder().encode(t||""),a=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(a)).map(n=>n.toString(16).padStart(2,"0")).join("")}async function xt(){return localStorage.getItem(ht)||""}async function wt(t){t&&localStorage.setItem(ht,t)}async function Aa(){await xt()||await wt(await O(vt))}const yt=Aa();async function X(t,e={}){const a=t.startsWith("http")?t:`${ba}${t.startsWith("/")?"":"/"}${t}`,n=new Headers(e.headers||{}),i=wa(),l=i==null?void 0:i.access;l&&n.set("Authorization",`Bearer ${l}`),!(e.body instanceof FormData)&&!n.has("Content-Type")&&n.set("Content-Type","application/json");const o=await fetch(a,{...e,headers:n}),p=(o.headers.get("content-type")||"").includes("application/json")?await o.json().catch(()=>null):null;if(!o.ok){const d=(p==null?void 0:p.message)||(p==null?void 0:p.error)||`Erro ${o.status}`,r=new Error(d);throw r.status=o.status,r.data=p,r}return p}async function kt(t){await yt;const e=await xt();if(!e)return!0;const a=(t??"").toString(),n=await O(a),i=await O(a.trim()),l=await O(vt);return e===n||e===i||e===l&&(!a||n===l||i===l)}async function Ra(t,e){if(!await kt(t))throw new Error("Senha atual incorreta.");await wt(await O(e))}async function Ea(t,e,a){try{const i=(await X("/meta/funcoes")).items||[];t.innerHTML=i.map(o=>`<option value="${o.id}">${o.label}</option>`).join(""),i.find(o=>o.id==="outro")||t.insertAdjacentHTML("beforeend",'<option value="outro">Outro</option>');const l=a&&!i.some(o=>o.id===a);t.value=l?"outro":a||"pesquisador",e.classList.toggle("hidden",!l),l&&(e.value=a||"")}catch{t.innerHTML=`
      <option value="pesquisador">Pesquisador(a)</option>
      <option value="engenheiro">Engenheiro(a)</option>
      <option value="tecnico">Técnico(a)</option>
      <option value="gestor">Gestor(a)</option>
      <option value="estudante">Estudante</option>
      <option value="outro">Outro</option>`,t.value=a,e.classList.toggle("hidden",t.value!=="outro")}t.addEventListener("change",()=>{const n=t.value==="outro";e.classList.toggle("hidden",!n),n||(e.value="")})}function Ba(t){var i,l,o,c,p,d,r,s,u,g,h,f,m;const e=v(t,"#pf-role"),a=v(t,"#pf-role-other"),n=(e==null?void 0:e.value)==="outro"?((i=a==null?void 0:a.value)==null?void 0:i.trim())||"outro":(e==null?void 0:e.value)||"";return{name:((o=(l=v(t,"#pf-name"))==null?void 0:l.value)==null?void 0:o.trim())||"",email:((p=(c=v(t,"#pf-email"))==null?void 0:c.value)==null?void 0:p.trim())||"",org:((r=(d=v(t,"#pf-org"))==null?void 0:d.value)==null?void 0:r.trim())||"",role:n,phone:((u=(s=v(t,"#pf-phone"))==null?void 0:s.value)==null?void 0:u.trim())||"",lang:((g=v(t,"#pf-lang"))==null?void 0:g.value)||"pt-BR",dark:!!((h=v(t,"#pf-dark"))!=null&&h.checked),alerts:!!((f=v(t,"#pf-alerts"))!=null&&f.checked),avatarDataUrl:((m=v(t,"#pf-avatar-preview"))==null?void 0:m.src)||C}}function Z(t,e){if(!e)return;const a=(c,p)=>{const d=v(t,c);d&&(d.value=p??"")};a("#pf-name",e.name),a("#pf-email",e.email),a("#pf-org",e.org),a("#pf-phone",e.phone);const n=v(t,"#pf-lang");n&&(n.value=e.lang||"pt-BR");const i=v(t,"#pf-dark");i&&(i.checked=!!e.dark);const l=v(t,"#pf-alerts");l&&(l.checked=!!e.alerts);const o=v(t,"#pf-avatar-preview");o&&(o.src=e.avatarDataUrl||C)}function Ca(t,e){const a=t||"";return!a&&!e?{ok:!0,msg:""}:a.length<8?{ok:!1,msg:"Senha muito curta."}:a!==e?{ok:!1,msg:"Confirmação não confere."}:{ok:!0,msg:""}}function _a(t,e,a){if(!t||!e)return;if(t.size>5*1024*1024){B("Imagem acima de 5MB.");return}const n=new FileReader;n.onload=()=>{e.src=n.result,typeof a=="function"&&a(n.result)},n.readAsDataURL(t)}async function Sa(t){return null}function Pa(t){var o,c,p,d,r;const e={save:v(t,"#pf-save"),reset:v(t,"#pf-reset"),avatarFile:v(t,"#pf-avatar"),avatarRemove:v(t,"#pf-avatar-remove"),avatarPreview:v(t,"#pf-avatar-preview"),avatarToneBtn:v(t,"[data-pf-avatar-tone]"),passCur:v(t,"#pf-pass-current"),passNew:v(t,"#pf-pass-new"),passCnf:v(t,"#pf-pass-confirm"),activity:v(t,"#pf-activity"),name:v(t,"#pf-name"),roleSel:v(t,"#pf-role"),roleOther:v(t,"#pf-role-other")},a={name:"Usuário AguaPrev",email:"usuario@exemplo.com",org:"Universidade de Brasília",role:"pesquisador",phone:"(61) 9 9999-9999",lang:"pt-BR",dark:!1,alerts:!0,avatarDataUrl:C},n=I(),i=n?{name:n.name||n.fullName||a.name,email:n.email||a.email,avatarDataUrl:n.avatar||a.avatarDataUrl,role:n.role||a.role}:{},l={...a,...i,...S()};Z(t,l),e.roleSel&&e.roleOther&&Ea(e.roleSel,e.roleOther,l.role||"pesquisador").catch(()=>{}),l.dark&&document.documentElement.classList.add("dark"),(o=e.avatarFile)==null||o.addEventListener("change",async s=>{var g;const u=(g=s.target.files)==null?void 0:g[0];u&&(_a(u,e.avatarPreview,h=>{const m={...S(),avatarDataUrl:h};j(m);const y={...I()||{},avatar:h};U(y),window.dispatchEvent(new CustomEvent("profile:avatar-updated",{detail:{avatar:h}})),B("Avatar atualizado (salvo localmente).")}),s.target.value="")}),(c=e.avatarRemove)==null||c.addEventListener("click",()=>{e.avatarPreview.src=C;const s=S();j({...s,avatarDataUrl:C});const u=I()||{};U({...u,avatar:C}),window.dispatchEvent(new CustomEvent("profile:avatar-updated",{detail:{avatar:C}})),B("Avatar removido.")}),(p=e.avatarToneBtn)==null||p.addEventListener("click",async()=>{try{const u=(await X("/avatars")).items||[],g=prompt(`Escolha o ID do tom de avatar:
`+u.map(m=>`- ${m.id} (${m.label})`).join(`
`)+`
Ex.: tone03`);if(!g)return;const f=(await X("/users/me/avatar-select",{method:"POST",body:JSON.stringify({id:g})})).user;if(f!=null&&f.avatar){e.avatarPreview&&(e.avatarPreview.src=f.avatar);const m=S();j({...m,avatarDataUrl:f.avatar});const x=I()||{};U({...x,avatar:f.avatar}),window.dispatchEvent(new CustomEvent("profile:avatar-updated",{detail:{avatar:f.avatar}})),B("Avatar definido.")}}catch{B("Não foi possível definir o avatar")}}),(d=e.save)==null||d.addEventListener("click",async()=>{var _,E,H,N,ne,re;await yt;const s=Ba(t),u=(((_=e.passCur)==null?void 0:_.value)||"").toString(),g=(((E=e.passNew)==null?void 0:E.value)||"").toString(),h=(((H=e.passCnf)==null?void 0:H.value)||"").toString(),f=Ca(g,h);if(!f.ok){B(f.msg),(N=e.passNew||e.passCnf)==null||N.focus();return}if(g){if(!await kt(u)){B("Senha atual incorreta."),(ne=e.passCur)==null||ne.focus();return}try{await Ra(u,g),J("password_change")}catch(G){B((G==null?void 0:G.message)||"Erro ao alterar senha.");return}}document.documentElement.classList.toggle("dark",!!s.dark),j({...S(),...s});const m=await Sa();m!=null&&m.avatar&&(s.avatarDataUrl=m.avatar,e.avatarPreview&&(e.avatarPreview.src=m.avatar),window.dispatchEvent(new CustomEvent("profile:avatar-updated",{detail:{avatar:m.avatar}})));const x=I()||{},y={...x,name:s.name||x.name||x.fullName,fullName:s.name||x.fullName||x.name,email:s.email||x.email,role:s.role||x.role,avatar:S().avatarDataUrl||s.avatarDataUrl||x.avatar||C};U(y),window.dispatchEvent(new CustomEvent("auth:login",{detail:{user:y}})),window.dispatchEvent(new CustomEvent("profile:avatar-updated",{detail:{avatar:y.avatar}})),window.dispatchEvent(new CustomEvent("profile:updated",{detail:{user:y}})),J("profile_update"),e.passCur&&(e.passCur.value=""),e.passNew&&(e.passNew.value=""),e.passCnf&&(e.passCnf.value=""),B(g?"Perfil e senha atualizados.":"Perfil atualizado."),(re=e.name)==null||re.focus(),Y(e.activity)}),(r=e.reset)==null||r.addEventListener("click",()=>{var s;Z(t,S()||{...a,...i}),B("Alterações descartadas."),(s=e.name)==null||s.focus()}),Y(e.activity),window.addEventListener("auth:login",s=>{var g,h;J("login",{uid:((h=(g=s==null?void 0:s.detail)==null?void 0:g.user)==null?void 0:h.id)||null}),Y(e.activity);const u=I();u&&Z(t,{...S(),name:u.name||u.fullName,email:u.email,avatarDataUrl:u.avatar||C})})}function b(t,e){const a=document.querySelector(t);return a?(a.innerHTML=e,a):null}var qe,ze;const M=((ze=(qe=document.body)==null?void 0:qe.dataset)==null?void 0:ze.page)||"",T=(document.title||"").toLowerCase(),D=M==="dashboard";var Ve,je;const La=M==="series"||((je=(Ve=document.body)==null?void 0:Ve.classList)==null?void 0:je.contains("page-series"))||/s[ée]ries/.test(T)||!!document.querySelector("[data-page-series]");var Ue,$e;const Ma=M==="maps"||(($e=(Ue=document.body)==null?void 0:Ue.classList)==null?void 0:$e.contains("page-maps"))||/mapa|mapas/.test(T)||!!document.querySelector("[data-page-maps]");var Ge,Ke;const Ta=M==="compare"||((Ke=(Ge=document.body)==null?void 0:Ge.classList)==null?void 0:Ke.contains("page-compare"))||/comparar|comparação|compare/.test(T)||!!document.querySelector("[data-page-compare]");var Je,Ye;const Da=M==="alerts"||((Ye=(Je=document.body)==null?void 0:Je.classList)==null?void 0:Ye.contains("page-alerts"))||/alerta|alertas/.test(T)||!!document.querySelector("[data-page-alerts]");var Ze,We;const Ia=M==="reports"||((We=(Ze=document.body)==null?void 0:Ze.classList)==null?void 0:We.contains("page-reports"))||/relat[óo]rio|relatorios|reports/.test(T)||!!document.querySelector("[data-page-reports]");var Qe,Xe;const Ha=M==="tutorial"||((Xe=(Qe=document.body)==null?void 0:Qe.classList)==null?void 0:Xe.contains("page-tutorial"))||/tutorial/.test(T)||!!document.querySelector("[data-page-tutorial]");var et,tt;const Na=M==="profile"||((tt=(et=document.body)==null?void 0:et.classList)==null?void 0:tt.contains("page-profile"))||/perfil|profile/.test(T)||!!document.querySelector("[data-page-profile]"),Fa=b("#app-header",Et),Ee=b("#app-footer",Bt),Oa=b("#app-social-floating",Ct),Be=b("#app-sidebar-root",_t),Ce=b("#app-hero",St);b("#app-truststrip",Pt);const _e=b("#app-highlights",Lt),Se=b("#app-map-preview",Mt),Pe=b("#app-how",Tt),Le=b("#app-auth-login",Dt),Me=b("#app-auth-register",It),Te=!D&&La?b("#ap-content",ie)||b("#app-page",ie):null,De=!D&&Ma?b("#ap-content",oe)||b("#app-page",oe):null,Ie=!D&&Ta?b("#ap-content",le)||b("#app-page",le):null,He=!D&&Da?b("#ap-content",de)||b("#app-page",de):null,Ne=!D&&Ia?b("#ap-content",ce)||b("#app-page",ce):null,Fe=!D&&Ha?b("#ap-content",pe)||b("#app-page",pe):null,Oe=!D&&Na?b("#ap-content",ue)||b("#app-page",ue):null;(async()=>{if(Fa){const{initHeaderNav:t}=await R(async()=>{const{initHeaderNav:e}=await import("./header-nav-xNbnlgxA.js");return{initHeaderNav:e}},[],import.meta.url);t()}if(Ee){const{initFooter:t}=await R(async()=>{const{initFooter:e}=await import("./footer-e6RUufaJ.js");return{initFooter:e}},[],import.meta.url);t(Ee)}})();k(document);rt();requestAnimationFrame(()=>{requestAnimationFrame(()=>{Be&&sa(Be),Ce&&Ht(Ce),_e&&Nt(_e),Se&&Ft(Se),Pe&&Ot(Pe),Le&&$t(Le),Me&&Q(Me),Te&&oa(Te),De&&da(De),Ie&&pa(Ie),He&&ma(He),Ne&&ha(Ne),Fe&&fa(Fe),Oe&&Pa(Oe),Oa&&Yt(document)})});window.addEventListener("hashchange",()=>k(document));export{R as _,za as i};
