import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { getProjects, createProject, type Project } from "@/api/projects";
import { labelFor, EMPLOYEE_RANGES, REVENUE_RANGES } from "@/lib/company-options";
import { ApiError } from "@/api/client";
import {
  Building2,
  Users,
  TrendingUp,
  FlaskConical,
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

  function handleProjectCreated(project: Project) {
    setProjects((prev) => [project, ...prev]);
  }

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
          <ProjectsSection
            projects={projects}
            onProjectCreated={handleProjectCreated}
          />
        </div>
      )}
    </AppLayout>
  );
}

function CompanyCards({ company }: { company: Company }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Votre entreprise</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

function ProjectsSection({
  projects,
  onProjectCreated,
}: {
  projects: Project[];
  onProjectCreated: (project: Project) => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projets</h2>
        <CreateProjectDialog onCreated={onProjectCreated} />
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 font-semibold">Aucun projet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Ajoutez votre premier projet pour decouvrir les subventions disponibles.
            </p>
            <CreateProjectDialog onCreated={onProjectCreated} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden sm:table-cell">Description</TableHead>
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
                    {project.description || "—"}
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

function CreateProjectDialog({ onCreated }: { onCreated: (project: Project) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const project = await createProject({
        name,
        description: description || undefined,
      });
      onCreated(project);
      setOpen(false);
      setName("");
      setDescription("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau projet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="project-name">Nom du projet</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Transition energetique usine Nord"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">
              Description{" "}
              <span className="font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Decrivez brievement le projet et ses objectifs."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={submitting}
            >
              {submitting ? "Creation..." : "Creer le projet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
