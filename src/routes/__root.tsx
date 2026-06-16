import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  HeadContent,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l'accueil
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
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Une erreur est survenue
        </h1>
        <div className="mt-6">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      {/*
       * Rend les balises `<head>` déclarées par route via l'API `head()` de
       * TanStack Router (alimentée par `buildPublicPageMeta` dans `_public.tsx`
       * et `buildNoindexMeta` sur les prototypes). React 19 hisse
       * automatiquement `<title>`/`<meta>`/`<link>` dans le `<head>` du
       * document, ce qui pilote `<title>`, meta `description`, canonical et
       * Open Graph depuis la source unique `PUBLIC_ROUTES`, et applique
       * `noindex` aux Pages_Prototype.
       *
       * Couvre (côté client, après chargement du bundle) : Requirements 6.1 et
       * la directive `noindex` (10.2). Le rendu indexable « HTML peuplé avant
       * JS » (5.1, 5.2) nécessite le pré-rendu/SSR — voir la note de la tâche
       * 10.2 dans le spec.
       */}
      <HeadContent />
      <Outlet />
    </QueryClientProvider>
  );
}
