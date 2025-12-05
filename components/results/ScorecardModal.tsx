"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

export default function ScorecardModal({ open, onClose, result, fixture, teamA, teamB }: any) {
  if (!result || !fixture) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black/80 text-white border border-white/20 max-w-2xl">

        <DialogHeader>
          <DialogTitle className="text-green-400 text-xl">
            Match #{fixture.match_no} – Scorecard
          </DialogTitle>
        </DialogHeader>

        {/* TEAMS HEADER */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <Image src={teamA?.logo || "/no-logo.png"} width={50} height={50} alt="Team A" />
            <p>{teamA?.name}</p>
          </div>

          <p className="text-gray-400">VS</p>

          <div className="flex items-center gap-3">
            <Image src={teamB?.logo || "/no-logo.png"} width={50} height={50} alt="Team B" />
            <p>{teamB?.name}</p>
          </div>
        </div>

        {/* SUMMARY */}
        <p className="mt-4 italic text-gray-300">{result.score_summary}</p>

        {/* SCORE TABLE */}
        <div className="mt-6 grid grid-cols-2 gap-4">

          {/* TEAM A */}
          <div className="bg-white/10 border border-white/20 p-4 rounded-xl">
            <h3 className="text-green-300 font-bold mb-2">{teamA?.name}</h3>
            <p>Runs: {result.team_a_runs}</p>
            <p>Wickets: {result.team_a_wickets}</p>
            <p>Overs: {result.team_a_overs}</p>
          </div>

          {/* TEAM B */}
          <div className="bg-white/10 border border-white/20 p-4 rounded-xl">
            <h3 className="text-green-300 font-bold mb-2">{teamB?.name}</h3>
            <p>Runs: {result.team_b_runs}</p>
            <p>Wickets: {result.team_b_wickets}</p>
            <p>Overs: {result.team_b_overs}</p>
          </div>

        </div>

        {/* PLAYER OF THE MATCH */}
{playerOfMatchName && (
  <div className="bg-yellow-500/10 text-yellow-300 p-4 rounded-lg border border-yellow-500/40">
    <p className="text-lg font-semibold">
      Player of the Match: {playerOfMatchName}
    </p>
  </div>
)}


        {/* CLOSE BTN */}
        <button
          onClick={() => onClose(false)}
          className="mt-6 w-full py-2 bg-green-500 text-black rounded-lg"
        >
          Close
        </button>

      </DialogContent>
    </Dialog>
  );
}
