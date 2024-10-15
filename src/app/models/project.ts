export interface Project {
    id?: number;  // Optionnel car généré par le backend
    name: string;
    description?: string;
    startDate: string;  // Format YYYY-MM-DD
  }
  