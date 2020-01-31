export interface Advertisement {
  id: string;
  url: string;
  imageUrl: string;
  content: string;
  additionalContent: string;
  target: {
    ageFrom: number;
    ageTo: number;
    gender: string;
    zipCode: string;
  };
}
