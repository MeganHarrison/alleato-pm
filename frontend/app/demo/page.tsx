import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DemoPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Component Demos</h1>
      
      <div className="grid gap-4">
        <Link href="/demo/infinite-query">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Infinite Query Hook - Commitments</CardTitle>
              <CardDescription>
                Demonstrates the Supabase infinite query hook with pagination and real-time data loading
                from the commitments table.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/demo/documents-infinite">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Infinite Query Hook - Documents</CardTitle>
              <CardDescription>
                Advanced demonstration with the document_metadata table featuring filtering, 
                rich metadata display, and complex data relationships.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}