import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getProject,
  deleteProject,
  updateProject,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  type Project,
  type Expense,
  type FinancingType,
  type CreateProjectParams,
} from "@/api/projects";
import { getCompany, type Company } from "@/api/company";
import { ApiError } from "@/api/client";
import {
  ArrowLeft,
  CalendarDays,
  Trash2,
  MapPin,
  User,
  Mail,
  Phone,
  Building,
  Plus,
  Euro,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import AddressAutocomplete, { type AddressResult } from "@/components/AddressAutocomplete";
import AppLayout from "@/components/AppLayout";

const FINANCING_LABELS: Record<FinancingType, string> = {
  self_funded: "Autofinancement",
  loan: "Emprunt",
  leasing: "Credit-bail",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

type EditSection = "general" | "location" | "contact" | "permit" | null;

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editSection, setEditSection] = useState<EditSection>(null);

  const projectId = Number(id);

  useEffect(() => {
    if (!id) return;
    Promise.all([getProject(projectId), getExpenses(projectId), getCompany()])
      .then(([p, e, c]) => {
        setProject(p);
        setExpenses(e);
        setCompany(c);
      })
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

  function updateTotals(amount: number, financingType: string, sign: 1 | -1) {
    setProject((prev) => {
      if (!prev) return prev;
      const delta = amount * sign;
      return {
        ...prev,
        total_expenses: prev.total_expenses + delta,
        total_eligible_expenses:
          financingType !== "leasing"
            ? prev.total_eligible_expenses + delta
            : prev.total_eligible_expenses,
        total_leasing_expenses:
          financingType === "leasing"
            ? prev.total_leasing_expenses + delta
            : prev.total_leasing_expenses,
      };
    });
  }

  function handleExpenseSaved(expense: Expense, previous?: Expense) {
    if (previous) {
      setExpenses((prev) => prev.map((e) => (e.id === expense.id ? expense : e)));
      updateTotals(previous.amount, previous.financing_type, -1);
      updateTotals(expense.amount, expense.financing_type, 1);
    } else {
      setExpenses((prev) => [expense, ...prev]);
      updateTotals(expense.amount, expense.financing_type, 1);
    }
  }

  async function handleDeleteExpense(expenseId: number) {
    const expense = expenses.find((e) => e.id === expenseId);
    if (!expense) return;
    try {
      await deleteExpense(projectId, expenseId);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      updateTotals(expense.amount, expense.financing_type, -1);
    } catch {
      // ignore
    }
  }

  function handleProjectUpdated(updated: Project) {
    setProject(updated);
    setEditSection(null);
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
        <Card className="group lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Objectif
            </CardTitle>
            <EditButton onClick={() => setEditSection("general")} />
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {project.objective || "Aucun objectif renseigne."}
            </p>
          </CardContent>
        </Card>

        {/* Localisation */}
        <Card className="group">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Localisation
              </CardTitle>
            </div>
            <EditButton onClick={() => setEditSection("location")} />
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
        <Card className="group">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Personne referente
              </CardTitle>
            </div>
            <EditButton onClick={() => setEditSection("contact")} />
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
        <Card className="group lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Immobilier
              </CardTitle>
            </div>
            <EditButton onClick={() => setEditSection("permit")} />
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

        {/* Depenses */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Depenses
              </CardTitle>
            </div>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setEditingExpense(null);
                setExpenseDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {expenses.length > 0 && (
              <div className="flex flex-wrap gap-6 rounded-lg border p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-semibold">{formatCurrency(project.total_expenses)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Eligible aux subventions</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {formatCurrency(project.total_eligible_expenses)}
                  </p>
                </div>
                {project.total_leasing_expenses > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Credit-bail (non eligible)</p>
                    <p className="text-lg font-semibold text-amber-600">
                      {formatCurrency(project.total_leasing_expenses)}
                    </p>
                  </div>
                )}
              </div>
            )}
            {expenses.some((e) => e.financing_type === "leasing") && (
              <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Les depenses en credit-bail ne sont pas eligibles aux subventions publiques. Elles ne seront pas prises en compte dans le calcul des aides.
                </span>
              </div>
            )}
            {expenses.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Aucune depense enregistree.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="hidden sm:table-cell">Financement</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow
                      key={expense.id}
                      className={`cursor-pointer ${expense.financing_type === "leasing" ? "opacity-60" : ""}`}
                      onClick={() => {
                        setEditingExpense(expense);
                        setExpenseDialogOpen(true);
                      }}
                    >
                      <TableCell className="font-medium">{expense.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {FINANCING_LABELS[expense.financing_type]}
                        </span>
                        {expense.financing_type === "loan" && expense.loan_rate && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({expense.loan_rate}%)
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExpense(expense.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

        <ExpenseDialog
          projectId={project.id}
          open={expenseDialogOpen}
          onOpenChange={setExpenseDialogOpen}
          expense={editingExpense}
          onSaved={handleExpenseSaved}
        />

        <EditGeneralDialog
          project={project}
          open={editSection === "general"}
          onOpenChange={(o) => !o && setEditSection(null)}
          onSaved={handleProjectUpdated}
        />
        <EditLocationDialog
          project={project}
          company={company}
          open={editSection === "location"}
          onOpenChange={(o) => !o && setEditSection(null)}
          onSaved={handleProjectUpdated}
        />
        <EditContactDialog
          project={project}
          open={editSection === "contact"}
          onOpenChange={(o) => !o && setEditSection(null)}
          onSaved={handleProjectUpdated}
        />
        <EditPermitDialog
          project={project}
          open={editSection === "permit"}
          onOpenChange={(o) => !o && setEditSection(null)}
          onSaved={handleProjectUpdated}
        />
      </div>
    </AppLayout>
  );
}

// ---- Shared ----

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" onClick={onClick}>
      <Pencil className="h-3.5 w-3.5" />
    </Button>
  );
}

// ---- Edit General (name + objective) ----

function EditGeneralDialog({
  project,
  open,
  onOpenChange,
  onSaved,
}: {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (p: Project) => void;
}) {
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(project.name);
      setObjective(project.objective ?? "");
      setError("");
    }
  }, [open, project]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const updated = await updateProject(project.id, {
        name,
        objective: objective || undefined,
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le projet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <FormError message={error} />}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nom du projet</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-objective">Objectif</Label>
            <Textarea
              id="edit-objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooterButtons onCancel={() => onOpenChange(false)} submitting={submitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Edit Location ----

function EditLocationDialog({
  project,
  company,
  open,
  onOpenChange,
  onSaved,
}: {
  project: Project;
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (p: Project) => void;
}) {
  const [isHQ, setIsHQ] = useState(true);
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setIsHQ(project.location_is_headquarters);
      setStreet(project.location_street ?? "");
      setPostalCode(project.location_postal_code ?? "");
      setCity(project.location_city ?? "");
      setDepartment(project.location_department ?? "");
      setRegion(project.location_region ?? "");
      setError("");
    }
  }, [open, project]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const params: Partial<CreateProjectParams> = {
        location_is_headquarters: isHQ,
      };
      if (!isHQ) {
        params.location_street = street || undefined;
        params.location_postal_code = postalCode || undefined;
        params.location_city = city || undefined;
        params.location_department = department || undefined;
        params.location_region = region || undefined;
      }
      const updated = await updateProject(project.id, params);
      onSaved(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la localisation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <FormError message={error} />}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="edit-hq" className="text-sm font-medium">
                Au siege social
              </Label>
              {company?.city && (
                <p className="text-xs text-muted-foreground">
                  {company.street}, {company.postal_code} {company.city}
                </p>
              )}
            </div>
            <Switch id="edit-hq" checked={isHQ} onCheckedChange={setIsHQ} />
          </div>
          {!isHQ && (
            <div className="space-y-2">
              <Label>Adresse du projet</Label>
              <AddressAutocomplete
                value={street ? `${street}, ${postalCode} ${city}` : ""}
                onSelect={(addr: AddressResult) => {
                  setStreet(addr.street);
                  setPostalCode(addr.postal_code);
                  setCity(addr.city);
                  setDepartment(addr.department);
                  setRegion(addr.region);
                }}
              />
              {city && (
                <p className="text-xs text-muted-foreground">
                  {postalCode} {city} — {department}, {region}
                </p>
              )}
            </div>
          )}
          <DialogFooterButtons onCancel={() => onOpenChange(false)} submitting={submitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Edit Contact ----

function EditContactDialog({
  project,
  open,
  onOpenChange,
  onSaved,
}: {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (p: Project) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFirstName(project.contact_first_name ?? "");
      setLastName(project.contact_last_name ?? "");
      setEmail(project.contact_email ?? "");
      setPhone(project.contact_phone ?? "");
      setRole(project.contact_role ?? "");
      setError("");
    }
  }, [open, project]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const updated = await updateProject(project.id, {
        contact_first_name: firstName || undefined,
        contact_last_name: lastName || undefined,
        contact_email: email || undefined,
        contact_phone: phone || undefined,
        contact_role: role || undefined,
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la personne referente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <FormError message={error} />}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cfn">Prenom</Label>
              <Input id="edit-cfn" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cln">Nom</Label>
              <Input id="edit-cln" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-ce">Email</Label>
            <Input id="edit-ce" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cp">
                Telephone <span className="font-normal text-muted-foreground">(optionnel)</span>
              </Label>
              <Input id="edit-cp" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cr">
                Fonction <span className="font-normal text-muted-foreground">(optionnel)</span>
              </Label>
              <Input id="edit-cr" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ex: Directeur technique" />
            </div>
          </div>
          <DialogFooterButtons onCancel={() => onOpenChange(false)} submitting={submitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Edit Permit ----

function EditPermitDialog({
  project,
  open,
  onOpenChange,
  onSaved,
}: {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (p: Project) => void;
}) {
  const [needsPermit, setNeedsPermit] = useState(false);
  const [submissionDate, setSubmissionDate] = useState("");
  const [isExtension, setIsExtension] = useState(false);
  const [areaSqm, setAreaSqm] = useState("");
  const [usageDesc, setUsageDesc] = useState("");
  const [worksStart, setWorksStart] = useState("");
  const [worksDuration, setWorksDuration] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setNeedsPermit(project.needs_building_permit);
      if (project.permit) {
        setSubmissionDate(project.permit.permit_submission_date);
        setIsExtension(project.permit.is_extension);
        setAreaSqm(String(project.permit.area_sqm));
        setUsageDesc(project.permit.usage_description);
        setWorksStart(project.permit.works_start_date);
        setWorksDuration(String(project.permit.works_duration_months));
      } else {
        setSubmissionDate("");
        setIsExtension(false);
        setAreaSqm("");
        setUsageDesc("");
        setWorksStart("");
        setWorksDuration("");
      }
      setError("");
    }
  }, [open, project]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const params: Partial<CreateProjectParams> = {
        needs_building_permit: needsPermit,
      };
      if (needsPermit) {
        params.permit_attributes = {
          ...(project.permit ? { id: project.permit.id } : {}),
          permit_submission_date: submissionDate || undefined,
          is_extension: isExtension,
          area_sqm: areaSqm ? Number(areaSqm) : undefined,
          usage_description: usageDesc || undefined,
          works_start_date: worksStart || undefined,
          works_duration_months: worksDuration ? Number(worksDuration) : undefined,
        } as CreateProjectParams["permit_attributes"];
      } else if (project.permit) {
        params.permit_attributes = {
          id: project.permit.id,
          _destroy: true,
        } as unknown as CreateProjectParams["permit_attributes"];
      }
      const updated = await updateProject(project.id, params);
      onSaved(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier les informations immobilieres</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <FormError message={error} />}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="edit-needs-permit" className="text-sm font-medium">
                Permis de construire necessaire
              </Label>
            </div>
            <Switch id="edit-needs-permit" checked={needsPermit} onCheckedChange={setNeedsPermit} />
          </div>
          {needsPermit && (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-psd">Date de depot du permis</Label>
                <Input id="edit-psd" type="date" value={submissionDate} onChange={(e) => setSubmissionDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Type de projet</Label>
                <Select value={isExtension ? "extension" : "new"} onValueChange={(v) => setIsExtension(v === "extension")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nouveau site</SelectItem>
                    <SelectItem value="extension">Extension</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-area">Surface (m²)</Label>
                  <Input id="edit-area" type="number" min="1" value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dur">Duree des travaux (mois)</Label>
                  <Input id="edit-dur" type="number" min="1" value={worksDuration} onChange={(e) => setWorksDuration(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-usage">Usage prevu</Label>
                <Textarea id="edit-usage" value={usageDesc} onChange={(e) => setUsageDesc(e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ws">Date de debut des travaux</Label>
                <Input id="edit-ws" type="date" value={worksStart} onChange={(e) => setWorksStart(e.target.value)} />
              </div>
            </>
          )}
          <DialogFooterButtons onCancel={() => onOpenChange(false)} submitting={submitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Expense Dialog ----

function ExpenseDialog({
  projectId,
  open,
  onOpenChange,
  expense,
  onSaved,
}: {
  projectId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
  onSaved: (expense: Expense, previous?: Expense) => void;
}) {
  const isEdit = !!expense;
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [financingType, setFinancingType] = useState<FinancingType>("self_funded");
  const [loanRate, setLoanRate] = useState("");
  const [loanFirstPaymentDate, setLoanFirstPaymentDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (expense) {
        setName(expense.name);
        setAmount(String(expense.amount));
        setFinancingType(expense.financing_type);
        setLoanRate(expense.loan_rate ? String(expense.loan_rate) : "");
        setLoanFirstPaymentDate(expense.loan_first_payment_date ?? "");
      } else {
        setName("");
        setAmount("");
        setFinancingType("self_funded");
        setLoanRate("");
        setLoanFirstPaymentDate("");
      }
      setError("");
    }
  }, [open, expense]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const params = {
      name,
      amount: parseFloat(amount),
      financing_type: financingType,
      ...(financingType === "loan"
        ? {
            loan_rate: parseFloat(loanRate),
            loan_first_payment_date: loanFirstPaymentDate,
          }
        : {
            loan_rate: undefined,
            loan_first_payment_date: undefined,
          }),
    };

    try {
      if (expense) {
        const updated = await updateExpense(projectId, expense.id, params);
        onSaved(updated, expense);
      } else {
        const created = await createExpense(projectId, params);
        onSaved(created);
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier la depense" : "Nouvelle depense"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <FormError message={error} />}
          <div className="space-y-2">
            <Label htmlFor="expense-name">Nom</Label>
            <Input
              id="expense-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Achat equipement"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-amount">Montant (EUR)</Label>
            <Input
              id="expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Mode de financement</Label>
            <Select
              value={financingType}
              onValueChange={(v) => setFinancingType(v as FinancingType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self_funded">Autofinancement</SelectItem>
                <SelectItem value="loan">Emprunt</SelectItem>
                <SelectItem value="leasing">Credit-bail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {financingType === "loan" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loan-rate">Taux (%)</Label>
                <Input
                  id="loan-rate"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                  placeholder="3.5"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loan-date">Premiere echeance</Label>
                <Input
                  id="loan-date"
                  type="date"
                  value={loanFirstPaymentDate}
                  onChange={(e) => setLoanFirstPaymentDate(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {financingType === "leasing" && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Les depenses en credit-bail ne sont pas eligibles aux subventions publiques.
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={submitting}
            >
              {submitting
                ? isEdit ? "Modification..." : "Ajout..."
                : isEdit ? "Enregistrer" : "Ajouter la depense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Shared form components ----

function FormError({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </div>
  );
}

function DialogFooterButtons({
  onCancel,
  submitting,
}: {
  onCancel: () => void;
  submitting: boolean;
}) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
        {submitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
}
