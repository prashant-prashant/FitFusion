import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-800/30 px-6 py-4 flex items-center justify-between text-xs text-gray-600">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-brand-500 flex items-center justify-center">
          <Zap size={10} className="text-white" />
        </div>
        <span className="font-semibold text-gray-500">FitFusion</span>
      </div>
      <span>© {new Date().getFullYear()} FitFusion – All rights reserved</span>
      <span className="text-gray-700">v1.0.0</span>
    </footer>
  )
}
