import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DocsIndex() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Documentation has been moved to a separate repository.
          </p>
          <p className="mt-4 text-sm">
            Please contact your administrator for access to the documentation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
