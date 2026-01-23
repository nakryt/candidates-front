/**
 * Centralized icon exports from lucide-react
 *
 * This file explicitly imports only the icons we use, enabling better tree-shaking.
 * Instead of importing from 'lucide-react' throughout the app, import from this file.
 *
 * Benefits:
 * - Single source of truth for all icons used in the app
 * - Better tree-shaking (only used icons are bundled)
 * - Easier to audit which icons are being used
 * - Reduced bundle size
 */

export {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Info,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  SearchX,
  Users,
  X,
} from "lucide-react";
