
export interface Appointment {
  id: string;
  clientName: string;
  company: string;
  address: string;
  phone: string;
  email: string;
  salesRep: string;
  date: string;
  time: string;
  purpose: string;
  notes: string;
  createdAt: string;
}

export type SalesRep = {
  id: string;
  name: string;
  region: string;
};

export const SALES_REPS: SalesRep[] = [
  { id: '1', name: 'Jean Dupont', region: 'Nord' },
  { id: '2', name: 'Marie Leroy', region: 'Sud' },
  { id: '3', name: 'Thomas Bernard', region: 'Est' },
  { id: '4', name: 'Sophie Petit', region: 'Ouest' },
];
