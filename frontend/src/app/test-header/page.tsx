import { SimplifiedHeader } from "@/components/simplified-header"

export default function TestHeaderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimplifiedHeader />

      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">New Simplified Header Preview</h1>
        <p className="text-gray-600">
          This page demonstrates the new simplified header design matching the reference screenshot.
        </p>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Features:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Clean, dark header (#2d2d2d background)</li>
            <li>ALLEATO GROUP logo on the left</li>
            <li>Project dropdown (currently: Goodwill Bart)</li>
            <li>Tools dropdown (currently: Contracts)</li>
            <li>Right-aligned action icons: Search, Chat, Help, Notifications</li>
            <li>User avatar with ring styling</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
