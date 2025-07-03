import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const portfolioFilePath = path.join(process.cwd(), 'portfolio.json');

async function getPortfolio() {
  try {
    const data = await fs.readFile(portfolioFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function savePortfolio(portfolio: any) {
  await fs.writeFile(portfolioFilePath, JSON.stringify(portfolio, null, 2));
}

export async function GET(req: NextRequest) {
  const portfolio = await getPortfolio();
  return NextResponse.json(portfolio);
}

export async function POST(req: NextRequest) {
  const company = await req.json();
  const portfolio = await getPortfolio();

  // Avoid adding duplicates
  if (!portfolio.find((c: any) => c['Company name'] === company['Company name'])) {
    portfolio.push(company);
    await savePortfolio(portfolio);
  }

  return NextResponse.json(portfolio);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyName = searchParams.get('companyName');

  if (!companyName) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
  }

  const portfolio = await getPortfolio();
  const updatedPortfolio = portfolio.filter((company: any) => company['Company name'] !== companyName);
  
  await savePortfolio(updatedPortfolio);
  
  return NextResponse.json(updatedPortfolio);
}