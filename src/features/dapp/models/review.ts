export interface Review {
  dappId: string;
  rating: number;
  comment?: string | undefined;
  userId?: string | null;
  userName?: string;
  userAddress?: string;
}
