export interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
  slug: string; // Identificador único para el archivo markdown
}

export interface ServiceDetail {
  slug: string;
  title: string;
  content: string; // Contenido markdown
}
