import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { updateAccount, updatePassword, deleteAccount } from "@/api/account";
import { ApiError } from "@/api/client";
import AppLayout from "@/components/AppLayout";

export default function AccountPage() {
  const { user, refreshUser, logout } = useAuth();
  const { data: company } = useCompany();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="mx-auto max-w-xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Mon compte</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez vos informations personnelles et la sécurité de votre compte.
          </p>
        </div>

        <ProfileSection key={user?.email} user={user} onSuccess={refreshUser} />
        <PasswordSection onSuccess={refreshUser} />
        <DangerSection companyName={company?.name} onDeleted={() => logout().then(() => navigate("/"))} />
      </div>
    </AppLayout>
  );
}

function ProfileSection({
  user,
  onSuccess,
}: {
  user: { first_name: string; last_name: string; email: string } | null;
  onSuccess: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    current_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isDirty =
    form.first_name !== (user?.first_name ?? "") ||
    form.last_name !== (user?.last_name ?? "") ||
    form.email !== (user?.email ?? "");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  const mutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: async () => {
      await onSuccess();
      setForm((prev) => ({ ...prev, current_password: "" }));
      setSuccess(true);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    mutation.mutate(form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Modifications enregistrées
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-first-name">Prénom</Label>
              <Input
                id="profile-first-name"
                value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-last-name">Nom</Label>
              <Input
                id="profile-last-name"
                value={form.last_name}
                onChange={(e) => update("last_name", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-current-password">Mot de passe actuel</Label>
            <Input
              id="profile-current-password"
              type="password"
              value={form.current_password}
              onChange={(e) => update("current_password", e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!isDirty || mutation.isPending}
            >
              {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordSection({ onSuccess }: { onSuccess: () => Promise<void> }) {
  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  const mutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: async () => {
      await onSuccess();
      setForm({ current_password: "", password: "", password_confirmation: "" });
      setSuccess(true);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (form.password !== form.password_confirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    mutation.mutate(form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Mot de passe</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Mot de passe mis à jour
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="pwd-current">Mot de passe actuel</Label>
            <Input
              id="pwd-current"
              type="password"
              value={form.current_password}
              onChange={(e) => update("current_password", e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pwd-new">Nouveau mot de passe</Label>
            <Input
              id="pwd-new"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">
              12 caractères minimum, avec majuscule, minuscule et chiffre
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pwd-confirm">Confirmer le nouveau mot de passe</Label>
            <Input
              id="pwd-confirm"
              type="password"
              value={form.password_confirmation}
              onChange={(e) => update("password_confirmation", e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={
                !form.current_password ||
                !form.password ||
                !form.password_confirmation ||
                mutation.isPending
              }
            >
              {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function DangerSection({
  companyName,
  onDeleted,
}: {
  companyName?: string;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: onDeleted,
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue");
    },
  });

  function handleDelete(e: FormEvent) {
    e.preventDefault();
    setError("");
    mutation.mutate({ current_password: currentPassword });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setCurrentPassword("");
      setError("");
    }
  }

  return (
    <>
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Zone de danger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            La suppression de votre compte est irréversible. Toutes vos données
            seront définitivement effacées.
          </p>
          <Button variant="destructive" onClick={() => setOpen(true)}>
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <TriangleAlert className="h-5 w-5" />
              Supprimer votre compte
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cette action est <strong>irréversible</strong>. Seront définitivement supprimés :
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-destructive">•</span>
                Votre compte utilisateur
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-destructive">•</span>
                {companyName ? (
                  <>Votre entreprise <strong>{companyName}</strong></>
                ) : (
                  "Votre entreprise"
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-destructive">•</span>
                Tous vos projets et leurs dépenses associées
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-destructive">•</span>
                Toutes vos données de process (intrants, extrants)
              </li>
            </ul>

            <form onSubmit={handleDelete} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="delete-password">
                  Confirmez avec votre mot de passe actuel
                </Label>
                <Input
                  id="delete-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setError("");
                  }}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={mutation.isPending || !currentPassword}
                >
                  {mutation.isPending ? "Suppression..." : "Supprimer définitivement"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
