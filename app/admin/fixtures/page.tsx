"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);

  const fetchFixtures = async () => {
    const { data } = await supabase
      .from("fixtures")
      .select("*")
      .order("date_time", { ascending: true });

    setFixtures(data || []);
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fixtures</h1>
        <Button asChild>
          <a href="/admin/fixtures/add">Add Fixture</a>
        </Button>
      </div>

      <div className="space-y-4">
        {fixtures.map((m: any) => (
          <Card key={m.id}>
            <CardContent className="p-4 flex justify-between">
              <div>
                <p className="font-semibold">Match #{m.match_no}</p>
                <p>{new Date(m.date_time).toLocaleString("en-AU")}</p>
                <p className="text-sm text-gray-600">{m.venue}</p>
              </div>

              <div className="flex items-center">
                <Button asChild variant="outline">
                  <a href={`/admin/fixtures/${m.id}/edit`}>Edit</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
