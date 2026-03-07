import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { getCompany, type Company } from "@/api/company";
import { getProjects, type Project } from "@/api/projects";
import { labelFor, EMPLOYEE_RANGES, REVENUE_RANGES } from "@/lib/company-options";
import {
  Building2,
  Users,
  TrendingUp,
  FlaskConical,
  MapPin,
  Plus,
  FolderOpen,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function DashboardPage() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCompany(), getProjects()])
      .then(([c, p]) => {
        setCompany(c);
        setProjects(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
          <ProjectsSection projects={projects} />
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

function ProjectsSection({ projects }: { projects: Project[] }) {
  const navigate = useNavigate();
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
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden sm:table-cell">Objectif</TableHead>
                <TableHead className="hidden md:table-cell">Date de creation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="hidden max-w-xs truncate text-muted-foreground sm:table-cell">
                    {project.objective || "—"}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {new Date(project.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
