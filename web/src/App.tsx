import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Filter,
  FolderOpen,
  PlusCircle,
  Search,
  Shield,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <LogoBanner />
      <HowItWorks />
      <Features />
      <Stats />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  )
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Fondeo</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#fonctionnement" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Fonctionnement
          </a>
          <a href="#avantages" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Avantages
          </a>
          <a href="#tarifs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Tarifs
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Se connecter
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            Commencer
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-background to-background" />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1 text-sm">
            <Zap className="h-3.5 w-3.5 text-emerald-600" />
            Nouveau : IA pour la generation automatique de dossiers
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Trouvez toutes les{" "}
            <span className="text-emerald-600">subventions</span>{" "}
            auxquelles votre entreprise a droit
          </h1>
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Fondeo analyse votre entreprise et vos projets pour identifier les aides publiques
            disponibles — departementales, regionales, nationales et europeennes — puis genere
            automatiquement vos dossiers de candidature.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full bg-emerald-600 text-base hover:bg-emerald-700 sm:w-auto">
              Trouver mes subventions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full text-base sm:w-auto">
              Voir une demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Gratuit pour commencer. Aucune carte bancaire requise.
          </p>
        </div>
      </div>
    </section>
  )
}

function LogoBanner() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Subventions de tous les niveaux
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground md:gap-16">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">BPI France</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">Regions</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">ADEME</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">Union Europeenne</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">Departements</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: PlusCircle,
      title: "Decrivez votre entreprise",
      description:
        "Renseignez les informations de votre entreprise : secteur, taille, localisation, chiffre d'affaires. En quelques minutes, votre profil est pret.",
    },
    {
      number: "02",
      icon: FolderOpen,
      title: "Ajoutez vos projets",
      description:
        "Decrivez les projets pour lesquels vous cherchez des financements : innovation, recrutement, transition ecologique, export...",
    },
    {
      number: "03",
      icon: Filter,
      title: "Decouvrez vos subventions",
      description:
        "Notre moteur compare vos projets avec toutes les subventions disponibles et vous presente celles auxquelles vous etes eligible.",
    },
    {
      number: "04",
      icon: FileText,
      title: "Generez vos dossiers",
      description:
        "Fournissez les documents complementaires demandes et Fondeo genere automatiquement les dossiers de candidature pour chaque subvention.",
    },
  ]

  return (
    <section id="fonctionnement" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Comment ca marche
          </h2>
          <p className="text-lg text-muted-foreground">
            De la creation de votre profil a la generation de vos dossiers, tout est simplifie.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl font-bold text-emerald-600">{step.number}</span>
                <step.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: Search,
      title: "Base exhaustive",
      description:
        "Des milliers de subventions referencees a tous les niveaux : communal, departemental, regional, national et europeen.",
    },
    {
      icon: Zap,
      title: "Matching intelligent",
      description:
        "Algorithme de correspondance qui croise les criteres de votre entreprise et projets avec les conditions d'eligibilite.",
    },
    {
      icon: FileText,
      title: "Generation automatique",
      description:
        "Vos dossiers de candidature sont generes automatiquement a partir des informations fournies. Plus de pages blanches.",
    },
    {
      icon: Timer,
      title: "Gain de temps",
      description:
        "Divisez par 10 le temps passe a chercher des subventions et a monter vos dossiers. Concentrez-vous sur votre activite.",
    },
    {
      icon: Shield,
      title: "Donnees securisees",
      description:
        "Vos donnees d'entreprise sont chiffrees et hebergees en France. Conformite RGPD garantie.",
    },
    {
      icon: CheckCircle2,
      title: "Suivi en temps reel",
      description:
        "Suivez l'avancement de chaque candidature et recevez des alertes sur les nouvelles subventions correspondant a votre profil.",
    },
  ]

  return (
    <section id="avantages" className="border-t bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Pourquoi choisir Fondeo
          </h2>
          <p className="text-lg text-muted-foreground">
            Tout ce dont vous avez besoin pour maximiser vos chances d'obtenir des financements publics.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border bg-background transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <feature.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const stats = [
    { value: "5 000+", label: "Subventions referencees" },
    { value: "98%", label: "Taux de correspondance" },
    { value: "10x", label: "Plus rapide qu'un consultant" },
    { value: "2,5M EUR", label: "Deja obtenus par nos clients" },
  ]

  return (
    <section className="border-t py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-1 text-3xl font-bold tracking-tight md:text-4xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="tarifs" className="border-t bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Tarifs simples et transparents
          </h2>
          <p className="text-lg text-muted-foreground">
            Commencez gratuitement, passez a un plan payant quand vous etes pret.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          <Card className="border bg-background">
            <CardHeader>
              <CardTitle className="text-lg">Decouverte</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">Gratuit</span>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  1 entreprise, 1 projet
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Recherche de subventions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  5 resultats max
                </li>
              </ul>
              <Button variant="outline" className="mt-6 w-full">
                Commencer gratuitement
              </Button>
            </CardContent>
          </Card>

          <Card className="relative border-2 border-emerald-600 bg-background shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white">Populaire</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Pro</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">49EUR</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  1 entreprise, projets illimites
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Resultats illimites
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Generation de dossiers
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Alertes nouvelles subventions
                </li>
              </ul>
              <Button className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700">
                Essai gratuit 14 jours
              </Button>
            </CardContent>
          </Card>

          <Card className="border bg-background">
            <CardHeader>
              <CardTitle className="text-lg">Entreprise</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">Sur mesure</span>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Multi-entreprises
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  API et integrations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Account manager dedie
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  SLA garanti
                </li>
              </ul>
              <Button variant="outline" className="mt-6 w-full">
                Nous contacter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Pret a trouver vos subventions ?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Rejoignez les entreprises qui ont deja simplifie leur recherche
            de financements publics avec Fondeo.
          </p>
          <Button size="lg" className="bg-emerald-600 text-base hover:bg-emerald-700">
            Commencer gratuitement
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">Fondeo</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              La plateforme qui simplifie l'acces aux subventions publiques pour les entreprises.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Produit</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#fonctionnement" className="hover:text-foreground">Fonctionnement</a></li>
              <li><a href="#avantages" className="hover:text-foreground">Avantages</a></li>
              <li><a href="#tarifs" className="hover:text-foreground">Tarifs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Ressources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-foreground">Guide des subventions</a></li>
              <li><a href="#" className="hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Mentions legales</a></li>
              <li><a href="#" className="hover:text-foreground">Politique de confidentialite</a></li>
              <li><a href="#" className="hover:text-foreground">CGU</a></li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-center text-sm text-muted-foreground">
          &copy; 2026 Fondeo. Tous droits reserves.
        </p>
      </div>
    </footer>
  )
}

export default App
