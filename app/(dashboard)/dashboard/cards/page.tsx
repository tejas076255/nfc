import React from "react";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceCards } from "@/lib/cards/service";
import { getWorkspaceProfiles } from "@/lib/profiles/service";
import { CardsClientView } from "@/components/cards/CardsClientView";
import { redirect } from "next/navigation";

export default async function DashboardCardsPage() {
  const session = await getCurrentSession();
  if (!session?.workspace) return redirect("/login");

  const [cards, profiles] = await Promise.all([
    getWorkspaceCards(session.workspace.id),
    getWorkspaceProfiles(session.workspace.id),
  ]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
      <CardsClientView
        initialCards={cards}
        profiles={profiles}
        workspaceId={session.workspace.id}
      />
    </div>
  );
}
