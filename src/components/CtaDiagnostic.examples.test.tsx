/**
 * Tests d'exemple — cas d'erreur du CtaDiagnostic (couche de rendu).
 *
 * Couvre — tâche 12.2 :
 * - Indisponibilité de la cible → message d'erreur, contexte préservé
 *   (Requirements 10.4 et 3.6 : la Page_Offres rend ce même composant par
 *   Palier, sa gestion d'erreur vaut donc pour les deux exigences).
 * - Activation nominale → navigation vers la Page_Contact, sans message d'erreur.
 *
 * Harnais : Vitest 3 (globals) + jsdom + @testing-library/react. Le composant
 * dépend de `useNavigate` (TanStack Router). Pour simuler l'indisponibilité de
 * la cible sans navigateur réel, on substitue `useNavigate` par un mock dont on
 * pilote l'issue (résolue / rejetée) test par test. `resolveCta` reste réel :
 * le libellé provient bien de la source unique `CTA_DIAGNOSTIC`.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

/** Mock pilotable de la fonction de navigation renvoyée par `useNavigate`. */
const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return { ...actual, useNavigate: () => navigateMock };
});

// Import après la déclaration du mock (hoisté par Vitest).
import { CtaDiagnostic } from "./CtaDiagnostic";
import { CTA_DIAGNOSTIC } from "@/content/navigation";

beforeEach(() => {
  navigateMock.mockReset();
  cleanup();
});

describe("CtaDiagnostic — gestion de l'indisponibilité de la cible", () => {
  // Requirements 10.4 / 3.6 : cible indisponible → message d'erreur, page conservée.
  it("Requirements 10.4, 3.6 : affiche un message d'indisponibilité et reste sur la page si la navigation échoue", async () => {
    navigateMock.mockRejectedValueOnce(new Error("cible indisponible"));

    render(<CtaDiagnostic />);
    const button = screen.getByRole("button", { name: new RegExp(CTA_DIAGNOSTIC.label) });

    fireEvent.click(button);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/momentanément indisponible/i);

    // Contexte préservé : le bouton (et donc la page courante) reste présent.
    expect(
      screen.getByRole("button", { name: new RegExp(CTA_DIAGNOSTIC.label) }),
    ).toBeInTheDocument();
  });

  // Activation nominale : navigation vers /contact, aucun message d'erreur.
  it("Requirement 10.3 : dirige vers la Page_Contact sans message d'erreur quand la cible est disponible", async () => {
    navigateMock.mockResolvedValueOnce(undefined);

    render(<CtaDiagnostic />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(CTA_DIAGNOSTIC.label) }));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith({ to: CTA_DIAGNOSTIC.target }));
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
