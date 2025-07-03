// app/api/search/route.ts

import { NextResponse } from 'next/server';
import Fuse from 'fuse.js';

import companies from '../../../esg_companies_output.json';

// Define the type for a single company object based on your JSON structure
export interface Company {
  "Company name": string;
  "Industry group": string;
  Country: string;
  "Full time employees": string;
  "Risk rating score": string;
  "Risk rating assessment": string;
  "Industry group position": string;
  "Industry group positions total": string;
  "Universe position": string;
  "Universe positions total": string;
  "Company description": string;
}

// The GET function handles search requests
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  // If the query is empty or not provided, return all companies
  if (!query) {
    return NextResponse.json(companies);
  }

  // Configure Fuse.js for fuzzy searching on multiple keys
  const fuse = new Fuse(companies as Company[], {
    keys: ['Company name', 'Industry group', 'Country'], // Search by name, industry, or country
    includeScore: true,
    threshold: 0.4, // Adjust threshold for more/less fuzzy matches (0.0 = exact, 1.0 = anything)
  });

  const results = fuse.search(query);

  // Return the matched items, limited to a reasonable number (e.g., 50)
  return NextResponse.json(results.slice(0, 50).map(result => result.item));
}