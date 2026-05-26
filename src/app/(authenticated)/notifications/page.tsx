import { Card, CardHeader, CardTitle } from "@/components/ui"

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <div className="p-6 pt-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page des notifications à intégrer.
          </p>
        </div>
      </Card>
    </div>
  )
}
