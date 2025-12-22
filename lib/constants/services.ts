export interface ServiceWithProfessional {
  icon: string;
  title: string;
  description: string;
  features: string[];
  slug: string;
  professionalImage: string;
  professionalName: string;
  professionalTitle: string;
}

const profesional =[{
  image: "/img-leo.png",
  name: "Lic. Leonela Castillo",
  title: "Especialista Tributaria Certificada"
}]

export const servicesData: ServiceWithProfessional[] = [
  {
    icon: "/img-logos-service/SRI.png",
    title: "Servicios SRI",
    description: "Declaraciones de impuestos, obtención de RUC, certificados tributarios y más.",
    features: ["Declaración IVA", "Declaración Renta", "Certificados SRI"],
    slug: "sri",
    professionalImage: profesional[0].image,
    professionalName: profesional[0].name,
    professionalTitle: profesional[0].title
  },
  {
    icon: "/img-logos-service/judicatura.png",
    title: "Asesoría Legal",
    description: "Servicios legales completos con abogados especializados en derecho ecuatoriano.",
    features: ["Contratos", "Litigios", "Consultoría Legal"],
    slug: "asesoria-legal",
    professionalImage: profesional[0].image,
    professionalName: profesional[0].name,
    professionalTitle: profesional[0].title
  },
  {
    icon: "/img-logos-service/notaria.png",
    title: "Trámites Notariales",
    description: "Gestión de documentos notariales, poderes, escrituras y certificaciones.",
    features: ["Poderes", "Escrituras", "Certificaciones"],
    slug: "tramites-notariales",
    professionalImage: profesional[0].image,
    professionalName: profesional[0].name,
    professionalTitle: profesional[0].title
  },
  {
    icon: "/img-logos-service/empresas.png",
    title: "Constitución de Empresas",
    description: "Creación y registro de compañías con todos los trámites necesarios.",
    features: ["Registro Mercantil", "Estatutos", "Permisos"],
    slug: "constitucion-empresas",
    professionalImage: profesional[0].image,
    professionalName: profesional[0].name,
    professionalTitle: profesional[0].title
  },
  {
    icon: "/img-logos-service/municipios.png",
    title: "Trámites Municipales",
    description: "Permisos de funcionamiento, patentes municipales y certificados.",
    features: ["Patente", "Bomberos", "Uso de Suelo"],
    slug: "tramites-municipales",
    professionalImage: profesional[0].image,
    professionalName: profesional[0].name,
    professionalTitle: profesional[0].title
  },
  {
    icon: "/img-logos-service/IESS.png",
    title: "Trámites IESS",
    description: "Afiliaciones, cese de actividades, solicitudes de información al IESS.",
    features: ["Afiliación", "Cesantía", "Certificados"],
    slug: "tramites-iess",
    professionalImage: profesional[0].image,
    professionalName: profesional[0].name,
    professionalTitle: profesional[0].title
  },
];