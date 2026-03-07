import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProject, deleteProject, type Project } from "@/api/projects";
import {
  ArrowLeft,
  CalendarDays,
  Trash2,
  MapPin,
  User,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProject(Number(id))
      .then(setProject)
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleDelete() {
    if (!project || !window.confirm("Supprimer ce projet ? Cette action est irreversible."))
      return;
    setDeleting(true);
    try {
      await deleteProject(project.id);
      navigate("/dashboard");
    } catch {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!project) return null;

  return (
    <AppLayout>
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tableau de bord
          </Link>
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Cree le {new Date(project.created_at).toLocaleDateString("fr-FR")}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Objectif */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Objectif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {project.objective || "Aucun objectif renseigne."}
            </p>
          </CardContent>
        </Card>

        {/* Localisation */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Localisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.location_is_headquarters ? (
              <p className="text-sm">Au siege social de l'entreprise</p>
            ) : project.location_city ? (
              <div className="text-sm">
                <p className="font-medium">{project.location_street}</p>
                <p className="text-muted-foreground">
                  {project.location_postal_code} {project.location_city}
                </p>
                <p className="text-muted-foreground">
                  {project.location_department}, {project.location_region}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Non renseigne</p>
            )}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personne referente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.contact_first_name ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium">
                  {project.contact_first_name} {project.contact_last_name}
                </p>
                {project.contact_role && (
                  <p className="text-muted-foreground">{project.contact_role}</p>
                )}
                {project.contact_email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {project.contact_email}
                  </div>
                )}
                {project.contact_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {project.contact_phone}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Non renseigne</p>
            )}
          </CardContent>
        </Card>

        {/* Permis de construire */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Immobilier
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!project.needs_building_permit ? (
              <p className="text-sm text-muted-foreground">
                Pas de permis de construire necessaire.
              </p>
            ) : project.permit ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium">
                    {project.permit.is_extension ? "Extension" : "Nouveau site"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Surface</p>
                  <p className="text-sm font-medium">{project.permit.area_sqm} m²</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duree des travaux</p>
                  <p className="text-sm font-medium">
                    {project.permit.works_duration_months} mois
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Depot du permis</p>
                  <p className="text-sm font-medium">
                    {new Date(project.permit.permit_submission_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Debut des travaux</p>
                  <p className="text-sm font-medium">
                    {new Date(project.permit.works_start_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <p className="text-xs text-muted-foreground">Usage prevu</p>
                  <p className="text-sm font-medium">{project.permit.usage_description}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Permis de construire necessaire — details non renseignes.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Placeholder for future */}
        <Card className="border-dashed lg:col-span-2">
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Le matching de subventions sera bientot disponible ici.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
