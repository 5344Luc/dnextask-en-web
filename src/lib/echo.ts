import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

export const echo = new Echo({
  broadcaster:       'reverb',
  key:               import.meta.env.VITE_REVERB_APP_KEY,
  wsHost:            import.meta.env.VITE_REVERB_HOST,
  wsPort:            import.meta.env.VITE_REVERB_PORT,
  forceTLS:          false,
  enabledTransports: ['ws', 'wss'],
})
