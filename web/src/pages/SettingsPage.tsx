import { useEffect, useState, type FormEvent } from "react";
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
import { getCompany, updateCompany, type Company } from "@/api/company";
import { SECTORS, EMPLOYEE_RANGES, REVENUE_RANGES } from "@/lib/company-options";
import { ApiError } from "@/api/client";
import { CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    siren: "",
    activity_description: "",
    sector: "",
    employee_range: "",
    annual_revenue_range: "",
    has_rd_team: false,
  });

  useEffect(() => {
    getCompany()
      .then((c) => {
        setCompany(c);
        setForm({
          name: c.name,
          siren: c.siren,
          activity_description: c.activity_description ?? "",
          sector: c.sector,
          employee_range: c.employee_range,
          annual_revenue_range: c.annual_revenue_range,
          has_rd_team: c.has_rd_team,
        });
      })
      .catch(() => setCompany(null))
      .finally(() => setLoading(false));
  }, []);

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const updated = await updateCompany({
        ...form,
        activity_description: form.activity_description || undefined,
      });
      setCompany(updated);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    } finally {
      setSaving(false);
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

  if (!company) {
    return (
      <AppLayout>
        <p className="text-muted-foreground">Aucune entreprise trouvee.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Parametres</h1>
        <p className="mt-1 text-muted-foreground">
          Modifiez les informations de votre entreprise.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations de l'entreprise</CardTitle>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="name">Nom de l'entreprise</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siren">SIREN</Label>
              <Input
                id="siren"
                value={form.siren}
                onChange={(e) => update("siren", e.target.value)}
                maxLength={11}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Secteur d'activite</Label>
              <Select value={form.sector} onValueChange={(v) => update("sector", v)}>
                <SelectTrigger id="sector">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_range">Effectif moyen annuel</Label>
              <Select
                value={form.employee_range}
                onValueChange={(v) => update("employee_range", v)}
              >
                <SelectTrigger id="employee_range">
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
              <Label htmlFor="annual_revenue_range">Chiffre d'affaires annuel</Label>
              <Select
                value={form.annual_revenue_range}
                onValueChange={(v) => update("annual_revenue_range", v)}
              >
                <SelectTrigger id="annual_revenue_range">
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

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="has_rd_team" className="text-sm font-medium">
                  Equipe R&D
                </Label>
                <p className="text-xs text-muted-foreground">
                  Disposez-vous d'une equipe de recherche et developpement ?
                </p>
              </div>
              <Switch
                id="has_rd_team"
                checked={form.has_rd_team}
                onCheckedChange={(v) => update("has_rd_team", v)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity_description">
                Activite principale{" "}
                <span className="font-normal text-muted-foreground">(optionnel)</span>
              </Label>
              <Textarea
                id="activity_description"
                value={form.activity_description}
                onChange={(e) => update("activity_description", e.target.value)}
                placeholder="Decrivez l'activite principale de votre entreprise."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={saving}
            >
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
