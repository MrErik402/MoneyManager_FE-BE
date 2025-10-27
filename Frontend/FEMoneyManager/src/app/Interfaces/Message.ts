export interface Message {
  severity: 'success' | 'error' | 'warning' | 'info';
  title: string;
  msg: string;
}