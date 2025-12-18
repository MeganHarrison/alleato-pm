'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

const URLS = [
  'http://localhost:3000/',
  'http://localhost:3000/dashboard',
  'http://localhost:3000/projects',
  'http://localhost:3000/create-project',
  'http://localhost:3000/financial',
  'http://localhost:3000/budget',
  'http://localhost:3000/budget/line-item/new',
  'http://localhost:3000/contracts',
  'http://localhost:3000/contracts/new',
  'http://localhost:3000/commitments',
  'http://localhost:3000/commitments/new',
  'http://localhost:3000/change-orders',
  'http://localhost:3000/change-orders/new',
  'http://localhost:3000/invoices',
  'http://localhost:3000/invoices/new',
  'http://localhost:3000/forms',
  'http://localhost:3000/create-rfi',
  'http://localhost:3000/auth',
  'http://localhost:3000/auth/login',
  'http://localhost:3000/auth/sign-up',
  'http://localhost:3000/auth/forgot-password',
  'http://localhost:3000/sitemap-view',
];

export default function SitemapViewPage() {
  return (
    <div className="mx-auto max-w-3xl p-2 space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sitemap View</h1>
        <Button asChild>
          <Link href="/sitemap.xml">Open sitemap.xml</Link>
        </Button>
      </div>

      <ul className="space-y-3 pt-8">
        {URLS.map((url) => (
          <li key={url}>
            <div className="text-xs break-all">{url}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}