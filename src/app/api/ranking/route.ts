import { NextRequest, NextResponse } from 'next/server';
import { computeAllRankings, getActiveTemporada } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const temp = getActiveTemporada();
  const etapaId = searchParams.get('etapaId') || undefined;
  const rankings = computeAllRankings(temp.id, etapaId);
  return NextResponse.json(rankings);
}

