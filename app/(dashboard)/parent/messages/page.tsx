import { Mail } from "lucide-react";

export default function ParentMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">Messages</h1>
        <p className="text-sm text-text-secondary mt-1">Communicate with teachers and administration</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-12 text-center">
        <Mail className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-1">Coming Soon</h3>
        <p className="text-sm text-text-secondary">The messaging system is currently under development.</p>
      </div>
    </div>
  );
}
