export interface Reservation {
  id: number;
  nomClient: string;
  emailClient: string;
  // Add more fields if needed
}

export interface Event {
  idEvenement: number;
  titre: string;
  type: string;
  nombrePlase: number;
  description: string;
  dateDebut: string;
  dateFin: string;
  reservations: Reservation[];
}
