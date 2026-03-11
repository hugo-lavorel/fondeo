import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { useProjects } from "@/hooks/useProjects";
import type { Company } from "@/api/company";
import type { Project } from "@/api/projects";
import { labelFor, EMPLOYEE_RANGES, REVENUE_RANGES } from "@/lib/company-options";
import {
  Building2,
  Users,
  TrendingUp,
  FlaskConical,
  MapPin,
  Plus,
  FolderOpen,
  Euro,
  ArrowRight,
  CalendarDays,
  Building,
  User,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: company, isLoading: companyLoading } = useCompany();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const loading = companyLoading || projectsLoading;

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bonjour {user?.first_name}</h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenue sur votre tableau de bord Fondeo.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-10">
          {company && <CompanyCards company={company} />}
          <ProjectsSection projects={projects ?? []} />
        </div>
      )}
    </AppLayout>
  );
}

function CompanyCards({ company }: { company: Company }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Votre entreprise</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entreprise
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{company.name}</div>
            <p className="text-xs text-muted-foreground">SIREN {company.siren}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activite (NAF)
            </CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold leading-tight">
              {company.naf_label}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{company.naf_code}</p>
          </CardContent>
        </Card>

        {company.city && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Localisation
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold leading-tight">{company.city}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {company.department}, {company.region}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Effectif
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {labelFor(EMPLOYEE_RANGES, company.employee_range)}
            </div>
            <p className="text-xs text-muted-foreground">salaries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chiffre d'affaires
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {labelFor(REVENUE_RANGES, company.annual_revenue_range)}
            </div>
            <p className="text-xs text-muted-foreground">annuel</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NewProjectButton() {
  return (
    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" asChild>
      <Link to="/projects/new">
        <Plus className="mr-2 h-4 w-4" />
        Nouveau projet
      </Link>
    </Button>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projets</h2>
        <NewProjectButton />
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 font-semibold">Aucun projet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Ajoutez votre premier projet pour decouvrir les subventions disponibles.
            </p>
            <NewProjectButton />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const locationLabel = project.location_is_headquarters
    ? "Siege social"
    : project.location_city
      ? `${project.location_city}${project.location_department ? ` (${project.location_department})` : ""}`
      : null;

  return (
    <Link to={`/projects/${project.id}`} className="block">
      <Card className="group h-full transition-colors hover:border-emerald-300 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">{project.name}</CardTitle>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          {project.objective && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {project.objective}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Expenses summary */}
          <div className="flex items-center gap-4 rounded-lg bg-muted/50 px-3 py-2">
            <Euro className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              {project.total_expenses > 0 ? (
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold">
                    {formatCurrency(project.total_expenses)}
                  </span>
                  {project.total_eligible_expenses > 0 && project.total_eligible_expenses !== project.total_expenses && (
                    <span className="text-xs text-emerald-600">
                      {formatCurrency(project.total_eligible_expenses)} eligible
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Aucune depense</span>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {locationLabel && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {locationLabel}
              </span>
            )}
            {project.contact_first_name && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {project.contact_first_name} {project.contact_last_name}
              </span>
            )}
            {project.needs_building_permit && (
              <span className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                Permis de construire
              </span>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            Cree le {new Date(project.created_at).toLocaleDateString("fr-FR")}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
