import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VoiceTextarea } from "@/components/VoiceTextarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateCompany } from "@/hooks/useCompany";
import { EMPLOYEE_RANGES, REVENUE_RANGES } from "@/lib/company-options";
import { ApiError } from "@/api/client";
import type { Company } from "@/api/company";
import { CheckCircle2 } from "lucide-react";
import NafCombobox from "@/components/NafCombobox";
import AddressAutocomplete, { type AddressResult } from "@/components/AddressAutocomplete";

function companyToForm(c: Company) {
  return {
    name: c.name,
    siren: c.siren,
    activity_description: c.activity_description ?? "",
    naf_code: c.naf_code,
    naf_label: c.naf_label,
    street: c.street ?? "",
    postal_code: c.postal_code ?? "",
    city: c.city ?? "",
    department: c.department ?? "",
    region: c.region ?? "",
    employee_range: c.employee_range,
    annual_revenue_range: c.annual_revenue_range,
  };
}

export default function EditCompanyDialog({
  company,
  children,
}: {
  company: Company;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const updateCompanyMutation = useUpdateCompany();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState(() => companyToForm(company));
  const [initialForm, setInitialForm] = useState(() => companyToForm(company));

  const hasChanges = JSON.stringify(form) !== JSON.stringify(initialForm);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      const fresh = companyToForm(company);
      setForm(fresh);
      setInitialForm(fresh);
      setError("");
      setSuccess(false);
    }
  }

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const updated = await updateCompanyMutation.mutateAsync({
        ...form,
        activity_description: form.activity_description || undefined,
        street: form.street || undefined,
        postal_code: form.postal_code || undefined,
        city: form.city || undefined,
        department: form.department || undefined,
        region: form.region || undefined,
      });
      const updatedForm = companyToForm(updated);
      setForm(updatedForm);
      setInitialForm(updatedForm);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Modifier l'entreprise</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Modifications enregistrees
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="company-name">Nom de l'entreprise</Label>
            <Input
              id="company-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-siren">SIREN</Label>
            <Input
              id="company-siren"
              value={form.siren}
              onChange={(e) => update("siren", e.target.value)}
              maxLength={11}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Adresse du siege social</Label>
            <AddressAutocomplete
              value={form.street ? `${form.street}, ${form.postal_code} ${form.city}` : ""}
              onSelect={(addr: AddressResult) => {
                setForm((prev) => ({
                  ...prev,
                  street: addr.street,
                  postal_code: addr.postal_code,
                  city: addr.city,
                  department: addr.department,
                  region: addr.region,
                }));
                setSuccess(false);
              }}
            />
            {form.city && (
              <p className="text-xs text-muted-foreground">
                {form.postal_code} {form.city} — {form.department}, {form.region}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Code NAF</Label>
            <NafCombobox
              value={form.naf_code}
              onSelect={(code, label) => {
                update("naf_code", code);
                update("naf_label", label);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-employee-range">Effectif moyen annuel</Label>
            <Select
              value={form.employee_range}
              onValueChange={(v) => update("employee_range", v)}
            >
              <SelectTrigger id="company-employee-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEE_RANGES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-revenue-range">Chiffre d'affaires annuel</Label>
            <Select
              value={form.annual_revenue_range}
              onValueChange={(v) => update("annual_revenue_range", v)}
            >
              <SelectTrigger id="company-revenue-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REVENUE_RANGES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-activity">
              Activite principale{" "}
              <span className="font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <VoiceTextarea
              id="company-activity"
              value={form.activity_description}
              onChange={(e) => update("activity_description", e.target.value)}
              onValueChange={(v) => update("activity_description", v)}
              placeholder="Decrivez l'activite principale de votre entreprise."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={updateCompanyMutation.isPending || !hasChanges}
            >
              {updateCompanyMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
