// SERVER COMPONENT WRAPPER (required)
import PlayerStatsClient from "./PlayerStatsClient";

export default async function PlayerStatsPage({ params }: any) {
  const matchId = (await params).id; // ✅ unwrap Promise

  return <PlayerStatsClient matchId={matchId} />;
}
