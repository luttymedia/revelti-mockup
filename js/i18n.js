/**
 * Revelti Client-Side i18n Engine
 * Supports automatic browser language detection (es fallback) & localStorage persistence
 */
(function () {
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'revelti_lang';

  class I18nEngine {
    constructor() {
      this.translations = {
        en: {
          "meta": {
            "title": "Revelti - The event doesn't end when the music stops.",
            "description": "Revelti is the all-in-one platform for event organizers, creatives, and attendees. Stop juggling tools. Join the waitlist and be the first to experience it.",
            "og_title": "Revelti - The event doesn't end when the music stops.",
            "og_description": "One platform. Organizers. Creatives. Attendees. Memories that live forever. Join the waitlist."
          },
          "nav": {
            "organizer": "Organizer",
            "creative": "Creative",
            "attendee": "Attendee",
            "join_waitlist": "Join Waitlist",
            "toggle_menu_aria": "Toggle mobile menu"
          },
          "chapter": {
            "page_sections_aria": "Page sections",
            "start": "Start",
            "problem": "The Problem",
            "organizer": "Organizer",
            "creative": "Creative",
            "attendee": "Attendee",
            "together": "Together",
            "join": "Join"
          },
          "hero": {
            "badge": "Coming Soon - Join the Waitlist",
            "headline_line1": "The event <br class=\"hero-br-mobile\">doesn't end",
            "headline_line2": "when the <br class=\"hero-br-mobile\">music stops.",
            "sub": "<strong class=\"brand-highlight\">Revelti</strong> is one ridiculously simple platform where event organizers <span class=\"highlight-main\">run the show</span>, creatives <span class=\"highlight-main\">get their spotlight</span>, and attendees <span class=\"highlight-main\">relive the night forever</span>.",
            "picker_title": "Choose your role",
            "org_tag": "Organizer",
            "org_card_title": "Run the Show",
            "org_card_desc": "<span class=\"highlight-org\">Ticketing</span>, <span class=\"highlight-org\">audience email</span>, <span class=\"highlight-org\">collaborator management</span>, <span class=\"highlight-org\">stats</span> and <span class=\"highlight-org\">event galleries</span> in one beautiful place.",
            "cre_tag": "Creative",
            "cre_card_title": "Own the Spotlight",
            "cre_card_desc": "No more WeTransfer links. <span class=\"highlight-cre\">Cloud storage</span>, <span class=\"highlight-cre\">seamless delivery</span> and <span class=\"highlight-cre\">automatic portfolio building</span> with <span class=\"highlight-cre\">customized galleries</span>.",
            "att_tag": "Attendee",
            "att_card_title": "Relive the Night",
            "att_card_desc": "<span class=\"highlight-att\">Buy tickets</span>, access event schedules, <span class=\"highlight-att\">see who's going</span>, and get direct photo updates instantly.",
            "explore_cta": "Explore Features &rarr;",
            "scroll_hint": "Scroll"
          },
          "problem": {
            "label": "The old way",
            "headline": "Events shouldn't feel<br>like organized chaos.",
            "body": "We're juggling too many apps, <span class=\"highlight-main\">link sharing services</span>, <span class=\"highlight-main\">messaging threads</span>, and <span class=\"highlight-main\">expired folder links</span>. It's a hassle for everyone involved.",
            "pain_org": "<strong>Organizers:</strong> Juggling separate <span class=\"highlight-org\">ticket pages</span>, <span class=\"highlight-org\">group messages</span>, and <span class=\"highlight-org\">spreadsheets</span>.",
            "pain_cre": "<strong>Creatives:</strong> Chasing organizers, paying for <span class=\"highlight-cre\">expiring folder links</span>, <span class=\"highlight-cre\">losing exposure</span>.",
            "pain_att": "<strong>Attendees:</strong> <span class=\"highlight-att\">Lost ticket emails</span>, missing event info, and <span class=\"highlight-att\">hunting for photos</span> afterwards.",
            "tool_1": "📁 Expired WeTransfer Link",
            "tool_2": "💬 WhatsApp group spam (1,247)",
            "tool_3": "🎟️ Where is my ticket email?",
            "tool_4": "💸 Bank transfer refs search",
            "tool_5": "📧 Separate email newsletters",
            "tool_6": "📂 Lost Google Drive Folder",
            "tool_7": "📊 Excel checklist v12.xlsx"
          },
          "organizer": {
            "label": "For Organizers",
            "headline": "Your event,<br><span style=\"background:linear-gradient(90deg,var(--organizer-accent) 0%,#7cb4ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;\">without the chaos.</span>",
            "body": "You've got enough on your plate. <strong class=\"brand-highlight\">Revelti</strong> handles the moving parts - <span class=\"highlight-org\">tickets</span>, <span class=\"highlight-org\">crowd comms</span>, <span class=\"highlight-org\">media team</span>, and <span class=\"highlight-org\">real-time stats</span> - so you can focus on making the night unforgettable.",
            "feat1_title": "Effortless ticketing & sales",
            "feat1_desc": "Set up your event, <span class=\"highlight-org\">manage ticket tiers</span>, and <span class=\"highlight-org\">track sales live</span>. No spreadsheets. It just works.",
            "feat2_title": "Direct audience connection",
            "feat2_desc": "Keep your crowd <span class=\"highlight-org\">in the loop</span> before, during, and after the event - all from <span class=\"highlight-org\">one dashboard</span>.",
            "feat3_title": "Your media team, synced",
            "feat3_desc": "Connect directly with your photographers. Their work goes <span class=\"highlight-org\">straight into the official event gallery</span>. Done.",
            "feat4_title": "Know exactly how you did",
            "feat4_desc": "Beautiful, easy-to-read <span class=\"highlight-org\">stats</span> on everything from ticket sales to <span class=\"highlight-org\">post-event engagement</span>. Know your numbers.",
            "cta": "Reserve Organizer Access →"
          },
          "creative": {
            "label": "For Creatives",
            "headline": "Overhaul your workspace.<br><span style=\"background:linear-gradient(90deg,var(--creative-accent) 0%,#a855f7 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;\">Own the event spotlight.</span>",
            "body": "You're not just taking photos — you're capturing memories. <strong class=\"brand-highlight\">Revelti</strong> replaces <span class=\"highlight-cre\">expired links</span> and <span class=\"highlight-cre\">messy handoffs</span> with a visual ecosystem that stores your shots, <span class=\"highlight-cre\">delivers them instantly</span>, and puts <span class=\"highlight-cre\">your brand</span> in front of every attendee.",
            "feat1_title": "Storage meets presentation",
            "feat1_desc": "Your workspace and your gallery in one place. <span class=\"highlight-cre\">Upload your media files</span>, <span class=\"highlight-cre\">export polished albums</span> — all in one platform.",
            "feat2_title": "No more transfer links",
            "feat2_desc": "Deliver media directly to the official event. <span class=\"highlight-cre\">No expiring links</span>, <span class=\"highlight-cre\">no lost folders</span>, no messy DMs.",
            "feat3_title": "Automatic exposure",
            "feat3_desc": "Every attendee looking for their photos sees <span class=\"highlight-cre\">your profile</span> and <span class=\"highlight-cre\">your art</span>. Thousands of organic eyes.",
            "feat4_title": "A portfolio that does you justice",
            "feat4_desc": "A stunning <span class=\"highlight-cre\">public profile</span> to send to every future client — <span class=\"highlight-cre\">built automatically</span> from the events you shoot.",
            "cta": "Claim Your Creative Studio →"
          },
          "attendee": {
            "label": "For Attendees",
            "headline": "Buy tickets, get updates, and find your photos. <span style=\"background:linear-gradient(90deg,var(--attendee-accent) 0%,#ff9f50 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;\">All in one app.</span>",
            "body": "Stop hunting through your email for <span class=\"highlight-att\">lost tickets</span> or searching social media for <span class=\"highlight-att\">event photos</span>. <strong class=\"brand-highlight\">Revelti</strong> lets you securely buy your ticket and <span class=\"highlight-att\">handles everything else automatically</span>.",
            "feat1_title": "Buy your ticket and check in",
            "feat1_desc": "Find your favorite dance events, <span class=\"highlight-att\">purchase tickets securely</span>, and instantly get your <span class=\"highlight-att\">entry QR code</span> inside the app. No lost confirmation emails.",
            "feat2_title": "See the event schedule",
            "feat2_desc": "Access up-to-date <span class=\"highlight-att\">timetables</span>, FAQ, and <span class=\"highlight-att\">live announcements</span> from the organizers so you never miss a workshop or a party.",
            "feat3_title": "Meet your friends",
            "feat3_desc": "Connect with your <span class=\"highlight-att\">dance community</span> and see exactly <span class=\"highlight-att\">who else is going</span> before you even buy your pass.",
            "feat4_title": "Get your photos & videos fast",
            "feat4_desc": "No more hunting down expired links and social media. The moment the party gallery is uploaded, they go <span class=\"highlight-att\">straight to your app profile</span>.",
            "cta": "Join the Attendee Waitlist →",
            "interact_hint": "👆 Interact with the mockup",
            "att_title_0": "My Ticket",
            "att_title_1": "Event Companion",
            "att_title_2": "Friends",
            "att_title_3": "Photos Ready!"
          },
          "ecosystem": {
            "label": "Better together",
            "headline": "When everyone's<br>on the same stage,<br><span class=\"headline-accent\">the magic happens.</span>",
            "body": "<strong class=\"brand-highlight\">Revelti</strong> is a triangle, not a line. Organizers, creatives, and attendees all share the <span class=\"highlight-main\">same platform</span> - <span class=\"highlight-main\">connected</span>, <span class=\"highlight-main\">in sync</span>, and always <span class=\"highlight-main\">in the loop</span>.",
            "org_tag": "Organizer",
            "org_title": "Organizer",
            "org_body": "Sets up events, <span class=\"highlight-org\">sells tickets</span>, broadcasts to the crowd, and <span class=\"highlight-org\">manages their media team</span> - all without leaving the platform.",
            "cre_tag": "Creative",
            "cre_title": "Creative",
            "cre_body": "<span class=\"highlight-cre\">Stores and delivers media</span> directly to the event. Their work is seen by every single attendee - <span class=\"highlight-cre\">automatically</span>.",
            "att_tag": "Attendee",
            "att_title": "Attendee",
            "att_body": "<span class=\"highlight-att\">Buys their ticket</span>, gets the updates, <span class=\"highlight-att\">finds their photos</span> - and relives the night, long after it's over.",
            "link_cta": "Explore perspective"
          },
          "waitlist": {
            "eyebrow": "Limited Early Access",
            "headline": "Be the first to<br>experience <span class=\"headline-accent\">Revelti.</span>",
            "sub": "We're putting the finishing touches on something special. <span class=\"highlight-main\">Join the waitlist today</span> and lock in <span class=\"highlight-main\">early access perks</span> based on your profile.",
            "instruction": "Select your profile to continue:",
            "role_required_error": "⚠️ Please select a profile before joining.",
            "role_org": "Organizer",
            "role_cre": "Creative",
            "role_att": "Attendee",
            "email_placeholder": "your@email.com",
            "email_aria": "Email address",
            "submit_btn": "Join the Waitlist",
            "submit_btn_loading": "Adding you...",
            "perk1": "<span class=\"perk-check\">✦</span> Profile-specific beta access",
            "perk2": "<span class=\"perk-check\">✦</span> Early bird perks lock-in",
            "perk3": "<span class=\"perk-check\">✦</span> Founding member label"
          },
          "fomo": {
            "text": "people already on the waitlist"
          },
          "footer": {
            "rights": "© 2025 <strong class=\"brand-highlight\">Revelti</strong>. All rights reserved.",
            "disclaimer": "Mockups shown are illustrative. Final product may vary.",
            "terms": "Terms & Conditions",
            "privacy": "Privacy Policy"
          },
          "terms": {
            "title": "Terms & Conditions - Revelti",
            "heading": "Terms & Conditions",
            "placeholder": "The Terms & Conditions content will be added soon. Stay tuned!",
            "back_home": "← Back to Home"
          },
          "privacy": {
            "title": "Privacy Policy - Revelti",
            "heading": "Privacy Policy",
            "placeholder": "The Privacy Policy content will be added soon. Stay tuned!",
            "back_home": "← Back to Home"
          },
          "modal": {
            "success_title": "You're on the list!",
            "success_body": "You just locked in your spot as an <strong id=\"modal-role-label\">{role}</strong>.<br><strong class=\"brand-highlight\">Exclusive early-bird perks</strong> are yours - we'll reach out before anyone else when <strong class=\"brand-highlight\">Revelti</strong> launches.<br><br>Tell your people. The night doesn't end here. 🔥",
            "success_close": "Let's go! 🚀",
            "role_organizer": "Organizer",
            "role_creative": "Creative",
            "role_attendee": "Attendee",
            "mobile_hint_next": "Tap image for next, or click outside to return.",
            "mobile_hint_interact": "Interact with the screen. Tap ✕ or click outside to return.",
            "desktop_hint": "Click image for next, or click outside to return."
          }
        },
        es: {
          "meta": {
            "title": "Revelti - El evento no termina cuando la música se para.",
            "description": "Revelti es la plataforma todo en uno para organizadores de eventos, creativos y asistentes. Deja de hacer malabares con herramientas. Únete a la lista de espera y sé el primero en vivirlo.",
            "og_title": "Revelti - El evento no termina cuando la música se para.",
            "og_description": "Una plataforma. Organizadores. Creativos. Asistentes. Recuerdos para siempre. Únete a la lista de espera."
          },
          "nav": {
            "organizer": "Organizador",
            "creative": "Creativo",
            "attendee": "Asistente",
            "join_waitlist": "Unirse a la lista",
            "toggle_menu_aria": "Alternar menú móvil"
          },
          "chapter": {
            "page_sections_aria": "Secciones de la página",
            "start": "Inicio",
            "problem": "El Problema",
            "organizer": "Organizador",
            "creative": "Creativo",
            "attendee": "Asistente",
            "together": "Juntos",
            "join": "Unirse"
          },
          "hero": {
            "badge": "Próximamente - Únete a la lista de espera",
            "headline_line1": "El evento <br class=\"hero-br-mobile\">no termina",
            "headline_line2": "cuando la música <br class=\"hero-br-mobile\">se para.",
            "sub": "<strong class=\"brand-highlight\">Revelti</strong> es una plataforma increíblemente sencilla donde los organizadores <span class=\"highlight-main\">dirigen el espectáculo</span>, los creativos <span class=\"highlight-main\">brillan con luz propia</span> y los asistentes <span class=\"highlight-main\">reviven la noche para siempre</span>.",
            "picker_title": "Elige tu rol",
            "org_tag": "Organizador",
            "org_card_title": "Dirige el Espectáculo",
            "org_card_desc": "<span class=\"highlight-org\">Venta de entradas</span>, <span class=\"highlight-org\">email a la audiencia</span>, <span class=\"highlight-org\">gestión de colaboradores</span>, <span class=\"highlight-org\">estadísticas</span> y <span class=\"highlight-org\">galerías de eventos</span> en un solo lugar.",
            "cre_tag": "Creativo",
            "cre_card_title": "Sé el Protagonista",
            "cre_card_desc": "Sin más enlaces de WeTransfer. <span class=\"highlight-cre\">Almacenamiento en la nube</span>, <span class=\"highlight-cre\">entrega fluida</span> y <span class=\"highlight-cre\">creación automática de portafolios</span> con <span class=\"highlight-cre\">galerías personalizadas</span>.",
            "att_tag": "Asistente",
            "att_card_title": "Revive la Noche",
            "att_card_desc": "<span class=\"highlight-att\">Compra entradas</span>, accede a horarios de eventos, <span class=\"highlight-att\">mira quién va</span> y recibe fotos al instante.",
            "explore_cta": "Explorar Funciones &rarr;",
            "scroll_hint": "Desplazar"
          },
          "problem": {
            "label": "La forma antigua",
            "headline": "Los eventos no deberían sentirse<br>como un caos organizado.",
            "body": "Hacemos demasiado malabarismo entre apps, <span class=\"highlight-main\">servidores de enlaces</span>, <span class=\"highlight-main\">hilos de mensajes</span> y <span class=\"highlight-main\">enlaces caducados</span>. Es una molestia para todos.",
            "pain_org": "<strong>Organizadores:</strong> Gestionando páginas de <span class=\"highlight-org\">entradas</span>, <span class=\"highlight-org\">grupos de chat</span> y <span class=\"highlight-org\">hojas de cálculo</span> por separado.",
            "pain_cre": "<strong>Creativos:</strong> Persiguiendo organizadores, pagando por <span class=\"highlight-cre\">enlaces que caducan</span>, <span class=\"highlight-cre\">perdiendo visibilidad</span>.",
            "pain_att": "<strong>Asistentes:</strong> <span class=\"highlight-att\">Correos de entradas perdidos</span>, información que falta y <span class=\"highlight-att\">buscando fotos</span> días después.",
            "tool_1": "📁 Enlace WeTransfer caducado",
            "tool_2": "💬 Spam en grupo de WhatsApp (1.247)",
            "tool_3": "🎟️ ¿Dónde está el correo de mi entrada?",
            "tool_4": "💸 Búsqueda de justificantes bancarios",
            "tool_5": "📧 Boletines de correo independientes",
            "tool_6": "📂 Carpeta de Google Drive perdida",
            "tool_7": "📊 Lista en Excel v12.xlsx"
          },
          "organizer": {
            "label": "Para Organizadores",
            "headline": "Tu evento,<br><span style=\"background:linear-gradient(90deg,var(--organizer-accent) 0%,#7cb4ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;\">sin el caos.</span>",
            "body": "Ya tienes bastante trabajo. <strong class=\"brand-highlight\">Revelti</strong> se encarga de lo complejo: <span class=\"highlight-org\">entradas</span>, <span class=\"highlight-org\">comunicación</span>, <span class=\"highlight-org\">equipo de medios</span> y <span class=\"highlight-org\">estadísticas en tiempo real</span>, para que te concentres en hacer la noche inolvidable.",
            "feat1_title": "Venta de entradas sin esfuerzo",
            "feat1_desc": "Crea tu evento, <span class=\"highlight-org\">gestiona tipos de entradas</span> y <span class=\"highlight-org\">sigue las ventas en directo</span>. Sin hojas de cálculo. Simplemente funciona.",
            "feat2_title": "Conexión directa con la audiencia",
            "feat2_desc": "Mantén a tu público <span class=\"highlight-org\">al día</span> antes, durante y después del evento, todo desde <span class=\"highlight-org\">un único panel</span>.",
            "feat3_title": "Tu equipo visual, sincronizado",
            "feat3_desc": "Conecta directamente con tus fotógrafos. Su trabajo va <span class=\"highlight-org\">directo a la galería oficial del evento</span>. Listo.",
            "feat4_title": "Conoce exactamente tus resultados",
            "feat4_desc": "<span class=\"highlight-org\">Estadísticas</span> claras y elegantes sobre todo, desde la venta de entradas hasta la <span class=\"highlight-org\">interacción posterior</span>.",
            "cta": "Reservar Acceso para Organizadores →"
          },
          "creative": {
            "label": "Para Creativos",
            "headline": "Renueva tu espacio de trabajo.<br><span style=\"background:linear-gradient(90deg,var(--creative-accent) 0%,#a855f7 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;\">Sé el centro de atención.</span>",
            "body": "No solo haces fotos: estás capturando recuerdos. <strong class=\"brand-highlight\">Revelti</strong> reemplaza los <span class=\"highlight-cre\">enlaces caducados</span> y las <span class=\"highlight-cre\">entregas caóticas</span> con un ecosistema visual que almacena tus tomas, <span class=\"highlight-cre\">las entrega al instante</span> y destaca <span class=\"highlight-cre\">tu marca</span> ante cada asistente.",
            "feat1_title": "Almacenamiento y presentación en uno",
            "feat1_desc": "Tu espacio de trabajo y tu galería juntos. <span class=\"highlight-cre\">Sube tus archivos multimedia</span>, <span class=\"highlight-cre\">exporta álbumes pulidos</span> — todo en una sola plataforma.",
            "feat2_title": "Sin más enlaces de descarga",
            "feat2_desc": "Entrega fotos y vídeos directamente al evento oficial. <span class=\"highlight-cre\">Sin enlaces que caducan</span>, <span class=\"highlight-cre\">sin carpetas perdidas</span> ni mensajes privados.",
            "feat3_title": "Visibilidad automática",
            "feat3_desc": "Cada asistente que busca sus fotos ve <span class=\"highlight-cre\">tu perfil</span> y <span class=\"highlight-cre\">tu arte</span>. Miles de miradas orgánicas.",
            "feat4_title": "Un portafolio a tu altura",
            "feat4_desc": "Un <span class=\"highlight-cre\">perfil público</span> impresionante para mostrar a tus futuros clientes — <span class=\"highlight-cre\">creado automáticamente</span> con cada evento que cubres.",
            "cta": "Reclamar Tu Estudio Creativo →"
          },
          "attendee": {
            "label": "Para Asistentes",
            "headline": "Compra entradas, recibe novedades y encuentra tus fotos. <span style=\"background:linear-gradient(90deg,var(--attendee-accent) 0%,#ff9f50 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;\">Todo en una app.</span>",
            "body": "Deja de buscar en tu correo <span class=\"highlight-att\">entradas perdidas</span> o de rastrear redes sociales por <span class=\"highlight-att\">fotos del evento</span>. <strong class=\"brand-highlight\">Revelti</strong> te permite comprar tu entrada de forma segura y <span class=\"highlight-att\">gestiona todo lo demás automáticamente</span>.",
            "feat1_title": "Compra tu entrada e ingresa",
            "feat1_desc": "Encuentra tus eventos favoritos, <span class=\"highlight-att\">compra entradas con seguridad</span> y obtén tu <span class=\"highlight-att\">código QR de acceso</span> en la app.",
            "feat2_title": "Mira la programación del evento",
            "feat2_desc": "Accede a <span class=\"highlight-att\">horarios</span> actualizados, preguntas frecuentes y <span class=\"highlight-att\">anuncios en directo</span> para no perderte nada.",
            "feat3_title": "Encuéntrate con tus amigos",
            "feat3_desc": "Conéctate con tu <span class=\"highlight-att\">comunidad de baile</span> y mira exactamente <span class=\"highlight-att\">quién más asistirá</span> antes de comprar el pase.",
            "feat4_title": "Fotos y vídeos al instante",
            "feat4_desc": "Sin buscar en enlaces caducados. En cuanto se sube la galería, las fotos llegan <span class=\"highlight-att\">directamente a tu perfil en la app</span>.",
            "cta": "Unirse a la Lista de Asistentes →",
            "interact_hint": "👆 Interactúa con la maqueta",
            "att_title_0": "Mi Entrada",
            "att_title_1": "Guía del Evento",
            "att_title_2": "Amigos",
            "att_title_3": "¡Fotos Listas!"
          },
          "ecosystem": {
            "label": "Mejor juntos",
            "headline": "Cuando todos están<br>en el mismo escenario,<br><span class=\"headline-accent\">ocurre la magia.</span>",
            "body": "<strong class=\"brand-highlight\">Revelti</strong> es un triángulo, no una línea. Organizadores, creativos y asistentes comparten la <span class=\"highlight-main\">misma plataforma</span>: <span class=\"highlight-main\">conectados</span>, <span class=\"highlight-main\">sincronizados</span> y siempre <span class=\"highlight-main\">informados</span>.",
            "org_tag": "Organizador",
            "org_title": "Organizador",
            "org_body": "Crea eventos, <span class=\"highlight-org\">vende entradas</span>, emite avisos al público y <span class=\"highlight-org\">gestiona al equipo de medios</span> sin salir de la plataforma.",
            "cre_tag": "Creativo",
            "cre_title": "Creativo",
            "cre_body": "<span class=\"highlight-cre\">Almacena y entrega contenidos</span> directamente al evento. Su trabajo llega a cada asistente — <span class=\"highlight-cre\">automáticamente</span>.",
            "att_tag": "Asistente",
            "att_title": "Asistente",
            "att_body": "<span class=\"highlight-att\">Compra su entrada</span>, recibe avisos, <span class=\"highlight-att\">encuentra sus fotos</span> y revive la noche mucho después de que termine.",
            "link_cta": "Explorar perspectiva"
          },
          "waitlist": {
            "eyebrow": "Acceso Anticipado Limitado",
            "headline": "Sé el primero en<br>experimentar <span class=\"headline-accent\">Revelti.</span>",
            "sub": "Estamos dando los últimos retoques a algo muy especial. <span class=\"highlight-main\">Únete a la lista hoy</span> y asegura <span class=\"highlight-main\">ventajas de acceso exclusivo</span> según tu perfil.",
            "instruction": "Selecciona tu perfil para continuar:",
            "role_required_error": "⚠️ Por favor, selecciona un perfil antes de unirte.",
            "role_org": "Organizador",
            "role_cre": "Creativo",
            "role_att": "Asistente",
            "email_placeholder": "tu@email.com",
            "email_aria": "Dirección de correo electrónico",
            "submit_btn": "Unirse a la Lista",
            "submit_btn_loading": "Añadiéndote...",
            "perk1": "<span class=\"perk-check\">✦</span> Acceso beta según tu perfil",
            "perk2": "<span class=\"perk-check\">✦</span> Beneficios exclusivos asegurados",
            "perk3": "<span class=\"perk-check\">✦</span> Insignia de miembro fundador"
          },
          "fomo": {
            "text": "personas ya están en la lista de espera"
          },
          "footer": {
            "rights": "© 2025 <strong class=\"brand-highlight\">Revelti</strong>. Todos los derechos reservados.",
            "disclaimer": "Las maquetas mostradas son ilustrativas. El producto final puede variar.",
            "terms": "Términos y Condiciones",
            "privacy": "Política de Privacidad"
          },
          "terms": {
            "title": "Términos y Condiciones - Revelti",
            "heading": "Términos y Condiciones",
            "placeholder": "El contenido de Términos y Condiciones se añadirá próximamente. ¡Permaneced atentos!",
            "back_home": "← Volver al Inicio"
          },
          "privacy": {
            "title": "Política de Privacidad - Revelti",
            "heading": "Política de Privacidad",
            "placeholder": "El contenido de la Política de Privacidad se añadirá próximamente. ¡Permaneced atentos!",
            "back_home": "← Volver al Inicio"
          },
          "modal": {
            "success_title": "¡Estás en la lista!",
            "success_body": "Has asegurado tu lugar como <strong id=\"modal-role-label\">{role}</strong>.<br><strong class=\"brand-highlight\">Beneficios exclusivos de acceso anticipado</strong> guardados — te contactaremos antes que a nadie cuando se lance <strong class=\"brand-highlight\">Revelti</strong>.<br><br>Cuéntaselo a los tuyos. La noche no termina aquí. 🔥",
            "success_close": "¡Vamos! 🚀",
            "role_organizer": "Organizador",
            "role_creative": "Creativo",
            "role_attendee": "Asistente",
            "mobile_hint_next": "Toca la imagen para ver la siguiente o haz clic fuera para salir.",
            "mobile_hint_interact": "Interactúa con la pantalla. Toca ✕ o haz clic fuera para salir.",
            "desktop_hint": "Haz clic en la imagen para ver la siguiente o haz clic fuera para salir."
          }
        }
      };
      this.currentLang = this.detectPreferredLanguage();
      this.listeners = [];
    }

    detectPreferredLanguage() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;

      const spanishRegionalPrefixes = ['es', 'ca', 'eu', 'gl'];
      const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
      for (const lang of browserLangs) {
        if (!lang) continue;
        const code = lang.toLowerCase();
        if (spanishRegionalPrefixes.some(prefix => code.startsWith(prefix))) {
          return 'es';
        }
      }
      return DEFAULT_LANG;
    }

    async init() {
      await this.loadLanguage(this.currentLang);
      document.documentElement.lang = this.currentLang;
      this.updateDOM();
      this.updateSwitcherUI();
    }

    async loadLanguage(lang) {
      try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) throw new Error(`Failed to load locales/${lang}.json`);
        this.translations[lang] = await response.json();
        this.currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (err) {
        console.warn(`[i18n] Could not fetch locales/${lang}.json via HTTP. Checking fallback cache...`, err);
        if (!this.translations[lang]) {
          console.error(`[i18n] No translation available for '${lang}'`);
        }
      }
    }

    registerFallback(lang, data) {
      this.translations[lang] = data;
    }

    t(key, params = {}) {
      const keys = key.split('.');
      let dict = this.translations[this.currentLang] || this.translations[DEFAULT_LANG] || {};

      let val = dict;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          return key; // Return key if translation missing
        }
      }

      if (typeof val === 'string') {
        Object.keys(params).forEach(param => {
          val = val.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
        });
      }

      return val;
    }

    async setLanguage(lang) {
      if (!this.translations[lang]) {
        await this.loadLanguage(lang);
      } else {
        this.currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
      }
      document.documentElement.lang = lang;
      this.updateDOM();
      this.updateSwitcherUI();
      this.listeners.forEach(cb => cb(lang));
    }

    onLanguageChange(callback) {
      this.listeners.push(callback);
    }

    updateDOM() {
      // Elements with data-i18n (innerText)
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.textContent = translated;
        }
      });

      // Elements with data-i18n-html (innerHTML)
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.innerHTML = translated;
        }
      });

      // Elements with data-i18n-placeholder
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.setAttribute('placeholder', translated);
        }
      });

      // Elements with data-i18n-title
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.setAttribute('title', translated);
        }
      });

      // Elements with data-i18n-aria-label
      document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.setAttribute('aria-label', translated);
        }
      });

      // Meta elements
      document.querySelectorAll('[data-i18n-meta]').forEach(el => {
        const key = el.getAttribute('data-i18n-meta');
        const translated = this.t(key);
        if (translated && translated !== key) {
          if (el.tagName.toLowerCase() === 'title') {
            document.title = translated;
          } else {
            el.setAttribute('content', translated);
          }
        }
      });

      // Update legal links href dynamically based on active language
      const termsLink = document.querySelector('a[href^="terms"]');
      if (termsLink) {
        termsLink.setAttribute('href', this.currentLang === 'es' ? 'terms-es.html' : 'terms.html');
      }
      const privacyLink = document.querySelector('a[href^="privacy"]');
      if (privacyLink) {
        privacyLink.setAttribute('href', this.currentLang === 'es' ? 'privacy-es.html' : 'privacy.html');
      }
    }

    updateSwitcherUI() {
      document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        btn.classList.toggle('active', lang === this.currentLang);
      });
    }
  }

  window.i18n = new I18nEngine();
})();
