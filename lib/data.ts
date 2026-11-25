export type Owner = {
  name: string;
  photo: string;
  role: string;
  passion: string;
  detail: string;
};

// As duas idealizadoras do Lá em Casa (conforme os cards da marca no Instagram).
export const owners: Owner[] = [
  {
    name: "Ângela Sammer",
    photo: "/fotos/sobre-laemcasa-crop.jpg",
    role: "Idealizadora",
    passion: "Empreendedora e apaixonada por receber bem",
    detail: "Organização e experiência em cada detalhe.",
  },
  {
    name: "Marcela Fraxe",
    photo: "/fotos/image2-crop.jpg",
    role: "Idealizadora",
    passion: "Apaixonada por mesa posta e boa comida",
    detail: "Criatividade e cuidado em cada montagem.",
  },
];

// ---------- Cardápio interativo ----------
export type MenuCategory = "fingerfood" | "buffet" | "mesas" | "boxes" | "sobremesas";

export const menuCategories: { id: MenuCategory | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "fingerfood", label: "Finger Food" },
  { id: "buffet", label: "Buffet & Frios" },
  { id: "mesas", label: "Mesas Elegantes" },
  { id: "boxes", label: "Boxes & Tábuas" },
  { id: "sobremesas", label: "Sobremesas" },
];

export type MenuItem = {
  slug: string;
  src: string;
  title: string;
  cats: MenuCategory[];
  description: string;
  idealFor: string[];
  // Modelo 3D (GLB em /public/modelos) usado no cardápio 3D e no AR.
  model?: string;
};

// Todas as fotos reais, categorizadas e descritas para o cardápio interativo.
export const menu: MenuItem[] = [
  {
    slug: "buffet-completo",
    src: "/fotos/hero-buffet.jpg",
    title: "Buffet completo",
    cats: ["buffet", "mesas"],
    description:
      "Nosso buffet mais completo: frutas frescas, tábuas de frios e queijos, quiches, salgados artesanais e petiscos, tudo montado com capricho para uma mesa farta e cheia de cor.",
    idealFor: ["Festas grandes", "Casamentos", "Confraternizações"],
  },
  {
    slug: "mesa-elegante",
    src: "/fotos/mesa-elegante.jpg",
    title: "Mesa elegante com arranjos",
    cats: ["mesas", "buffet"],
    description:
      "Composição de mesa com arranjos florais, alturas e louças selecionadas. Um cenário sofisticado que combina finger food, doces e charcutaria em uma apresentação impecável.",
    idealFor: ["Recepções", "Aniversários especiais", "Eventos sociais"],
  },
  {
    slug: "mini-hamburgueres-salgados",
    src: "/fotos/finger-food.jpg",
    title: "Mini hambúrgueres & salgados",
    cats: ["fingerfood"],
    description:
      "Bandeja de finger food com mini hambúrgueres, sliders e salgados artesanais decorados um a um. Feitos para circular pela festa e agradar todo mundo.",
    idealFor: ["Coquetéis", "Happy hour", "Festas descontraídas"],
  },
  {
    slug: "tabua-charcutaria",
    src: "/fotos/box-gourmet.jpg",
    title: "Tábua de charcutaria",
    cats: ["boxes"],
    description:
      "Tábua de charcutaria montada com frios, queijos, acompanhamentos e conserva artesanal, com a marca Lá em Casa. Perfeita para receber ou presentear.",
    idealFor: ["Receber em casa", "Presente", "Encontros íntimos"],
  },
  {
    slug: "verrine-morango",
    src: "/fotos/sobremesa.jpg",
    title: "Verrine de morango",
    cats: ["sobremesas"],
    description:
      "Sobremesa de colher em taça individual: creme sedoso com calda e morangos frescos. O docinho na medida certa para fechar a celebração.",
    idealFor: ["Sobremesa de festa", "Mesa de doces", "Jantares"],
  },
  {
    slug: "tabuas-frios-queijos",
    src: "/fotos/481076583_1197570368997044_178351454419977637_n.jpg",
    title: "Tábuas de frios & queijos",
    cats: ["buffet"],
    description:
      "Tábuas generosas de frios, queijos, embutidos, castanhas, azeitonas e frutas, arrumadas em camadas para um visual de dar água na boca.",
    idealFor: ["Buffet de festa", "Vinhos & queijos", "Recepções"],
  },
  {
    slug: "mesa-finger-food",
    src: "/fotos/481076726_1197570152330399_5706697308965823928_n.jpg",
    title: "Mesa de finger food",
    cats: ["fingerfood", "buffet"],
    description:
      "Uma mesa inteira de finger food: mini quiches, canapés, bolinhos, camarão e tartelettes, servidos em porções individuais e elegantes.",
    idealFor: ["Coquetéis", "Aniversários", "Eventos corporativos"],
  },
  {
    slug: "buffet-frios-frutas",
    src: "/fotos/482084180_1197570282330386_3643726560203791455_n.jpg",
    title: "Buffet de frios & frutas",
    cats: ["buffet", "mesas"],
    description:
      "Buffet com tábua de frios, seleção de frutas da estação, bruschettas e espetinhos. Fartura e frescor na mesma mesa.",
    idealFor: ["Festas", "Brunchs", "Confraternizações"],
  },
  {
    slug: "frios-frutas-bruschettas",
    src: "/fotos/482215969_1197570148997066_2297994607067886252_n.jpg",
    title: "Frios, frutas & bruschettas",
    cats: ["buffet"],
    description:
      "Combinação de frios, frutas frescas, azeitonas e bruschettas coloridas, montada com ervas e detalhes que valorizam cada ingrediente.",
    idealFor: ["Buffet", "Recepções", "Encontros"],
  },
  {
    slug: "canudos-camarao",
    src: "/fotos/584401203_18132411400494204_2213124731454182988_n.jpg",
    title: "Canudos & camarão empanado",
    cats: ["fingerfood"],
    description:
      "Mesa romântica com canudos crocantes recheados, salpicão em taça de cristal e camarão empanado servido em taças. Ideal para uma noite a dois.",
    idealFor: ["Jantar romântico", "Dia dos Namorados", "Bodas"],
  },
  {
    slug: "estrogonofe-torradas",
    src: "/fotos/589189586_18132411445494204_5042949019917780689_n.jpg",
    title: "Estrogonofe & torradas",
    cats: ["buffet"],
    description:
      "Estação quente com estrogonofe cremoso e pães e torradas artesanais, tudo com decoração romântica de pétalas e velas.",
    idealFor: ["Jantar a dois", "Comemorações", "Datas especiais"],
  },
  {
    slug: "verrines-morango-camarao",
    src: "/fotos/589314076_18132411433494204_2458181073326140490_n.jpg",
    title: "Verrines de morango & camarão",
    cats: ["sobremesas", "fingerfood"],
    description:
      "Verrines de morango com creme e tartelettes doces, ao lado de camarão empanado em taças. Doce e salgado em harmonia.",
    idealFor: ["Festas", "Mesa de doces", "Coquetéis"],
  },
  {
    slug: "panna-cotta-morango",
    src: "/fotos/591148084_18078377702515998_5306607893271389251_n.jpg",
    title: "Panna cotta de morango",
    cats: ["sobremesas"],
    description:
      "Panna cotta cremosa com calda e morangos frescos, servida em taças individuais sobre suporte de acrílico. Delicada e irresistível.",
    idealFor: ["Sobremesa de festa", "Casamentos", "Jantares"],
  },
  {
    slug: "quiche-artesanal",
    src: "/fotos/619594967_18080158904253604_2909007940924245009_n.jpg",
    title: "Quiche artesanal",
    cats: ["buffet", "fingerfood"],
    description:
      "Quiche artesanal de massa amanteigada e recheio cremoso, finalizada com ervas e gergelim. Fatia perfeita para o buffet.",
    idealFor: ["Buffet", "Brunch", "Chá da tarde"],
  },
  {
    slug: "mini-burgers-canapes",
    src: "/fotos/622122707_18094296161486172_4629924947137413202_n.jpg",
    title: "Mini burgers & canapés",
    cats: ["fingerfood"],
    description:
      "Mini hambúrgueres, canapés com morango e parma, cestinhas e bolinhos crocantes reunidos em uma bandeja de dar gosto.",
    idealFor: ["Coquetéis", "Festas", "Happy hour"],
  },
  {
    slug: "tacas-parma-queijo-frutas",
    src: "/fotos/622442919_18083498126515998_1349353818041966639_n.jpg",
    title: "Taças de parma, queijo & frutas",
    cats: ["fingerfood"],
    description:
      "Taças individuais com presunto parma, queijos, frutas e mel — um canapé sofisticado servido em taça de degustação.",
    idealFor: ["Recepções", "Vinhos & queijos", "Eventos elegantes"],
  },
  {
    slug: "tabua-parma-burrata",
    src: "/fotos/623648289_18060644354330475_6619833890557004879_n.jpg",
    title: "Tábua com parma & burrata",
    cats: ["boxes", "fingerfood"],
    description:
      "Tábua assinada Lá em Casa com presunto parma no varal, burrata fresca, tomatinhos, pesto e torradas. Uma experiência de charcutaria completa.",
    idealFor: ["Receber em casa", "Presente gourmet", "Encontros"],
  },
  {
    slug: "tabua-gourmet-assinada",
    src: "/fotos/628030741_18347730079230022_2826290441152593154_n.jpg",
    title: "Tábua gourmet assinada",
    cats: ["boxes"],
    description:
      "Tábua redonda com brie brûlée, folhado de frutas vermelhas, queijo empanado, geleias, torradas e o medalhão de chocolate da marca.",
    idealFor: ["Presente", "Datas especiais", "Receber a dois"],
  },
  {
    slug: "batatas-recheadas-salgados",
    src: "/fotos/641783147_17908429626181740_3628259770976201199_n.jpg",
    title: "Batatas recheadas & salgados",
    cats: ["fingerfood", "buffet"],
    description:
      "Batatas bolinha recheadas e gratinadas, mini enroladinhos, salgados e bruschettas, servidos em porções fáceis de pegar.",
    idealFor: ["Festas", "Coquetéis", "Confraternizações"],
  },
  {
    slug: "box-cafe-da-manha",
    src: "/fotos/648543736_17931119712212704_2157475635538873234_n.jpg",
    title: "Box café da manhã",
    cats: ["boxes", "sobremesas"],
    description:
      "Box de café da manhã / lanche com suco, achocolatado, croissant, waffle, brigadeiros, chocolates e guloseimas. Uma surpresa deliciosa para entregar.",
    idealFor: ["Presente", "Comemoração", "Café da manhã surpresa"],
  },
  {
    slug: "pave-saladas-pote",
    src: "/fotos/650767449_18066547685328829_2661822451098831478_n.jpg",
    title: "Pavê & saladas no pote",
    cats: ["buffet", "sobremesas"],
    description:
      "Sobremesas de colher em taças altas, saladas individuais no pote e bruschettas — leveza e doçura para o buffet.",
    idealFor: ["Buffet", "Almoços", "Eventos"],
  },
  {
    slug: "pates-torradas-carne",
    src: "/fotos/650983613_17962714098024762_5955031662731459764_n.jpg",
    title: "Patês, torradas & carne desfiada",
    cats: ["fingerfood", "buffet"],
    description:
      "Estação de patês e cremes em taças, torradas, bruschettas e carne desfiada em porções individuais. Sabor caseiro com apresentação de festa.",
    idealFor: ["Coquetéis", "Festas", "Reuniões"],
  },
  {
    slug: "grande-mesa-festa",
    src: "/fotos/652634203_18066806798322109_5039086761561599317_n.jpg",
    title: "Grande mesa de festa",
    cats: ["mesas", "buffet"],
    description:
      "Uma grande mesa de festa com arranjos florais altos, estações de finger food, salgados, frutas e bolo. O nosso projeto mais completo de decoração e buffet.",
    idealFor: ["Casamentos", "Bodas", "Grandes celebrações"],
  },
  {
    slug: "pipoca-gourmet-cremes",
    src: "/fotos/654903835_18157005679435671_1310115773739403167_n.jpg",
    title: "Pipoca gourmet & cremes",
    cats: ["fingerfood", "buffet"],
    description:
      "Pipoca gourmet ensacada, cremes em taças, carne desfiada em potinhos e canapés variados. Diversão e sabor na mesma mesa.",
    idealFor: ["Festas", "Cinema em casa", "Coquetéis"],
  },
  {
    slug: "buffet-corporativo",
    src: "/fotos/655118742_18070594700553999_2905837259033692692_n.jpg",
    title: "Buffet corporativo",
    cats: ["buffet", "fingerfood"],
    description:
      "Buffet pensado para o ambiente corporativo: croissants, pavê e granola em taças, mini burgers, salada de frutas e bolo. Prático e elegante.",
    idealFor: ["Reuniões", "Eventos de empresa", "Coffee break"],
  },
  {
    slug: "box-parabens",
    src: "/fotos/655210424_18083973962212747_2440547291488395554_n.jpg",
    title: "Box Parabéns",
    cats: ["boxes"],
    description:
      "Box comemorativo com mini burger, quiche, brigadeiro, folhado de frutas vermelhas e canapés. A forma mais gostosa de dizer parabéns.",
    idealFor: ["Aniversário", "Presente", "Surpresa"],
  },
  {
    slug: "box-gourmet-completo",
    src: "/fotos/656177578_18158284675440980_8833511108873287062_n.jpg",
    title: "Box gourmet completo",
    cats: ["boxes"],
    description:
      "Box gourmet recheado: mini burgers, cestinhas, salpicão, patês, quiche, salsichas, frutas e o medalhão da marca. Uma refeição completa em caixa.",
    idealFor: ["Presente gourmet", "Receber em casa", "Piquenique"],
  },
  {
    slug: "mini-burgers-tabule",
    src: "/fotos/657372501_18080429504632287_4400268790246969120_n.jpg",
    title: "Mini burgers & tabule",
    cats: ["fingerfood"],
    description:
      "Mini hambúrgueres, tabule em taça, quiches e folhados servidos em bandejas de madeira e cristal. Frescor e sabor em cada porção.",
    idealFor: ["Coquetéis", "Festas", "Eventos leves"],
  },
  {
    slug: "enroladinhos-quiches",
    src: "/fotos/659816361_17994908354946718_3660595467519249369_n.jpg",
    title: "Enroladinhos & quiches",
    cats: ["fingerfood", "buffet"],
    description:
      "Enroladinhos de salsicha, mini burgers, quiches e cremes em taças, com frutas frescas para acompanhar. Clássico que agrada todas as idades.",
    idealFor: ["Aniversários", "Festas infantis", "Buffet"],
  },
  {
    slug: "box-presente-rosa",
    src: "/fotos/661248704_18091242455125592_5787930874921542790_n.jpg",
    title: "Box presente com rosa",
    cats: ["boxes"],
    description:
      "Box finalizado com laço preto e uma rosa, com a marca Lá em Casa. Um presente comestível e cheio de charme para surpreender.",
    idealFor: ["Presente", "Dia dos Namorados", "Datas especiais"],
  },
  {
    slug: "folhados-canudos",
    src: "/fotos/670237476_18085568003348670_3692743431108888447_n.jpg",
    title: "Folhados & canudos",
    cats: ["fingerfood", "buffet"],
    description:
      "Folhados recheados, canudos crocantes, quiches e um bolo de destaque compõem essa mesa cheia de texturas.",
    idealFor: ["Festas", "Chá da tarde", "Buffet"],
  },
  {
    slug: "mesa-salgados-frutas",
    src: "/fotos/670411592_18097195864863757_2392907627741239852_n.jpg",
    title: "Mesa de salgados & frutas",
    cats: ["fingerfood", "buffet"],
    description:
      "Mesa farta com batatas recheadas, enroladinhos, quiches variadas e uma linda passarela de frutas frescas.",
    idealFor: ["Festas grandes", "Confraternizações", "Buffet"],
  },
  {
    slug: "tortinhas-pates",
    src: "/fotos/671026240_18121535962555669_2502213472689265192_n.jpg",
    title: "Tortinhas & patês",
    cats: ["fingerfood", "buffet"],
    description:
      "Tortinhas salgadas, patês em taças de martini e enroladinhos dourados, decorados com alecrim. Elegância nos detalhes.",
    idealFor: ["Coquetéis", "Recepções", "Eventos"],
  },
  {
    slug: "carne-desfiada-fritas-taca",
    src: "/fotos/731295040_18103362131515998_8983758796213103912_n.jpg",
    title: "Carne desfiada & fritas na taça",
    cats: ["fingerfood"],
    description:
      "Carne desfiada com batata frita crocante servida em taças de cristal — um clássico reinventado em formato finger food.",
    idealFor: ["Happy hour", "Coquetéis", "Festas"],
  },
  {
    slug: "brigadeiros-tematicos",
    src: "/fotos/731345075_18103362140515998_3597894992602060968_n.jpg",
    title: "Brigadeiros temáticos",
    cats: ["sobremesas"],
    description:
      "Brigadeiros gourmet com confeitos coloridos, personalizados para o tema da festa. Doçura sob medida para a sua comemoração.",
    idealFor: ["Festas temáticas", "Aniversários", "Mesa de doces"],
  },
  {
    slug: "bolinhas-crocantes-taca",
    src: "/fotos/731379312_18103362149515998_1137094560677133601_n.jpg",
    title: "Bolinhas crocantes na taça",
    cats: ["fingerfood"],
    description:
      "Bolinhas crocantes empanadas servidas em taças com um toque de alecrim. Um petisco quentinho e sofisticado.",
    idealFor: ["Coquetéis", "Recepções", "Festas"],
  },
  {
    slug: "mosaico-finger-foods",
    src: "/fotos/762291791_18158096512494204_183158301536888056_n.jpg",
    title: "Mosaico de finger foods",
    cats: ["fingerfood", "buffet"],
    description:
      "Um panorama do nosso finger food: canapés, mini burgers, taças, tábuas e mesas montadas com o capricho que é a nossa marca.",
    idealFor: ["Inspiração", "Festas", "Eventos"],
  },
  {
    slug: "tabua-frios-frutas-premium",
    src: "/fotos/484018228_1200794628674618_5842321264682682776_n.jpg",
    title: "Tábua premium de frios & frutas",
    cats: ["boxes", "buffet"],
    description:
      "Tábua redonda farta com presunto parma, salame, peito de peru, queijos variados (brie, gorgonzola, gouda e provolone), pitaya, morangos, uvas, kiwi, damascos, castanhas e alecrim.",
    idealFor: ["Recepções", "Aniversários", "Confraternizações"],
    model: "/modelos/tabua-frios-frutas-premium.glb",
  },
  {
    slug: "taca-morangos-docinhos",
    src: "/fotos/483536304_1200612572026157_6500900823022306074_n.jpg",
    title: "Taça de morangos com docinhos",
    cats: ["sobremesas"],
    description:
      "Taça de sobremesa com creme, camada de morango, morangos frescos por cima e docinhos artesanais. Uma peça que encanta na mesa de doces.",
    idealFor: ["Aniversários", "Chás", "Mesa de doces"],
    model: "/modelos/taca-morangos-docinhos.glb",
  },
];

export function getMenuItem(slug: string): MenuItem | undefined {
  return menu.find((m) => m.slug === slug);
}

export function relatedMenu(slug: string, cat: MenuCategory, limit = 3): MenuItem[] {
  return menu.filter((m) => m.slug !== slug && m.cats.includes(cat)).slice(0, limit);
}

export function categoryLabel(cat: MenuCategory | "todos"): string {
  return menuCategories.find((c) => c.id === cat)?.label ?? "";
}

// Liga cada categoria do cardápio a uma opção pré-marcada na calculadora de orçamento.
export const categoryToCalcOption: Record<MenuCategory, string | null> = {
  fingerfood: "fingerfood",
  buffet: "buffet",
  mesas: "mesa",
  boxes: null,
  sobremesas: "sobremesas",
};

export type Experience = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  image: string;
  imageAlt: string;
};

export const experiences: Experience[] = [
  {
    id: "finger-food",
    eyebrow: "Para comer com as mãos",
    title: "Finger Food",
    description:
      "Bocados pensados para circular pela festa: quentes e frios, servidos em porções individuais que unem sabor e sofisticação em cada mordida.",
    items: ["Mini hambúrgueres e sliders", "Salgados artesanais", "Canapés e bruschettas", "Espetinhos gourmet"],
    image: "/fotos/finger-food.jpg",
    imageAlt: "Bandeja de finger food com mini hambúrgueres e salgados artesanais do Lá em Casa",
  },
  {
    id: "buffet",
    eyebrow: "Fartura e variedade",
    title: "Buffet Completo",
    description:
      "Mesas generosas montadas com carinho, do salgado ao doce. A abundância brasileira apresentada com capricho de arte gourmet.",
    items: ["Ilhas gastronômicas", "Tábuas de frios e queijos", "Pães e antepastos", "Estações quentes"],
    image: "/fotos/hero-buffet.jpg",
    imageAlt: "Buffet completo do Lá em Casa com frutas, tábuas de frios, salgados e quiches",
  },
  {
    id: "mesas",
    eyebrow: "Cenário do seu evento",
    title: "Mesas Elegantes",
    description:
      "Composições de mesa que transformam o ambiente: arranjos, alturas, texturas e uma apresentação impecável para receber com beleza.",
    items: ["Arranjos florais", "Louças e suportes selecionados", "Decoração temática", "Montagem no local"],
    image: "/fotos/mesa-elegante.jpg",
    imageAlt: "Mesa elegante do Lá em Casa com arranjos florais altos, doces e tábuas de frios",
  },
  {
    id: "boxes",
    eyebrow: "Presentear e receber",
    title: "Boxes Gourmet",
    description:
      "Caixas e tábuas montadas para presentear ou para receber em casa com praticidade — a experiência Lá em Casa entregue prontinha.",
    items: ["Tábuas de charcutaria", "Boxes para presente", "Kits para receber", "Personalização por ocasião"],
    image: "/fotos/box-gourmet.jpg",
    imageAlt: "Box gourmet do Lá em Casa com tábua de charcutaria e conserva artesanal",
  },
  {
    id: "sobremesas",
    eyebrow: "O doce final",
    title: "Sobremesas",
    description:
      "O encerramento perfeito: doces finos, frutas e sobremesas de colher preparados para adoçar cada celebração.",
    items: ["Brigadeiros gourmet", "Copinhos e verrines", "Frutas e ganaches", "Mesa de doces"],
    image: "/fotos/sobremesa.jpg",
    imageAlt: "Sobremesa do Lá em Casa com morangos e creme de brigadeiro em taça",
  },
];

export const steps = [
  {
    n: "01",
    title: "Conte sua ideia",
    text: "Você nos diz a ocasião, a data, o número de convidados e o clima do evento.",
  },
  {
    n: "02",
    title: "Curadoria do menu",
    text: "Montamos uma proposta personalizada de sabores e apresentação para o seu momento.",
  },
  {
    n: "03",
    title: "Montagem impecável",
    text: "Preparamos tudo com capricho e cuidamos da apresentação da mesa no local.",
  },
  {
    n: "04",
    title: "É só celebrar",
    text: "Você aproveita a festa ao lado de quem ama. A gente cuida do resto.",
  },
];

