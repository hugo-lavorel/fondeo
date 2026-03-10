import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createProject, createProcessItem, type CreateProjectParams, type ProcessItemDirection } from "@/api/projects";
import { getCompany, type Company } from "@/api/company";
import { ApiError } from "@/api/client";
import AddressAutocomplete, { type AddressResult } from "@/components/AddressAutocomplete";
import AppLayout from "@/components/AppLayout";

const STEPS = [
  { key: "general", label: "Projet" },
  { key: "location", label: "Localisation & Contact" },
  { key: "process", label: "Conditionnement" },
  { key: "permit", label: "Immobilier" },
] as const;

const CERTIFICATION_OPTIONS = [
  "Bio",
  "Halal",
  "Casher",
  "AOP",
  "AOC",
  "IGP",
  "Label Rouge",
  "Commerce equitable",
  "Sans gluten",
  "Vegan",
];

type LocalProcessItem = {
  _key: number;
  direction: ProcessItemDirection;
  name: string;
  customs_code: string;
  percentage: string;
  certifications: string[];
};

type FormData = {
  name: string;
  objective: string;
  process_before: string;
  process_after: string;
  location_is_headquarters: boolean;
  location_street: string;
  location_postal_code: string;
  location_city: string;
  location_department: string;
  location_region: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  contact_role: string;
  needs_building_permit: boolean;
  permit_submission_date: string;
  permit_is_extension: boolean;
  permit_area_sqm: string;
  permit_usage_description: string;
  permit_works_start_date: string;
  permit_works_duration_months: string;
};

const INITIAL_FORM: FormData = {
  name: "",
  objective: "",
  process_before: "",
  process_after: "",
  location_is_headquarters: true,
  location_street: "",
  location_postal_code: "",
  location_city: "",
  location_department: "",
  location_region: "",
  contact_first_name: "",
  contact_last_name: "",
  contact_email: "",
  contact_phone: "",
  contact_role: "",
  needs_building_permit: false,
  permit_submission_date: "",
  permit_is_extension: false,
  permit_area_sqm: "",
  permit_usage_description: "",
  permit_works_start_date: "",
  permit_works_duration_months: "",
};

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [processItems, setProcessItems] = useState<LocalProcessItem[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCompany().then(setCompany).catch(() => {});
  }, []);

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function canAdvance(): boolean {
    if (step === 0) {
      return form.name.trim().length > 0;
    }
    if (step === 1) {
      if (!form.location_is_headquarters && !form.location_city) return false;
      return (
        form.contact_first_name.trim().length > 0 &&
        form.contact_last_name.trim().length > 0 &&
        form.contact_email.trim().length > 0
      );
    }
    return true;
  }

  function handleNext(e: FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const params: CreateProjectParams = {
      name: form.name,
      objective: form.objective || undefined,
      process_before: form.process_before || undefined,
      process_after: form.process_after || undefined,
      location_is_headquarters: form.location_is_headquarters,
      contact_first_name: form.contact_first_name || undefined,
      contact_last_name: form.contact_last_name || undefined,
      contact_email: form.contact_email || undefined,
      contact_phone: form.contact_phone || undefined,
      contact_role: form.contact_role || undefined,
      needs_building_permit: form.needs_building_permit,
    };

    if (!form.location_is_headquarters) {
      params.location_street = form.location_street || undefined;
      params.location_postal_code = form.location_postal_code || undefined;
      params.location_city = form.location_city || undefined;
      params.location_department = form.location_department || undefined;
      params.location_region = form.location_region || undefined;
    }

    if (form.needs_building_permit) {
      params.permit_attributes = {
        permit_submission_date: form.permit_submission_date || undefined,
        is_extension: form.permit_is_extension,
        area_sqm: form.permit_area_sqm ? Number(form.permit_area_sqm) : undefined,
        usage_description: form.permit_usage_description || undefined,
        works_start_date: form.permit_works_start_date || undefined,
        works_duration_months: form.permit_works_duration_months
          ? Number(form.permit_works_duration_months)
          : undefined,
      };
    }

    try {
      const project = await createProject(params);

      // Create process items in parallel
      if (processItems.length > 0) {
        await Promise.all(
          processItems.map((pi) =>
            createProcessItem(project.id, {
              direction: pi.direction,
              name: pi.name,
              customs_code: pi.customs_code || undefined,
              percentage: pi.percentage ? parseFloat(pi.percentage) : undefined,
              certifications: pi.certifications,
            })
          )
        );
      }

      navigate(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppLayout>
      <Button variant="ghost" size="sm" className="mb-4" asChild>
        <Link to="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tableau de bord
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nouveau projet</h1>
        <p className="mt-1 text-muted-foreground">
          Renseignez les informations de votre projet en quelques etapes.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                i < step
                  ? "bg-emerald-600 text-white cursor-pointer"
                  : i === step
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            <span
              className={`hidden text-sm sm:inline ${
                i === step ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="mx-2 h-px w-8 bg-border sm:w-12" />
            )}
          </div>
        ))}
      </div>

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {step === 0 && (
            <form onSubmit={handleNext} className="space-y-5">
              <StepGeneral form={form} update={update} />
              <StepFooter
                canAdvance={canAdvance()}
                isLastStep={false}
                submitting={false}
                onBack={handleBack}
                showBack={false}
              />
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-5">
              <StepLocation form={form} update={update} company={company} />
              <StepFooter
                canAdvance={canAdvance()}
                isLastStep={false}
                submitting={false}
                onBack={handleBack}
                showBack
              />
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-5">
              <StepProcess
                items={processItems}
                onChange={setProcessItems}
              />
              <StepFooter
                canAdvance
                isLastStep={false}
                submitting={false}
                onBack={handleBack}
                showBack
              />
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <StepPermit form={form} update={update} />
              <StepFooter
                canAdvance
                isLastStep={step === STEPS.length - 1}
                submitting={submitting}
                onBack={handleBack}
                showBack
              />
            </form>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}

function StepGeneral({
  form,
  update,
}: {
  form: FormData;
  update: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nom du projet</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Ex: Transition energetique usine Nord"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="objective">Objectif du projet</Label>
        <Textarea
          id="objective"
          value={form.objective}
          onChange={(e) => update("objective", e.target.value)}
          placeholder="Decrivez les objectifs principaux du projet, les resultats attendus et l'impact envisage."
          rows={5}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="process_before">Procede de fabrication avant projet</Label>
        <Textarea
          id="process_before"
          value={form.process_before}
          onChange={(e) => update("process_before", e.target.value)}
          placeholder="Detaillez le procede de fabrication actuel, avant la mise en oeuvre du projet."
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="process_after">Procede de fabrication apres projet</Label>
        <Textarea
          id="process_after"
          value={form.process_after}
          onChange={(e) => update("process_after", e.target.value)}
          placeholder="Detaillez le procede de fabrication envisage apres la mise en oeuvre du projet."
          rows={4}
        />
      </div>
    </>
  );
}

function StepLocation({
  form,
  update,
  company,
}: {
  form: FormData;
  update: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  company: Company | null;
}) {
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Lieu du projet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="is_hq" className="text-sm font-medium">
                Au siege social
              </Label>
              {company?.city && (
                <p className="text-xs text-muted-foreground">
                  {company.street}, {company.postal_code} {company.city}
                </p>
              )}
            </div>
            <Switch
              id="is_hq"
              checked={form.location_is_headquarters}
              onCheckedChange={(v) => update("location_is_headquarters", v)}
            />
          </div>

          {!form.location_is_headquarters && (
            <div className="space-y-2">
              <Label>Adresse du projet</Label>
              <AddressAutocomplete
                value={
                  form.location_street
                    ? `${form.location_street}, ${form.location_postal_code} ${form.location_city}`
                    : ""
                }
                onSelect={(addr: AddressResult) => {
                  update("location_street", addr.street);
                  update("location_postal_code", addr.postal_code);
                  update("location_city", addr.city);
                  update("location_department", addr.department);
                  update("location_region", addr.region);
                }}
              />
              {form.location_city && (
                <p className="text-xs text-muted-foreground">
                  {form.location_postal_code} {form.location_city} — {form.location_department},{" "}
                  {form.location_region}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Personne referente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_first_name">Prenom</Label>
              <Input
                id="contact_first_name"
                value={form.contact_first_name}
                onChange={(e) => update("contact_first_name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_last_name">Nom</Label>
              <Input
                id="contact_last_name"
                value={form.contact_last_name}
                onChange={(e) => update("contact_last_name", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={form.contact_email}
              onChange={(e) => update("contact_email", e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">
                Telephone{" "}
                <span className="font-normal text-muted-foreground">(optionnel)</span>
              </Label>
              <Input
                id="contact_phone"
                type="tel"
                value={form.contact_phone}
                onChange={(e) => update("contact_phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_role">
                Fonction{" "}
                <span className="font-normal text-muted-foreground">(optionnel)</span>
              </Label>
              <Input
                id="contact_role"
                value={form.contact_role}
                onChange={(e) => update("contact_role", e.target.value)}
                placeholder="Ex: Directeur technique"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

let _nextKey = 1;

function StepProcess({
  items,
  onChange,
}: {
  items: LocalProcessItem[];
  onChange: (items: LocalProcessItem[]) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LocalProcessItem | null>(null);
  const [dialogDirection, setDialogDirection] = useState<ProcessItemDirection>("input");

  const inputs = items.filter((i) => i.direction === "input");
  const outputs = items.filter((i) => i.direction === "output");

  function handleSave(item: LocalProcessItem) {
    if (editingItem) {
      onChange(items.map((i) => (i._key === item._key ? item : i)));
    } else {
      onChange([...items, item]);
    }
    setDialogOpen(false);
    setEditingItem(null);
  }

  function handleDelete(key: number) {
    onChange(items.filter((i) => i._key !== key));
  }

  function openAdd(direction: ProcessItemDirection) {
    setEditingItem(null);
    setDialogDirection(direction);
    setDialogOpen(true);
  }

  function openEdit(item: LocalProcessItem) {
    setEditingItem(item);
    setDialogDirection(item.direction);
    setDialogOpen(true);
  }

  function totalPct(list: LocalProcessItem[]) {
    return list.reduce((sum, i) => sum + (i.percentage ? parseFloat(i.percentage) : 0), 0);
  }

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Precisez les entrants et sortants du process de production.
      </p>

      {/* Inputs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">Entrants</CardTitle>
              {inputs.length > 0 && (
                <span className={`text-xs ${totalPct(inputs) > 100 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                  {totalPct(inputs)}% / 100%
                </span>
              )}
            </div>
            <Button type="button" size="sm" variant="outline" onClick={() => openAdd("input")}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ProcessItemTable items={inputs} onEdit={openEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      {/* Outputs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">Sortants</CardTitle>
              {outputs.length > 0 && (
                <span className={`text-xs ${totalPct(outputs) > 100 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                  {totalPct(outputs)}% / 100%
                </span>
              )}
            </div>
            <Button type="button" size="sm" variant="outline" onClick={() => openAdd("output")}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ProcessItemTable items={outputs} onEdit={openEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <ProcessItemFormDialog
        open={dialogOpen}
        onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditingItem(null); }}
        item={editingItem}
        direction={dialogDirection}
        siblingItems={items.filter((i) => i.direction === dialogDirection)}
        onSave={handleSave}
      />
    </>
  );
}

function ProcessItemTable({
  items,
  onEdit,
  onDelete,
}: {
  items: LocalProcessItem[];
  onEdit: (item: LocalProcessItem) => void;
  onDelete: (key: number) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="py-2 text-center text-sm text-muted-foreground">
        Aucun element renseigne.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead className="hidden sm:table-cell">Code douanier</TableHead>
          <TableHead className="hidden md:table-cell">Certifications</TableHead>
          <TableHead className="text-right">%</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item._key}
            className="cursor-pointer"
            onClick={() => onEdit(item)}
          >
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">
              {item.customs_code || "—"}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <div className="flex flex-wrap gap-1">
                {item.certifications.length > 0
                  ? item.certifications.map((c) => (
                      <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                    ))
                  : <span className="text-muted-foreground">—</span>}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {item.percentage ? `${item.percentage}%` : "—"}
            </TableCell>
            <TableCell>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item._key);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ProcessItemFormDialog({
  open,
  onOpenChange,
  item,
  direction,
  siblingItems,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: LocalProcessItem | null;
  direction: ProcessItemDirection;
  siblingItems: LocalProcessItem[];
  onSave: (item: LocalProcessItem) => void;
}) {
  const isEdit = !!item;
  const [name, setName] = useState("");
  const [customsCode, setCustomsCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");

  useEffect(() => {
    if (open) {
      if (item) {
        setName(item.name);
        setCustomsCode(item.customs_code);
        setPercentage(item.percentage);
        setCertifications([...item.certifications]);
      } else {
        setName("");
        setCustomsCode("");
        setPercentage("");
        setCertifications([]);
      }
      setCertInput("");
    }
  }, [open, item]);

  const usedPercentage = siblingItems
    .filter((i) => !item || i._key !== item._key)
    .reduce((sum, i) => sum + (i.percentage ? parseFloat(i.percentage) : 0), 0);
  const remainingPercentage = Math.max(0, 100 - usedPercentage);

  function addCertification(cert: string) {
    const trimmed = cert.trim();
    if (trimmed && !certifications.includes(trimmed)) {
      setCertifications([...certifications, trimmed]);
    }
    setCertInput("");
  }

  function removeCertification(cert: string) {
    setCertifications(certifications.filter((c) => c !== cert));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({
      _key: item?._key ?? _nextKey++,
      direction,
      name,
      customs_code: customsCode,
      percentage,
      certifications,
    });
  }

  const directionLabel = direction === "input" ? "entrant" : "sortant";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Modifier l'${directionLabel}` : `Nouvel ${directionLabel}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="npi-name">Nom</Label>
            <Input
              id="npi-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Farine de ble T55"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="npi-customs">Code douanier</Label>
              <Input
                id="npi-customs"
                value={customsCode}
                onChange={(e) => setCustomsCode(e.target.value)}
                placeholder="Ex: 1101 00 15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="npi-pct">Pourcentage (%)</Label>
              <Input
                id="npi-pct"
                type="number"
                min="0"
                max={remainingPercentage}
                step="0.01"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="25"
              />
              <p className="text-xs text-muted-foreground">
                {remainingPercentage < 100
                  ? `${remainingPercentage}% restant`
                  : "100% disponible"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Certifications</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {certifications.map((c) => (
                <Badge key={c} variant="secondary" className="gap-1 pr-1">
                  {c}
                  <button
                    type="button"
                    onClick={() => removeCertification(c)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCertification(certInput);
                  }
                }}
                placeholder="Saisir ou choisir ci-dessous"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CERTIFICATION_OPTIONS.filter((c) => !certifications.includes(c)).map((c) => (
                <Badge
                  key={c}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => addCertification(c)}
                >
                  + {c}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {isEdit ? "Enregistrer" : `Ajouter l'${directionLabel}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StepPermit({
  form,
  update,
}: {
  form: FormData;
  update: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label htmlFor="needs_permit" className="text-sm font-medium">
            Permis de construire necessaire
          </Label>
          <p className="text-xs text-muted-foreground">
            Le projet necessite-t-il un permis de construire ?
          </p>
        </div>
        <Switch
          id="needs_permit"
          checked={form.needs_building_permit}
          onCheckedChange={(v) => update("needs_building_permit", v)}
        />
      </div>

      {form.needs_building_permit && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Details du permis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="permit_date">Date de depot du permis</Label>
              <Input
                id="permit_date"
                type="date"
                value={form.permit_submission_date}
                onChange={(e) => update("permit_submission_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Type de projet</Label>
              <Select
                value={form.permit_is_extension ? "extension" : "new"}
                onValueChange={(v) => update("permit_is_extension", v === "extension")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nouveau site</SelectItem>
                  <SelectItem value="extension">Extension</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Surface (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  value={form.permit_area_sqm}
                  onChange={(e) => update("permit_area_sqm", e.target.value)}
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duree des travaux (mois)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={form.permit_works_duration_months}
                  onChange={(e) => update("permit_works_duration_months", e.target.value)}
                  placeholder="12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage">Usage prevu</Label>
              <Textarea
                id="usage"
                value={form.permit_usage_description}
                onChange={(e) => update("permit_usage_description", e.target.value)}
                placeholder="Ex: Entrepot logistique, bureaux, atelier de production..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="works_start">Date de debut des travaux</Label>
              <Input
                id="works_start"
                type="date"
                value={form.permit_works_start_date}
                onChange={(e) => update("permit_works_start_date", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function StepFooter({
  canAdvance,
  isLastStep,
  submitting,
  onBack,
  showBack,
}: {
  canAdvance: boolean;
  isLastStep: boolean;
  submitting: boolean;
  onBack: () => void;
  showBack: boolean;
}) {
  return (
    <div className="flex justify-between pt-2">
      {showBack ? (
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      ) : (
        <div />
      )}
      <Button
        type="submit"
        className="bg-emerald-600 hover:bg-emerald-700"
        disabled={!canAdvance || submitting}
      >
        {isLastStep ? (
          submitting ? "Creation..." : "Creer le projet"
        ) : (
          <>
            Suivant
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
