import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

const siteUrl = "https://zyrox.app";
const previewImage =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9b8986db-6a4c-499c-a7c2-163470809a3f/id-preview-ebe8a614--2615779a-270e-4fcf-bd98-70b8371b1978.lovable.app-1778172039316.png";
const seoTitle = "3D Body Scan | Treino com IA para muscula\u00E7\u00E3o, calistenia e h\u00EDbrido";
const seoDescription =
  "3D Body Scan \u00E9 a plataforma fitness com IA para muscula\u00E7\u00E3o, calistenia, treino h\u00EDbrido, evolu\u00E7\u00E3o corporal e personaliza\u00E7\u00E3o inteligente do treino.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "3D Body Scan",
      url: siteUrl,
      logo: `${siteUrl}/favicon.png`,
      image: previewImage,
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "3D Body Scan",
      description: seoDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: ["pt-BR", "es", "en", "fr", "de"],
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "3D Body Scan",
      url: siteUrl,
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      image: previewImage,
      description: seoDescription,
      inLanguage: ["pt-BR", "es", "en", "fr", "de"],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: { "@id": `${siteUrl}/#organization` },
      featureList: [
        "Treinos personalizados com IA",
        "Muscula\u00E7\u00E3o, calistenia e treino h\u00EDbrido",
        "An\u00E1lise corporal e evolu\u00E7\u00E3o",
        "Biblioteca de exerc\u00EDcios",
        "Analytics e progress\u00E3o de treino"
      ],
    },
  ],
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">P\u00E1gina n\u00E3o encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A p\u00E1gina que voc\u00EA procura n\u00E3o existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary transition hover:opacity-90"
          >
            Voltar ao in\u00EDcio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-2xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="rounded-2xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground"
          >
            In\u00EDcio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#070B14" },
      { title: seoTitle },
      { name: "description", content: seoDescription },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:site_name", content: "3D Body Scan" },
      { property: "og:title", content: seoTitle },
      { property: "og:description", content: seoDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:image", content: previewImage },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: seoTitle },
      { name: "twitter:description", content: seoDescription },
      { name: "twitter:image", content: previewImage },
    ],
    links: [
      { rel: "canonical", href: siteUrl },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
