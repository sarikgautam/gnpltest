"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TeamPage() {
  const params = useParams();
  const teamId = params.id;

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (!error) {
      setTeam(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (teamId) fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-20">
        <p>Loading team…</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto mt-20">
        <p className="text-red-500">Team not found.</p>
      </div>
    );
  }

  // Squad: convert multiline text → list
  const squadList = team.squad_text
    ? team.squad_text.split("\n").filter((p: string) => p.trim().length > 0)
    : [];

  const socials = team.socials || {};

  return (
    <div className="max-w-5xl mx-auto px-4 mt-10 pb-20">
      {/* TEAM HEADER */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-col items-center">
          
          <img
            src={team.logo}
            alt={team.name}
            className="w-32 h-32 rounded-full border object-cover"
          />

          <h1 className="text-3xl font-bold mt-4">{team.name}</h1>

          <p className="text-gray-600 mt-1">
            {team.description || "No description available."}
          </p>

          {team.last_season_rank && (
            <p className="text-sm text-gray-500 mt-3">
              Last Season Rank: {team.last_season_rank}
            </p>
          )}

        </CardHeader>
      </Card>

      <Separator className="my-10" />

      {/* TEAM DETAILS */}
      <Card className="shadow-sm">
        <CardHeader>
          <h2 className="text-xl font-semibold">Team Management</h2>
        </CardHeader>

        <CardContent className="space-y-2">
          <p><strong>Captain:</strong> {team.captain || "N/A"}</p>
          <p><strong>Owner:</strong> {team.owner || "N/A"}</p>
          <p><strong>Manager:</strong> {team.manager || "N/A"}</p>
        </CardContent>
      </Card>

      <Separator className="my-10" />

      {/* SQUAD SECTION */}
      <Card className="shadow-sm">
        <CardHeader>
          <h2 className="text-xl font-semibold">Squad</h2>
        </CardHeader>

        <CardContent>
          {squadList.length === 0 ? (
            <p>No squad added yet.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {squadList.map((player: string, index: number) => (
                <li key={index}>{player}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Separator className="my-10" />

      {/* SOCIAL LINKS */}
      <Card className="shadow-sm">
        <CardHeader>
          <h2 className="text-xl font-semibold">Social Links</h2>
        </CardHeader>

        <CardContent className="space-y-3">
          {socials.facebook && (
            <Button variant="outline" asChild>
              <Link href={socials.facebook} target="_blank">
                Facebook
              </Link>
            </Button>
          )}

          {socials.instagram && (
            <Button variant="outline" asChild>
              <Link href={socials.instagram} target="_blank">
                Instagram
              </Link>
            </Button>
          )}

          {socials.twitter && (
            <Button variant="outline" asChild>
              <Link href={socials.twitter} target="_blank">
                Twitter/X
              </Link>
            </Button>
          )}

          {socials.website && (
            <Button variant="outline" asChild>
              <Link href={socials.website} target="_blank">
                Website
              </Link>
            </Button>
          )}

          {!socials.facebook &&
            !socials.instagram &&
            !socials.twitter &&
            !socials.website && (
              <p className="text-gray-500">No social links added.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
