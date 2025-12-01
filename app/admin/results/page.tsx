"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ResultsPage() {
  const [completedMatches, setCompletedMatches] = useState([]);

  const fetchCompleted = async () => {
    const { data } = await supabase
      .from("fixtures")
      .select("*")
      .eq("status", "completed")
      .order("date_time", { ascending: false });

    setCompletedMatches(data || []);
  };

  useEffect(() => {
    fetchCompleted();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Match Results</h1>
      </div>

      <div className="mt-8 space-y-4">
        {completedMatches.map((m: any) => (
          <Card key={m.id}>
            <CardContent className="p-4 flex justify-between">
              <div>
                <p className="font-semibold">Match #{m.match_no}</p>
                <p>{new Date(m.date_time).toLocaleString("en-AU")}</p>
                <p className="text-sm">{m.venue}</p>
              </div>

              <Button asChild>
                <a href={`/admin/results/${m.id}/add`}>Add Result</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
