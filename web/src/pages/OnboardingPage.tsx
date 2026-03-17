import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VoiceTextarea } from "@/components/VoiceTextarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createCompany } from "@/api/company";
import { ApiError } from "@/api/client";
import { EMPLOYEE_RANGES, REVENUE_RANGES } from "@/lib/company-options";
import NafCombobox from "@/components/NafCombobox";
import AddressAutocomplete, { type AddressResult } from "@/components/AddressAutocomplete";

export default function OnboardingPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    siren: "",
    activity_description: "",
    naf_code: "",
    naf_label: "",
    street: "",
    postal_code: "",
    city: "",
    department: "",
    region: "",
    employee_range: "",
    annual_revenue_range: "",
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.naf_code) {
      setError("Veuillez selectionner un code NAF");
      return;
    }

    setSubmitting(true);

    try {
      await createCompany({
        ...form,
        activity_description: form.activity_description || undefined,
        street: form.street || undefined,
        postal_code: form.postal_code || undefined,
        city: form.city || undefined,
        department: form.department || undefined,
        region: form.region || undefined,
      });
      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-2xl">Votre entreprise</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ces informations nous permettent de trouver les subventions adaptees a votre profil.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'entreprise</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Acme SAS"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siren">SIREN</Label>
              <Input
                id="siren"
                value={form.siren}
                onChange={(e) => update("siren", e.target.value)}
                placeholder="123 456 789"
                maxLength={11}
                required
              />
              <p className="text-xs text-muted-foreground">9 chiffres, disponible sur votre Kbis</p>
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
              <Label htmlFor="employee_range">Effectif moyen annuel</Label>
              <Select
                value={form.employee_range}
                onValueChange={(v) => update("employee_range", v)}
                required
              >
                <SelectTrigger id="employee_range">
                  <SelectValue placeholder="Selectionnez une tranche" />
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
              <Label htmlFor="annual_revenue_range">Chiffre d'affaires annuel</Label>
              <Select
                value={form.annual_revenue_range}
                onValueChange={(v) => update("annual_revenue_range", v)}
                required
              >
                <SelectTrigger id="annual_revenue_range">
                  <SelectValue placeholder="Selectionnez une tranche" />
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
              <Label htmlFor="activity_description">
                Activite principale{" "}
                <span className="font-normal text-muted-foreground">(optionnel)</span>
              </Label>
              <VoiceTextarea
                id="activity_description"
                value={form.activity_description}
                onChange={(e) => update("activity_description", e.target.value)}
                onValueChange={(v) => update("activity_description", v)}
                placeholder="Decrivez en quelques lignes l'activite principale de votre entreprise. Ce texte sera reutilise dans vos dossiers de subvention."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={submitting}
            >
              {submitting ? "Creation..." : "Enregistrer et continuer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
