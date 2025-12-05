"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabbedScorecard({
  teamA,
  teamB,
  inningsA,
  inningsB,
  bowlA,
  bowlB
}: any) {

  const [tab, setTab] = useState("a");

  return (
    <div className="mt-10 bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20">

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-white/5 border border-white/10 rounded-full mb-6">
          <TabsTrigger value="a" className="w-1/2">
            {teamA?.name} Innings
          </TabsTrigger>

          <TabsTrigger value="b" className="w-1/2">
            {teamB?.name} Innings
          </TabsTrigger>
        </TabsList>

        {/* TEAM A INNINGS */}
        <TabsContent value="a">
          <h2 className="text-xl font-bold text-green-400 mb-4">
            {teamA?.name} Batting
          </h2>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="text-gray-300">
                <th className="text-left py-2">Batsman</th>
                <th className="text-left">How Out</th>
                <th>R</th>
                <th>B</th>
                <th>4s</th>
                <th>6s</th>
              </tr>
            </thead>
            <tbody>
              {inningsA.map((p: any) => (
                <tr key={p.id} className="border-b border-white/10">
                  <td className="py-2">{p.player_name}</td>
                  <td className="text-gray-400">{p.how_out}</td>
                  <td className="text-center">{p.runs}</td>
                  <td className="text-center">{p.balls}</td>
                  <td className="text-center">{p.fours}</td>
                  <td className="text-center">{p.sixes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-bold text-green-400 mb-4">
            {teamB?.name} Bowling
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-300">
                <th className="text-left py-2">Bowler</th>
                <th>O</th>
                <th>M</th>
                <th>R</th>
                <th>W</th>
                <th>Econ</th>
              </tr>
            </thead>
            <tbody>
              {bowlA.map((p: any) => (
                <tr key={p.id} className="border-b border-white/10">
                  <td className="py-2">{p.player_name}</td>
                  <td className="text-center">{p.overs}</td>
                  <td className="text-center">{p.maidens}</td>
                  <td className="text-center">{p.runs_conceded}</td>
                  <td className="text-center">{p.wickets}</td>
                  <td className="text-center">{p.economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        {/* TEAM B INNINGS */}
        <TabsContent value="b">
          <h2 className="text-xl font-bold text-green-400 mb-4">
            {teamB?.name} Batting
          </h2>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="text-gray-300">
                <th className="text-left py-2">Batsman</th>
                <th className="text-left">How Out</th>
                <th>R</th>
                <th>B</th>
                <th>4s</th>
                <th>6s</th>
              </tr>
            </thead>
            <tbody>
              {inningsB.map((p: any) => (
                <tr key={p.id} className="border-b border-white/10">
                  <td className="py-2">{p.player_name}</td>
                  <td className="text-gray-400">{p.how_out}</td>
                  <td className="text-center">{p.runs}</td>
                  <td className="text-center">{p.balls}</td>
                  <td className="text-center">{p.fours}</td>
                  <td className="text-center">{p.sixes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-bold text-green-400 mb-4">
            {teamA?.name} Bowling
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-300">
                <th className="text-left py-2">Bowler</th>
                <th>O</th>
                <th>M</th>
                <th>R</th>
                <th>W</th>
                <th>Econ</th>
              </tr>
            </thead>
            <tbody>
              {bowlB.map((p: any) => (
                <tr key={p.id} className="border-b border-white/10">
                  <td className="py-2">{p.player_name}</td>
                  <td className="text-center">{p.overs}</td>
                  <td className="text-center">{p.maidens}</td>
                  <td className="text-center">{p.runs_conceded}</td>
                  <td className="text-center">{p.wickets}</td>
                  <td className="text-center">{p.economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
