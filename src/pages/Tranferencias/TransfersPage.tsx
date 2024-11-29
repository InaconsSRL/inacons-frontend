import { TransferTable } from "./TransfersTable"

export default function TransfersPage() {
  

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="container mx-auto py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <TransferTable />
          </div>
        </div>
      </main>
    </div>
  )
}

TransfersPage
