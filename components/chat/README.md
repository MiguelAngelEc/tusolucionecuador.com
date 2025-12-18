# Chat Widget para TuSolucion.com

Implementación completa de un chatbot AI para el sitio web de TuSolucion.com que se conecta con un webhook de n8n.

## 🚀 Características

- ✅ Widget de chat flotante con diseño responsivo
- ✅ Integración con el botón "Hablar con un Asesor" existente
- ✅ Persistencia de sesión y mensajes en localStorage
- ✅ Manejo robusto de errores con reintentos automáticos
- ✅ Rate limiting para prevenir spam
- ✅ Indicador de "escribiendo..."
- ✅ Validación y sanitización de entradas
- ✅ Soporte para móvil con overlay fullscreen
- ✅ Animaciones suaves y accesibilidad
- ✅ TypeScript estricto para mayor seguridad

## 📦 Estructura de Archivos

```
components/chat/
├── index.ts                 # Exports principales
├── ChatWidget.tsx          # Componente principal del chat
├── ChatMessage.tsx         # Componente de mensaje individual
├── ChatInput.tsx           # Input con botones de sugerencias
├── ChatHeader.tsx          # Header con controles
├── TypingIndicator.tsx     # Animación de "escribiendo..."
├── ChatContext.tsx         # Context Provider de React
├── useChatLogic.ts         # Hook personalizado con lógica
└── README.md               # Este archivo

types/
└── chat.ts                 # Interfaces TypeScript

lib/
├── chatApi.ts              # Funciones API con manejo de errores
├── chatStorage.ts          # LocalStorage para persistencia
└── chatConfig.ts           # Configuración centralizada
```

## 🛠️ Instalación e Integración

### 1. Archivos ya Integrados

El chat ya está completamente integrado en tu proyecto:

- ✅ ChatProvider agregado al layout principal
- ✅ ChatWidget renderizado globalmente
- ✅ Botón "Hablar con un Asesor" conectado

### 2. Variables de Entorno (Opcional)

Puedes configurar el endpoint del webhook en tu archivo `.env.local`:

```bash
NEXT_PUBLIC_CHAT_API_ENDPOINT=http://172.29.89.163:5678/webhook/chat-bienvenida
```

Si no se configura, usará el endpoint por defecto.

### 3. Configuración Adicional

Para personalizar el comportamiento, edita `lib/chatConfig.ts`:

```typescript
export const CHAT_CONFIG = {
  API_ENDPOINT: 'tu-endpoint-aqui',
  TIMEOUT: 10000,              // 10 segundos
  MAX_RETRIES: 3,              // 3 reintentos
  MAX_MESSAGES: 50,            // Máximo mensajes guardados
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  RATE_LIMIT: {
    MAX_MESSAGES_PER_MINUTE: 10,
    MIN_MESSAGE_INTERVAL: 2000, // 2 segundos
  },
} as const;
```

## 📱 Diseño Visual

### Chat Cerrado
- Botón flotante en esquina inferior derecha
- Color: purple-600 (alineado con brand)
- Badge con notificación de mensajes nuevos
- Hover: escala 1.1x con shadow-xl

### Chat Abierto
- **Desktop**: 384px × 600px con esquinas redondeadas
- **Mobile**: Fullscreen con header fijo
- Header degradado purple-600 to purple-800
- Mensajes del usuario: lado derecho, fondo purple-600
- Mensajes del bot: lado izquierdo, fondo blanco
- Input con placeholder y botones de sugerencias

## 🔧 API del Webhook

### Request
```json
{
  "chatInput": "mensaje del usuario",
  "sessionId": "chat_1234567890123_abcdef12345"
}
```

### Response
```json
{
  "output": "respuesta del bot"
}
```

o

```json
{
  "response": "respuesta del bot"
}
```

## 🎯 Uso en Componentes

### Usar el Context

```tsx
import { useChat } from '@/components/chat';

function MiComponente() {
  const { openChat, state } = useChat();

  return (
    <button onClick={openChat}>
      Abrir Chat {state.hasUnreadMessages && '🔴'}
    </button>
  );
}
```

### ChatWidget Independiente

```tsx
import { ChatWidget, ChatProvider } from '@/components/chat';

function MiApp() {
  return (
    <ChatProvider>
      <div>Mi contenido...</div>
      <ChatWidget position="bottom-left" />
    </ChatProvider>
  );
}
```

## 🔒 Seguridad Implementada

### Validación de Entradas
- Sanitización de HTML y scripts
- Límite de 1000 caracteres por mensaje
- Escape de caracteres especiales

### Rate Limiting
- Máximo 10 mensajes por minuto
- Mínimo 2 segundos entre mensajes
- Contador con reset automático

### Manejo de Sesiones
- SessionId seguro con timestamp y random
- Limpieza automática de sesiones expiradas
- Validación de formato de sessionId

### Sanitización de Respuestas
- Remoción de scripts y eventos JavaScript
- Limpieza de protocolos peligrosos
- Validación de estructura de respuesta

## ⚡ Performance

### Optimizaciones Implementadas
- LocalStorage para persistencia sin servidor
- Debouncing en animaciones de typing
- Auto-scroll optimizado con refs
- Lazy loading del componente
- Memorización de componentes pesados

### Bundle Size
- Sin dependencias externas pesadas
- Uso de lucide-react (ya instalado)
- Reutilización de componentes shadcn/ui existentes
- Code splitting automático de Next.js

## 📱 Responsive Design

### Desktop (≥768px)
- Chat flotante en esquina inferior derecha
- Dimensiones: 384px × 600px
- Overlay con backdrop-blur

### Mobile (<768px)
- Fullscreen overlay cuando está abierto
- Header sticky con controles
- Input optimizado para touch
- Teclado virtual friendly

### Tablet (768px - 1024px)
- Comportamiento similar a desktop
- Tamaños ajustados para pantalla táctil

## 🎨 Customización de Estilos

### Colores Principales
```css
--chat-primary: theme('colors.purple.600')
--chat-secondary: theme('colors.gray.50')
--chat-error: theme('colors.red.500')
--chat-success: theme('colors.green.500')
```

### Animaciones
- fade-in-0 slide-in-from-bottom-2 (mensajes)
- animate-bounce con delay (typing indicator)
- hover:scale-110 (botón flotante)
- animate-pulse (badge de notificación)

## 🧪 Testing

### Casos de Uso Testear

1. **Funcionalidad Básica**
   - Abrir/cerrar chat
   - Enviar mensajes
   - Recibir respuestas
   - Persistencia de sesión

2. **Manejo de Errores**
   - Timeout de red
   - Error del servidor
   - Rate limiting
   - Entrada inválida

3. **Responsive**
   - Desktop: botón flotante
   - Mobile: fullscreen
   - Tablet: híbrido

4. **Persistencia**
   - Recargar página
   - Cerrar/abrir navegador
   - Limpieza de sesión expirada

### Comandos de Test

```bash
# Test manual en desarrollo
npm run dev

# Build para verificar compilación
npm run build

# Test TypeScript
npx tsc --noEmit
```

## 🐛 Troubleshooting

### Error: "Module not found: @/components/chat"
**Solución**: Verificar que el archivo `components/chat/index.ts` existe

### Error: "useChat must be used within a ChatProvider"
**Solución**: Verificar que ChatProvider envuelve el componente

### Error: "Timeout: El servidor tardó demasiado"
**Solución**: Verificar que el webhook de n8n está ejecutándose

### Chat no aparece en mobile
**Solución**: Verificar z-index y overlays CSS

### Mensajes no persisten
**Solución**: Verificar permisos de localStorage

### Rate limiting muy agresivo
**Solución**: Ajustar valores en `CHAT_CONFIG.RATE_LIMIT`

## 🔄 Futuras Mejoras

### Features Adicionales
- [ ] Soporte para archivos adjuntos
- [ ] Modo oscuro/claro dinámico
- [ ] Notificaciones de escritorio
- [ ] Historial de conversaciones múltiples
- [ ] Bot con respuestas sugeridas
- [ ] Analytics de uso integrado
- [ ] Internacionalización (i18n)
- [ ] Voice-to-text
- [ ] Emoji picker
- [ ] Modo offline con cola

### Optimizaciones Técnicas
- [ ] Service Worker para cache
- [ ] WebSocket para tiempo real
- [ ] Virtual scrolling para muchos mensajes
- [ ] Compression de mensajes en storage
- [ ] CDN para assets estáticos

## 💡 Notas Importantes

1. **CORS**: Si el webhook está en un dominio diferente, configurar CORS en n8n
2. **HTTPS**: En producción, asegurarse de usar HTTPS para ambos sitios
3. **Backup**: El localStorage puede ser borrado por el usuario
4. **Monitoring**: Implementar logging para errores en producción
5. **Escalabilidad**: Para muchos usuarios, considerar backend real

## 📞 Soporte

Para dudas o problemas con la implementación:

1. Revisar este README
2. Verificar la consola del navegador
3. Testear el webhook directamente
4. Revisar la configuración en `chatConfig.ts`

---

✨ **Chat implementado exitosamente** - Listo para producción con todas las características solicitadas.