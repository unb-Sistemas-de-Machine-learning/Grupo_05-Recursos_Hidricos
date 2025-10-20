// Base mínima de relatórios MOCKADOS para testes de UI.
// userId: referência ao usuário (paciente). Médico/Admin enxergam múltiplos.

export const REPORTS_MOCK = [
  // Gustavo
  {
    id: 'r-001',
    userId: 'u-paciente-1',
    patientName: 'Gustavo Martins Ribeiro',
    date: '2025-09-28T03:26:17Z',
    durationSec: 680,
    target: 45,
    reps: 8,
    status: 'ok',
    pdf: '/reports/relatorio_sessao_2025-09-28-03-26-17.pdf'
  },
  {
    id: 'r-002',
    userId: 'u-paciente-1',
    patientName: 'Gustavo Martins Ribeiro',
    date: '2025-09-28T03:29:08Z',
    durationSec: 920,
    target: 50,
    reps: 10,
    status: 'warn',
    pdf: '/reports/relatorio_sessao_2025-09-28-03-29-08.pdf'
  },

  // Hugo
  {
    id: 'r-101',
    userId: 'u-paciente-2',
    patientName: 'Hugo Rocha de Moura',
    date: '2025-09-28T04:11:48Z',
    durationSec: 540,
    target: 45,
    reps: 6,
    status: 'ok',
    pdf: '/reports/relatorio_sessao_2025-09-28-04-11-48.pdf'
  },
  {
    id: 'r-102',
    userId: 'u-paciente-2',
    patientName: 'Hugo Rocha de Moura',
    date: '2025-09-28T05:27:46Z',
    durationSec: 600,
    target: 60,
    reps: 8,
    status: 'emg',
    pdf: '/reports/relatorio_sessao_2025-09-28-05-27-46.pdf'
  },

  // Extra (outro do dia)
  {
    id: 'r-103',
    userId: 'u-paciente-2',
    patientName: 'Hugo Rocha de Moura',
    date: '2025-09-28T05:37:29Z',
    durationSec: 610,
    target: 48,
    reps: 9,
    status: 'ok',
    pdf: '/reports/relatorio_sessao_2025-09-28-05-37-29.pdf'
  },
];

// Expor para inspeção no console (opcional)
window.__REPORTS_MOCK__ = REPORTS_MOCK;
